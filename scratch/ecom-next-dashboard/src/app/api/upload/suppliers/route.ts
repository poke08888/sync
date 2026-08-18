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
          if (!row.supplier_code || !row.supplier_name) {
            errors.push({ row, error: 'Thiếu mã hoặc tên nhà cung cấp' });
            continue;
          }

          await tx.supplier.upsert({
            where: { code: row.supplier_code },
            update: {
              name: row.supplier_name,
              defaultLeadTime: parseInt(row.default_lead_time) || 14,
              contactEmail: row.contact_email,
            },
            create: {
              code: row.supplier_code,
              name: row.supplier_name,
              defaultLeadTime: parseInt(row.default_lead_time) || 14,
              contactEmail: row.contact_email,
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
          fileType: 'SUPPLIER',
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
