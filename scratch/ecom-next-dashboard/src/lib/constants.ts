export const BRANDS = [
  'Tất cả các Brand', 
  'Macaron Cos', 
  'Tech Haven', 
  'Aura Beauty', 
  'Daily Fits', 
  'Home Luxe'
];

export const TIME_RANGES = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'yesterday', label: 'Hôm qua' },
  { id: '7days', label: '7 Ngày' },
  { id: '30days', label: '30 Ngày' },
  { id: 'this_month', label: 'Tháng này' },
  { id: 'custom', label: 'Tùy chỉnh' },
];

export type TimeRangeId = 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'custom';
