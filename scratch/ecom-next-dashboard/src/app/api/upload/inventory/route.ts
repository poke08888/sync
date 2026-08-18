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

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    await prisma.$transaction(async (tx) => {
      for (const row of rows) {
        try {
          // Validation cơ bản
          if (!row.sku_code || !row.date || !row.warehouse_code) {
            errors.push({ row, error: 'Thiếu thông tin bắt buộc (sku_code, date, warehouse_code)' });
            continue;
          }

          const snapshotDate = new Date(row.date);
          if (isNaN(snapshotDate.getTime())) {
            errors.push({ row, error: 'Ngày tháng không hợp lệ' });
            continue;
          }

          // Upsert InventorySnapshot
          await tx.inventorySnapshot.upsert({
            where: {
              skuCode_warehouseCode_date: {
                skuCode: row.sku_code,
                warehouseCode: row.warehouse_code,
                date: snapshotDate,
              }
            },
            update: {
              currentStock: parseInt(row.current_stock) || 0,
              dailyOutbound: parseInt(row.daily_outbound) || 0,
            },
            create: {
              skuCode: row.sku_code,
              warehouseCode: row.warehouse_code,
              date: snapshotDate,
              currentStock: parseInt(row.current_stock) || 0,
              dailyOutbound: parseInt(row.daily_outbound) || 0,
            }
          });

          affectedSkuCodes.add(row.sku_code);
          processedCount++;
        } catch (err: any) {
          errors.push({ row, error: err.message });
        }
      }

      // Lưu log upload
      await tx.uploadLog.create({
        data: {
          fileName,
          fileType: 'INVENTORY',
          rowsProcessed: processedCount,
          errors: errors.length > 0 ? (errors as any) : undefined,
          uploadedBy,
        }
      });
    });

    // Kích hoạt engine tính toán cho các SKU bị ảnh hưởng
    // Lưu ý: Trong thực tế nên chạy cái này qua worker/queue nếu dữ liệu lớn
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
    return NextResponse.json({ error: 'Lỗi hệ thống khi xử lý file' }, { status: 500 });
  }
}
