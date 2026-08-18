// Hourly Sales Data
export const generateHourlyData = () => {
  return Array.from({ length: 24 }, (_, i) => {
    let base = 5000000;
    if (i >= 8 && i <= 11) base = 15000000; // Morning peak
    if (i >= 19 && i <= 22) base = 25000000; // Evening peak (Livestream)
    
    // Create random fluctuation
    const current = base + Math.random() * base * 0.4;
    const previous = base + Math.random() * base * 0.5 - base * 0.1;
    
    return {
      hour: `${String(i).padStart(2, '0')}:00`,
      current: Math.round(current),
      previous: Math.round(previous),
      isPeak: false // dynamically flagged component level
    };
  });
};

// Daily Sales Data
export const generateDailyData = () => {
  const data = Array.from({ length: 30 }, (_, i) => {
    const isCampaign = i === 14 || i === 15; // Phân kỳ Campaign
    const sales = isCampaign ? Math.random() * 400 + 400 : Math.random() * 150 + 100;
    const previous = sales * 0.8 + Math.random() * 50;
    return {
      day: `Ng ${i + 1}`,
      sales: Math.round(sales * 1000000), // in mil
      previous: Math.round(previous * 1000000),
      ma7: null, // calculated later
      isCampaign
    };
  });

  // Calculate MA7
  for (let i = 0; i < data.length; i++) {
    if (i >= 6) {
      let sum = 0;
      for (let j = 0; j < 7; j++) sum += data[i - j].sales;
      data[i].ma7 = Math.round(sum / 7);
    }
  }
  return data;
};

// Channel Donut Chart
export const channelDonutBase = [
  { name: 'TikTok Shop', value: 340000000, prevValue: 280000000, color: '#00F2FE' },
  { name: 'Shopee', value: 450000000, prevValue: 420000000, color: '#FF7043' },
  { name: 'Direct/Web', value: 120000000, prevValue: 135000000, color: '#4ADE80' },
];

export const channelDonutDrilldown = {
  'TikTok Shop': [
    { name: 'Brand A', value: 200000000, prevValue: 150000000, color: '#3B82F6' },
    { name: 'Brand B', value: 100000000, prevValue: 90000000, color: '#06B6D4' },
    { name: 'Brand C', value: 40000000, prevValue: 40000000, color: '#0EA5E9' }
  ],
  'Shopee': [
    { name: 'Brand C', value: 300000000, prevValue: 250000000, color: '#F97316' },
    { name: 'Brand A', value: 100000000, prevValue: 120000000, color: '#FB923C' },
    { name: 'Brand B', value: 50000000, prevValue: 50000000, color: '#FDBA74' }
  ]
};

// Top 10 Products
export const topProductsData = [
  { id: '1', name: 'Combo Dầu Gội Trị Rụng', qty: 1540, revenue: 145000000, margin: 45, trend: [20, 25, 30, 28, 40, 50, 48] },
  { id: '2', name: 'Serum Dưỡng Trắng C', qty: 1210, revenue: 110000000, margin: 38, trend: [15, 12, 18, 20, 25, 20, 28] },
  { id: '3', name: 'Đầm Maxi Trễ Vai Hoa', qty: 980, revenue: 86000000, margin: 25, trend: [5, 10, 8, 15, 18, 20, 15] },
  { id: '4', name: 'Son Tint Bóng Môi', qty: 2100, revenue: 78000000, margin: 40, trend: [100, 110, 105, 120, 140, 110, 130] },
  { id: '5', name: 'Quần Jeans Ống Suông', qty: 850, revenue: 74000000, margin: 18, trend: [50, 48, 55, 60, 58, 48, 52] },
  { id: '6', name: 'Set Lều Cắm Trại 4N', qty: 120, revenue: 65000000, margin: 12, trend: [2, 3, 5, 4, 8, 10, 2] },
  { id: '7', name: 'Áo Thun Basic Cotton', qty: 1800, revenue: 62000000, margin: 28, trend: [60, 65, 63, 70, 75, 80, 75] },
  { id: '8', name: 'Ghế Gấp Gọn Outdoor', qty: 450, revenue: 58000000, margin: 14, trend: [12, 15, 10, 18, 25, 15, 20] },
  { id: '9', name: 'Áo Dài Tết Tân Thời', qty: 420, revenue: 55000000, margin: 35, trend: [20, 22, 28, 35, 40, 38, 42] },
  { id: '10', name: 'Đệm Khí Cao Su TPU', qty: 310, revenue: 45000000, margin: 10, trend: [8, 10, 12, 9, 15, 18, 15] },
];
