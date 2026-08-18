import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { rows, fileName, uploadedBy } = data;

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    let processedCount = 0;
    const errors: any[] = [];

    await prisma.$transaction(async (tx) => {
      for (const row of rows) {
        try {
          if (!row.sku_code || !row.supplier_code) {
            errors.push({ row, error: 'Thiếu sku_code hoặc supplier_code' });
            continue;
          }

          // Kiểm tra supplier tồn tại
          const supplier = await tx.supplier.findUnique({
            where: { code: row.supplier_code }
          });

          if (!supplier) {
            errors.push({ row, error: `Không tìm thấy nhà cung cấp với mã: ${row.supplier_code}. Vui lòng upload Supplier Master trước.` });
            continue;
          }

          await tx.sku.upsert({
            where: { skuCode: row.sku_code },
            update: {
              productName: row.product_name || 'No Name',
              supplierCode: row.supplier_code,
              leadTimeDays: parseInt(row.lead_time_days) || 14,
              safetyStockDays: parseInt(row.safety_stock_days) || 7,
              reorderCycleDays: parseInt(row.reorder_cycle_days) || 30,
              minOrderQuantity: parseInt(row.min_order_quantity) || 1,
              unitCost: parseFloat(row.unit_cost) || 0,
            },
            create: {
              skuCode: row.sku_code,
              productName: row.product_name || 'No Name',
              supplierCode: row.supplier_code,
              leadTimeDays: parseInt(row.lead_time_days) || 14,
              safetyStockDays: parseInt(row.safety_stock_days) || 7,
              reorderCycleDays: parseInt(row.reorder_cycle_days) || 30,
              minOrderQuantity: parseInt(row.min_order_quantity) || 1,
              unitCost: parseFloat(row.unit_cost) || 0,
            }
          });

          processedCount++;
        } catch (err: any) {
          errors.push({ row, error: err.message });
        }
      }

      await tx.uploadLog.create({
        data: {
          fileName,
          fileType: 'SKU_MASTER',
          rowsProcessed: processedCount,
          errors: errors.length > 0 ? (errors as any) : undefined,
          uploadedBy,
        }
      });
    });

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
