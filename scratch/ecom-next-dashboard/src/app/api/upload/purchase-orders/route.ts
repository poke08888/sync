import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runReplenishmentCalculation } from '@/lib/replenishment-engine';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { rows, fileName, uploadedBy } = data;

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    let processedCount = 0;
    const errors: any[] = [];
    const affectedSkuCodes = new Set<string>();

    await prisma.$transaction(async (tx) => {
      for (const row of rows) {
        try {
          if (!row.po_number || !row.sku_code || !row.supplier_code) {
            errors.push({ row, error: 'Thiếu po_number, sku_code hoặc supplier_code' });
            continue;
          }

          const expectedDate = new Date(row.expected_arrival_date);
          const orderDate = new Date(row.order_date);

          if (isNaN(expectedDate.getTime()) || isNaN(orderDate.getTime())) {
            errors.push({ row, error: 'Ngày tháng không hợp lệ' });
            continue;
          }

          if (expectedDate < orderDate) {
            errors.push({ row, error: 'Ngày đến dự kiến không được trước ngày đặt hàng' });
            continue;
          }

          // Kiểm tra SKU tồn tại
          const sku = await tx.sku.findUnique({ where: { skuCode: row.sku_code } });
          if (!sku) {
            errors.push({ row, error: `Mã SKU ${row.sku_code} không tồn tại trong danh mục SKU Master.` });
            continue;
          }

          // Lấy PO hiện tại để kiểm tra delay
          const existingPo = await tx.purchaseOrder.findUnique({
            where: { poNumber: row.po_number }
          });

          const newStatus = row.status || 'pending';

          const po = await tx.purchaseOrder.upsert({
            where: { poNumber: row.po_number },
            update: {
              skuCode: row.sku_code,
              supplierCode: row.supplier_code,
              orderedQuantity: parseInt(row.ordered_quantity) || 0,
              expectedArrivalDate: expectedDate,
              orderDate: orderDate,
              status: newStatus,
            },
            create: {
              poNumber: row.po_number,
              skuCode: row.sku_code,
              supplierCode: row.supplier_code,
              orderedQuantity: parseInt(row.ordered_quantity) || 0,
              expectedArrivalDate: expectedDate,
              orderDate: orderDate,
              status: newStatus,
            }
          });

          // Nếu có sự thay đổi ngày đến dự kiến (Delayed)
          if (existingPo && existingPo.expectedArrivalDate.getTime() !== expectedDate.getTime()) {
            await tx.purchaseOrderDelay.create({
              data: {
                poId: po.id,
                originalDate: existingPo.expectedArrivalDate,
                newDate: expectedDate,
                reason: 'Cập nhật từ file Excel',
              }
            });
          }

          affectedSkuCodes.add(row.sku_code);
          processedCount++;
        } catch (err: any) {
          errors.push({ row, error: err.message });
        }
      }

      await tx.uploadLog.create({
        data: {
          fileName,
          fileType: 'PO',
          rowsProcessed: processedCount,
          errors: errors.length > 0 ? (errors as any) : undefined,
          uploadedBy,
        }
      });
    });

    // Kích hoạt engine cho các SKU liên quan
    for (const skuCode of affectedSkuCodes) {
      await runReplenishmentCalculation(skuCode);
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      errors: errors.length,
      details: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
