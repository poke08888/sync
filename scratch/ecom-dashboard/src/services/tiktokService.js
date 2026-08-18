const BASE_URL = 'http://127.0.0.1:8000';

export const tiktokService = {
  async getSettings() {
    const response = await fetch(`${BASE_URL}/settings/tiktok?json=1`);
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Lỗi tải cài đặt');
    }
    return response.json();
  },

  async saveApp(appData) {
    const response = await fetch(`${BASE_URL}/settings/tiktok/apps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Lỗi lưu dữ liệu App');
    }
    return response.json();
  },

  async deleteApp(id) {
    const response = await fetch(`${BASE_URL}/settings/tiktok/apps/${id}?json=1`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Lỗi xóa App');
    return response.json();
  },

  async saveBrand(name) {
    const response = await fetch(`${BASE_URL}/settings/tiktok/brands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, json: 1 })
    });
    if (!response.ok) throw new Error('Lỗi lưu thương hiệu');
    return response.json();
  },

  async deleteBrand(id) {
    const response = await fetch(`${BASE_URL}/settings/tiktok/brands/${id}?json=1`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Lỗi xóa thương hiệu');
    return response.json();
  },

  async updateShopBrand(shopId, brandId) {
    const response = await fetch(`${BASE_URL}/settings/tiktok/update-shop-brand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shop_id: shopId, brand_id: brandId })
    });
    if (!response.ok) throw new Error('Lỗi cập nhật Shop');
    return response.json();
  },

  async disconnectShop(id) {
    const response = await fetch(`${BASE_URL}/settings/tiktok/shops/${id}?json=1`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Lỗi ngắt kết nối');
    return response.json();
  },

  async syncAll() {
    const response = await fetch(`${BASE_URL}/settings/tiktok/sync?json=1`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Lỗi đồng bộ ngầm');
    return response.json();
  },

  async registerWebhooks() {
    const response = await fetch(`${BASE_URL}/settings/tiktok/webhooks/register?json=1`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Lỗi kích hoạt Webhook');
    return response.json();
  },

  getConnectUrl(appId) {
    return `${BASE_URL}/settings/tiktok/connect?app_id=${appId}`;
  }
};
