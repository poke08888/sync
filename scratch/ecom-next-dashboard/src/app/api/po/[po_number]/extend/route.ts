import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runReplenishmentCalculation } from '@/lib/replenishment-engine';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { po_number: string } }
) {
  try {
    const poNumber = params.po_number;
    const { newDate, reason } = await req.json();

    if (!newDate) {
      return NextResponse.json({ error: 'Ngày mới không hợp lệ' }, { status: 400 });
    }

    const targetPo = await prisma.purchaseOrder.findUnique({
      where: { poNumber }
    });

    if (!targetPo) {
      return NextResponse.json({ error: 'Không tìm thấy PO' }, { status: 404 });
    }

    const updatedPo = await prisma.$transaction(async (tx) => {
      // 1. Tạo bản ghi delay
      await tx.purchaseOrderDelay.create({
        data: {
          poId: targetPo.id,
          originalDate: targetPo.expectedArrivalDate,
          newDate: new Date(newDate),
          reason,
        }
      });

      // 2. Cập nhật PO
      return await tx.purchaseOrder.update({
        where: { poNumber },
        data: {
          expectedArrivalDate: new Date(newDate),
          status: 'delayed',
          updatedAt: new Date()
        }
      });
    });

    // Kích hoạt tính toán lại (vì ngày dự kiến mới ảnh hưởng đến Reorder Date)
    await runReplenishmentCalculation(updatedPo.skuCode);

    return NextResponse.json({ success: true, po: updatedPo });
  } catch (error) {
    console.error('PO Extend Error:', error);
    return NextResponse.json({ error: 'Không thể gia hạn PO' }, { status: 500 });
  }
}
