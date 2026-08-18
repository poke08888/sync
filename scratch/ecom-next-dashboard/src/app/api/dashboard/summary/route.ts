import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const warehouseCode = searchParams.get('warehouseCode') || 'TOTAL';

    const totalSkus = await prisma.sku.count();
    
    // Đếm số lượng alert theo mức độ khẩn cấp và kho hàng
    const alerts = await prisma.replenishmentAlert.findMany({
      where: { 
        status: 'open', 
        type: 'STOCK_LEVEL',
        warehouseCode: warehouseCode
      },
      select: { priority: true }
    });

    const criticalCount = alerts.filter(a => a.priority === 'CRITICAL').length;
    const warningCount = alerts.filter(a => a.priority === 'WARNING').length;

    // Đếm PO cần xác nhận hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const pendingConfirmationCount = await prisma.purchaseOrder.count({
      where: {
        status: 'pending',
        expectedArrivalDate: { gte: today, lt: tomorrow }
      }
    });

    // Tính tổng giá trị hàng đang về
    const inTransitPos = await prisma.purchaseOrder.findMany({
      where: { status: { in: ['pending', 'confirmed', 'delayed'] } },
      include: { sku: true }
    });

    const totalInTransitValue = inTransitPos.reduce((sum, po) => {
      return sum + (po.orderedQuantity * (po.sku.unitCost || 0));
    }, 0);

    return NextResponse.json({
      totalSkus,
      criticalCount,
      warningCount,
      pendingConfirmationCount,
      totalInTransitValue,
    });
  } catch (error) {
    console.error('Summary API Error:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy dữ liệu tổng hợp' }, { status: 500 });
  }
}
