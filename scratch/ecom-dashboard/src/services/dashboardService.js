const BASE_URL = 'http://127.0.0.1:8000';

export const dashboardService = {
  async getDashboardData(brandId = '') {
    const url = new URL(`${BASE_URL}/?json=1`);
    if (brandId) url.searchParams.set('brand_id', brandId);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Lỗi Server (${response.status})`);
    }
    
    return response.json();
  }
};
