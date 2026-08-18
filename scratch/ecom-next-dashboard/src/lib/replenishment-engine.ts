import { prisma } from './prisma';
import { differenceInDays, addDays, startOfDay, subDays } from 'date-fns';

export interface ReplenishmentMetrics {
  skuCode: string;
  warehouseCode: string;
  ado: number;
  currentStock: number;
  netStock: number;
  daysRemaining: number;
  reorderDate: Date;
  status: 'OK' | 'INFO' | 'WARNING' | 'CRITICAL';
  recommendedQty: number;
  estimatedCost: number;
}

/**
 * Engine cốt lõi để tính toán các chỉ số dự báo kho
 */
export async function runReplenishmentCalculation(skuCode?: string) {
  // Lấy danh sách SKU cần tính toán
  const skus = await prisma.sku.findMany({
    where: skuCode ? { skuCode } : {},
    include: {
      supplier: true,
    }
  });

  const results: ReplenishmentMetrics[] = [];

  for (const sku of skus) {
    // 1. Lấy danh sách các kho có dữ liệu cho SKU này
    const warehouseSnapshots = await prisma.inventorySnapshot.findMany({
      where: { skuCode: sku.skuCode },
      orderBy: { date: 'desc' },
      distinct: ['warehouseCode'],
    });

    const warehouseCodes = warehouseSnapshots.map(s => s.warehouseCode);
    
    // Thêm mã kho ảo 'TOTAL' để tính toán gộp
    const allWarehouseCodes = [...warehouseCodes, 'TOTAL'];

    for (const warehouseCode of allWarehouseCodes) {
      // 2. Tính ADO (Average Daily Outbound) cho kho này (hoặc gộp)
      const adoValue = await calculateAdo(sku.skuCode, warehouseCode, 14);
      
      // 3. Lấy tồn kho hiện tại
      let currentStock = 0;
      if (warehouseCode === 'TOTAL') {
        currentStock = warehouseSnapshots.reduce((sum, s) => sum + s.currentStock, 0);
      } else {
        const snap = warehouseSnapshots.find(s => s.warehouseCode === warehouseCode);
        currentStock = snap?.currentStock || 0;
      }

      // 4. Tính Net Available Stock (Tồn kho thực tế + Hàng đang về)
      const inTransitQty = await calculateInTransit(sku.skuCode);
      const netStock = currentStock + inTransitQty;

      // 5. Tính toán ngày nhập hàng & số dư ngày
      const metrics = computeMetrics(sku, currentStock, netStock, adoValue, warehouseCode);
      results.push(metrics);

      // 6. Cập nhật hoặc tạo ReplenishmentAlert
      if (metrics.status !== 'OK') {
        await upsertAlert(metrics);
      } else {
        await resolveExistingAlert(sku.skuCode, warehouseCode);
      }
    }
  }

  return results;
}

/**
 * Tính trung bình lượng hàng bán ra hàng ngày (ADO)
 */
async function calculateAdo(skuCode: string, warehouseCode: string, days: number = 14): Promise<number> {
  const endDate = startOfDay(new Date());
  const startDate = subDays(endDate, days);

  const snapshots = await prisma.inventorySnapshot.findMany({
    where: {
      skuCode,
      warehouseCode: warehouseCode === 'TOTAL' ? undefined : warehouseCode,
      date: { gte: startDate, lt: endDate }
    }
  });

  if (snapshots.length === 0) return 0;

  let totalOutbound = 0;
  
  if (warehouseCode === 'TOTAL') {
    // Nếu gộp kho, ta cần tính tổng outbound của TẤT CẢ các kho theo từng ngày, 
    // sau đó chia cho số ngày. Tuy nhiên Prisma query trên đã lấy tất cả records,
    // ta chỉ việc sum tổng dailyOutbound lại.
    totalOutbound = snapshots.reduce((sum, s) => sum + s.dailyOutbound, 0);
  } else {
    totalOutbound = snapshots.reduce((sum, s) => sum + s.dailyOutbound, 0);
  }

  const actualDays = differenceInDays(endDate, startDate);
  return totalOutbound / (actualDays || 1);
}

/**
 * Tính tổng lượng hàng đang trên đường về (In-Transit)
 */
