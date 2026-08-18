// src/utils/mockData.js
// Generate some random sparkline data points
const genSparkline = () => Array.from({ length: 7 }, (_, i) => ({ day: i, value: Math.floor(Math.random() * 100) + 20 }));

// Base metrics template
export const getMetricsForTimeRange = (range) => {
  // We use random offsets based on range to simulate different data periods
  const multiplier = 
    range === 'Hôm nay' || range === 'Hôm qua' ? 1 :
    range === '7 ngày' ? 7 :
    range === '30 ngày' || range === 'Tháng này' ? 30 :
    range === 'Quý này' ? 90 : 365;

  // Function to add ± change logic to metrics
  const m = (base, deltaStr, inv) => {
    const val = base * multiplier;
    // inverse for Cancel Rate - less is better (positive semantics)
    return {
      value: val,
      changeStr: deltaStr, // raw % change string
      sparkline: genSparkline(),
      invertColor: inv // true if less is better (like cancel rate)
    };
  };

  return {
    grossRevenue:   m(85000000, '+12.5%', false),
    netRevenue:     m(72000000, '+8.2%', false),
    cancelRate:     { value: 12.4, isPercent: true, changeStr: '+2.1%', sparkline: genSparkline(), alertThreshold: 10, invertColor: true },
    totalCost:      m(45000000, '-3.4%', true), // Cost dropping is good? If we treat cost as neutral or bad if increased. Let's say cost decrease is positive. So invertColor = true
    roas:           { value: 4.8, isMultiplier: true, changeStr: '+0.5%', sparkline: genSparkline(), invertColor: false },
    aov:            m(245000, '+5.1%', false),
    orderCount:     m(346, '+15.3%', false),
    grossMargin:    { value: 28.5, isPercent: true, changeStr: '-1.2%', sparkline: genSparkline(), invertColor: false },
  };
};

export const TIME_RANGES = [
  'Hôm nay', 'Hôm qua', '7 ngày', '30 ngày', 'Tháng này', 'Quý này', 'Năm này'
];
