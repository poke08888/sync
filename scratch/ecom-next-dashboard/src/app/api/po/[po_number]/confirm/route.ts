import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runReplenishmentCalculation } from '@/lib/replenishment-engine';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { po_number: string } }
) {
  try {
    const poNumber = params.po_number;

    const updatedPo = await prisma.purchaseOrder.update({
      where: { poNumber },
      data: {
        status: 'received',
        updatedAt: new Date()
      }
    });

    // Sau khi hàng về, kích hoạt tính toán lại để cập nhật Net Stock & Alerts
    await runReplenishmentCalculation(updatedPo.skuCode);

    return NextResponse.json({ success: true, po: updatedPo });
  } catch (error) {
    console.error('PO Confirm Error:', error);
    return NextResponse.json({ error: 'Không thể xác nhận PO' }, { status: 500 });
  }
}
