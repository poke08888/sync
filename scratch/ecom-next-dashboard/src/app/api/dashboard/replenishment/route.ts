import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const warehouseCode = searchParams.get('warehouseCode') || 'TOTAL';

    // Lấy tất cả các Alert đang mở để hiển thị tình trạng hiện tại
    const alerts = await prisma.replenishmentAlert.findMany({
      where: { 
        status: 'open', 
        type: 'STOCK_LEVEL',
        warehouseCode: warehouseCode
      },
      include: {
        sku: {
          include: {
            supplier: true
          }
        }
      },
      orderBy: [
        { priority: 'asc' }, // Giả sử độ ưu tiên sắp xếp theo bảng chữ cái (C < I < W - không chuẩn lắm nhưng tạm thời)
        { daysRemaining: 'asc' }
      ]
    });

    // Remap priority để sort đúng: CRITICAL > WARNING > INFO
    const priorityWeight: any = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    const sortedAlerts = alerts.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);

    const formattedData = await Promise.all(sortedAlerts.map(async (alert) => {
      // Tìm tồn kho tại các kho khác để gợi ý luân chuyển
      const otherSnapshots = await prisma.inventorySnapshot.findMany({
        where: {
          skuCode: alert.skuCode,
          warehouseCode: { notIn: [warehouseCode, 'TOTAL'] },
        },
        orderBy: { date: 'desc' },
        distinct: ['warehouseCode'],
      });

      return {
        id: alert.id,
        skuCode: alert.skuCode,
        productName: alert.sku.productName,
        supplierName: alert.sku.supplier.name,
        warehouseCode: alert.warehouseCode,
        currentStock: alert.currentStock,
        netStock: alert.netStock,
        ado: alert.ado,
        daysRemaining: alert.daysRemaining,
        reorderDate: alert.reorderDate,
        recommendedQty: alert.recommendedQty,
        priority: alert.priority,
        unitCost: alert.sku.unitCost,
        estimatedCost: alert.estimatedCost,
        otherStocks: otherSnapshots.map(s => ({
          warehouse: s.warehouseCode,
          stock: s.currentStock
        }))
      };
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Replenishment API Error:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy dữ liệu tái cung ứng' }, { status: 500 });
  }
}
