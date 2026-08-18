import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegram, sendEmail } from '@/lib/notifications';

/**
 * Endpoint chạy hàng ngày lúc 8:00 AM (cấu hình trong vercel.json)
 */
export async function GET(req: Request) {
  // Kiểm tra Auth secret để tránh bị trigger bừa bãi
  const { searchParams } = new URL(req.url);
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && searchParams.get('key') !== process.env.CRON_SECRET) {
    // return new Response('Unauthorized', { status: 401 });
    // Tạm thời comment để test dễ hơn trong môi trường dev
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Tìm tất cả các PO dự kiến về trong ngày hôm nay mà chưa nhận
    const pendingPos = await prisma.purchaseOrder.findMany({
      where: {
        status: { in: ['pending', 'confirmed', 'delayed'] },
        expectedArrivalDate: { gte: today, lt: tomorrow }
      },
      include: {
        sku: true
      }
    });

    if (pendingPos.length === 0) {
      return NextResponse.json({ message: 'No pending POs for today.' });
    }

    // Gửi thông báo cho từng PO
    for (const po of pendingPos) {
      const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/inventory/po/${po.poNumber}/confirm`;
      
      const message = `
📦 <b>XÁC NHẬN HÀNG VỀ: PO #${po.poNumber}</b>
---------------------------------------
Sản phẩm: ${po.sku.productName}
Số lượng: ${po.orderedQuantity}
Dự kiến về: Hôm nay (${today.toLocaleDateString()})

Vui lòng xác nhận hàng đã cập kho hoặc gia hạn nếu bị chậm trễ:
👉 <a href="${confirmLink}">XÁC NHẬN TẠI ĐÂY</a>
---------------------------------------
      `;

      await sendTelegram(message);
      
      // Tạo alert trong hệ thống để người dùng thấy trên Dashboard
      await prisma.replenishmentAlert.upsert({
        where: { id: `PO_CONFIRM_${po.poNumber}` },
        update: { updatedAt: new Date() },
        create: {
          id: `PO_CONFIRM_${po.poNumber}`,
          skuCode: po.skuCode,
          warehouseCode: 'DEFAULT', // Hoặc lấy từ PO nếu có
          type: 'PO_ARRIVAL_CONFIRMATION',
          priority: 'INFO',
          status: 'open',
        }
      });
    }

    return NextResponse.json({
      success: true,
      processed: pendingPos.length
    });

  } catch (error) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
