import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addDays, format, startOfDay } from 'date-fns';

export async function GET(
  req: NextRequest,
  { params }: { params: { sku_code: string } }
) {
  try {
    const skuCode = params.sku_code;
    const warehouseCode = req.nextUrl.searchParams.get('warehouse') || 'TOTAL';

    // 1. Lấy cấu hình SKU và ADO gần nhất
    const sku = await prisma.sku.findUnique({
      where: { skuCode },
      include: {
        alerts: {
          where: { type: 'STOCK_LEVEL', warehouseCode, status: 'open' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!sku) {
      return NextResponse.json({ error: 'Không tìm thấy SKU' }, { status: 404 });
    }

    const ado = sku.alerts[0]?.ado || 0;
    const currentStock = sku.alerts[0]?.currentStock || 0;
    const safetyStockUnits = ado * sku.safetyStockDays;

    // 2. Lấy danh sách PO đang về cho SKU này
    const openPos = await prisma.purchaseOrder.findMany({
      where: {
        skuCode,
        status: { in: ['pending', 'confirmed', 'delayed'] },
        expectedArrivalDate: { gte: new Date() }
      },
      orderBy: { expectedArrivalDate: 'asc' }
    });

    // 3. Dự báo trong 30 ngày tới
    const forecast = [];
    let projectedStock = currentStock;
    const today = startOfDay(new Date());

    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');

      // Cộng dồn hàng về từ PO trong ngày này
      const arrivingQty = openPos
        .filter(po => format(po.expectedArrivalDate, 'yyyy-MM-dd') === dateStr)
        .reduce((sum, po) => sum + po.orderedQuantity, 0);
      
      projectedStock = projectedStock - ado + arrivingQty;
      
      // Không để tồn kho âm (giả thiết thực tế)
      const displayStock = Math.max(0, projectedStock);

      forecast.push({
        date: dateStr,
        stock: Math.round(displayStock),
        safetyStock: Math.round(safetyStockUnits),
        isArrival: arrivingQty > 0
      });
    }

    return NextResponse.json({
      skuCode,
      productName: sku.productName,
      ado,
      currentStock,
      safetyStockUnits,
      forecast
    });

  } catch (error) {
    console.error('Forecast API Error:', error);
    return NextResponse.json({ error: 'Lỗi khi tính toán dự báo' }, { status: 500 });
  }
}