async function calculateInTransit(skuCode: string): Promise<number> {
  const pos = await prisma.purchaseOrder.findMany({
    where: {
      skuCode,
      status: { in: ['pending', 'confirmed', 'delayed'] }
    }
  });

  return pos.reduce((sum, po) => sum + po.orderedQuantity, 0);
}

/**
 * Logic tính toán các chỉ số dự báo
 */
function computeMetrics(
  sku: any, 
  currentStock: number, 
  netStock: number, 
  ado: number, 
  warehouseCode: string
): ReplenishmentMetrics {
  // Nếu ADO = 0, không thể dự báo chính xác
  if (ado <= 0) {
    return {
      skuCode: sku.skuCode,
      warehouseCode,
      ado: 0,
      currentStock,
      netStock,
      daysRemaining: 999,
      reorderDate: addDays(new Date(), 365),
      status: 'OK',
      recommendedQty: 0,
      estimatedCost: 0
    };
  }

  const daysOfNetStock = netStock / ado;
  
  // reorder_date = today + days_of_net_stock - lead_time_days - safety_stock_days
  const daysUntilReorder = daysOfNetStock - sku.leadTimeDays - sku.safetyStockDays;
  const reorderDate = addDays(new Date(), Math.floor(daysUntilReorder));

  // Determine status
  let status: 'OK' | 'INFO' | 'WARNING' | 'CRITICAL' = 'OK';
  if (daysUntilReorder <= 0) status = 'CRITICAL';
  else if (daysUntilReorder <= 3) status = 'WARNING';
  else if (daysUntilReorder <= 7) status = 'INFO';

  // Compute recommended quantity
  // recommended_qty = (ADO × reorder_cycle_days) + (ADO * safety_stock_days) - net_stock
  const safetyStockUnits = ado * sku.safetyStockDays;
  const targetInventory = (ado * sku.reorderCycleDays) + safetyStockUnits;
  
  let recommendedQty = Math.max(0, targetInventory - netStock);
  
  // Adjust for MOQ and round up
  if (recommendedQty > 0 && recommendedQty < sku.minOrderQuantity) {
    recommendedQty = sku.minOrderQuantity;
  } else if (recommendedQty > 0) {
    // Làm tròn lên theo bội số của MOQ (giả thiết) 
    // Hoặc chỉ làm tròn lên số nguyên
    recommendedQty = Math.ceil(recommendedQty);
  }

  return {
    skuCode: sku.skuCode,
    warehouseCode,
    ado,
    currentStock,
    netStock,
    daysRemaining: Math.floor(daysOfNetStock),
    reorderDate,
    status,
    recommendedQty,
    estimatedCost: recommendedQty * sku.unitCost
  };
}

/**
 * Lưu trữ cảnh báo vào Database
 */
async function upsertAlert(metrics: ReplenishmentMetrics) {
  const { skuCode, warehouseCode, status, reorderDate, recommendedQty, ...rest } = metrics;
  
  await prisma.replenishmentAlert.upsert({
    where: {
      // Vì không có composite unique trong schema, ta sẽ tìm theo sku + warehouse + type
      id: await findAlertId(skuCode, warehouseCode, 'STOCK_LEVEL') || 'new-id'
    },
    create: {
      skuCode,
      warehouseCode,
      type: 'STOCK_LEVEL',
      priority: status,
      status: 'open',
      reorderDate,
      recommendedQty,
      ...rest
    },
    update: {
      priority: status,
      reorderDate,
      recommendedQty,
      ...rest,
      status: 'open',
      updatedAt: new Date()
    }
  });
}

/**
 * Tìm ID của Alert hiện có (giả lập vì schema Prisma thiếu index unique cho [sku, wh, type])
 */
async function findAlertId(skuCode: string, warehouseCode: string, type: string) {
  const alert = await prisma.replenishmentAlert.findFirst({
    where: { skuCode, warehouseCode, type, status: { not: 'resolved' } }
  });
  return alert?.id;
}

async function resolveExistingAlert(skuCode: string, warehouseCode: string) {
  await prisma.replenishmentAlert.updateMany({
    where: { 
      skuCode, 
      warehouseCode, 
      type: 'STOCK_LEVEL', 
      status: 'open' 
    },
    data: { 
      status: 'resolved',
      resolvedAt: new Date()
    }
  });
}
