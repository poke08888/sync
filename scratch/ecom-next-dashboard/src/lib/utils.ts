/**
 * Đảm bảo định dạng số đồng nhất giữa Server và Client để tránh lỗi Hydration.
 * Sử dụng locale 'en-US' để luôn dùng dấu phẩy (,) làm phân cách hàng nghìn.
 */
export const formatNumber = (value: number | undefined | null) => {
  if (value === undefined || value === null) return '0';
  return value.toLocaleString('vi-VN');
};

export const formatCurrency = (value: number | undefined | null) => {
  if (value === undefined || value === null) return '₫0';
  return `₫${value.toLocaleString('vi-VN')}`;
};

export const formatCompactNumber = (value: number) => {
  if (value >= 1e9) return (value / 1e9).toFixed(1) + 'b';
  if (value >= 1e6) return (value / 1e6).toFixed(1) + 'm';
  if (value >= 1e3) return (value / 1e3).toFixed(0) + 'k';
  return value.toLocaleString('vi-VN');
};

export const formatKocCurrency = (value: number) => {
  if (value >= 1e9) return (value / 1e9).toFixed(1) + 'b₫';
  if (value >= 1e6) return (value / 1e6).toFixed(1) + 'm₫';
  if (value >= 1e3) return (value / 1e3).toFixed(0) + 'k₫';
  return value.toLocaleString('vi-VN') + '₫';
};

export const formatPercent = (value: number) => {
  return (value * 100).toFixed(2) + '%';
};

export const formatDuration = (value: number) => {
  return value.toFixed(1) + 'h';
};
