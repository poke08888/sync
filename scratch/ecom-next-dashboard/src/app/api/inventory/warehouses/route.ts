import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const warehouses = await prisma.inventorySnapshot.findMany({
      select: { warehouseCode: true },
      distinct: ['warehouseCode'],
    });

    const codes = warehouses.map(w => w.warehouseCode);
    
    return NextResponse.json({
      codes: ['TOTAL', ...codes.filter(c => c !== 'TOTAL')]
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch warehouses' }, { status: 500 });
  }
}
