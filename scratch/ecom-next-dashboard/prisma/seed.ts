import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING INVENTORY REPLENISHMENT SYSTEM ---');

  // 1. Seed Suppliers
  const sup1 = await prisma.supplier.upsert({
    where: { code: 'SUP-001' },
    update: {},
    create: {
      code: 'SUP-001',
      name: 'Asia Trading Service',
      defaultLeadTime: 14,
      contactEmail: 'contact@asiatrading.com',
    }
  });

  const sup2 = await prisma.supplier.upsert({
    where: { code: 'SUP-002' },
    update: {},
    create: {
      code: 'SUP-002',
      name: 'Global Tech Logistic',
      defaultLeadTime: 21,
      contactEmail: 'order@globaltech.com',
    }
  });

  // 2. Seed SKUs
  const skusData = [
    { skuCode: 'SKU-001', productName: 'Premium Face Mask (Blue)', supplierCode: 'SUP-001', leadTime: 14, safety: 7, cycle: 30, moq: 100, cost: 5000 },
    { skuCode: 'SKU-002', productName: 'Cloud Comfort Pillow', supplierCode: 'SUP-001', leadTime: 14, safety: 7, cycle: 30, moq: 50, cost: 150000 },
    { skuCode: 'SKU-003', productName: 'Silky Sleep Gown (M)', supplierCode: 'SUP-002', leadTime: 21, safety: 10, cycle: 45, moq: 20, cost: 450000 },
    { skuCode: 'SKU-004', productName: 'Aura Glow Serum', supplierCode: 'SUP-002', leadTime: 21, safety: 5, cycle: 30, moq: 100, cost: 85000 },
    { skuCode: 'SKU-005', productName: 'Dreamy Mist Spray', supplierCode: 'SUP-001', leadTime: 10, safety: 5, cycle: 14, moq: 200, cost: 35000 },
  ];

  for (const item of skusData) {
    await prisma.sku.upsert({
      where: { skuCode: item.skuCode },
      update: {},
      create: {
        skuCode: item.skuCode,
        productName: item.productName,
        supplierCode: item.supplierCode,
        leadTimeDays: item.leadTime,
        safetyStockDays: item.safety,
        reorderCycleDays: item.cycle,
        minOrderQuantity: item.moq,
        unitCost: item.cost,
      }
    });
  }

  // 3. Seed Inventory Snapshots (Last 30 days for SKU-001)
  console.log('Seeding 30 days of snapshots...');
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // SKU-001: Bán đều đặn 40-50 đơn/ngày
    await prisma.inventorySnapshot.upsert({
      where: {
        skuCode_warehouseCode_date: {
          skuCode: 'SKU-001',
          warehouseCode: 'HN-01',
          date,
        }
      },
      update: {},
      create: {
        skuCode: 'SKU-001',
        warehouseCode: 'HN-01',
        date,
        currentStock: 1500 - (30 - i) * 45,
        dailyOutbound: 40 + Math.floor(Math.random() * 15),
      }
    });
  }

  // 4. Seed Purchase Orders
  console.log('Seeding POs...');
  await prisma.purchaseOrder.upsert({
    where: { poNumber: 'PO-2024-001' },
    update: {},
    create: {
      poNumber: 'PO-2024-001',
      skuCode: 'SKU-001',
      supplierCode: 'SUP-001',
      orderedQuantity: 1000,
      orderDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
      expectedArrivalDate: today, // Arriving today
      status: 'pending',
    }
  });

  await prisma.purchaseOrder.upsert({
    where: { poNumber: 'PO-2024-002' },
    update: {},
    create: {
      poNumber: 'PO-2024-002',
      skuCode: 'SKU-002',
      supplierCode: 'SUP-001',
      orderedQuantity: 500,
      orderDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
      expectedArrivalDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // Coming in 5 days
      status: 'confirmed',
    }
  });

  // 5. Create basic alert for SKU-002
  await prisma.replenishmentAlert.upsert({
    where: { id: 'alert-sku-002' },
    update: {},
    create: {
      id: 'alert-sku-002',
      skuCode: 'SKU-002',
      warehouseCode: 'HN-01',
      type: 'STOCK_LEVEL',
      priority: 'WARNING',
      currentStock: 120,
      netStock: 620,
      ado: 25.5,
      daysRemaining: 5,
      reorderDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      recommendedQty: 800,
      estimatedCost: 120000000,
      status: 'open',
    }
  });

  console.log('--- SEEDING COMPLETED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
