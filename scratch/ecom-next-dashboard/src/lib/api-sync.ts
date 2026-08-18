import prisma from './prisma';

/**
 * API Sync Service
 * Chứa logic xử lý đồng bộ dữ liệu Real-time và Sync History
 */
export const ApiSyncService = {
  /**
   * Chuẩn hóa trạng thái đơn hàng về định dạng nội bộ
   */
  normalizeStatus(platform: 'TIKTOK' | 'SHOPEE', originalStatus: string) {
    const statusMap: Record<string, string> = {
      // TikTok Shop Statuses
      'AWAITING_PAYMENT': 'PENDING',
      'AWAITING_SHIPMENT': 'SHIPPED',
      'CANCELLED': 'CANCELLED',
      'COMPLETED': 'COMPLETED',
      
      // Shopee Statuses
      'UNPAID': 'PENDING',
      'READY_TO_SHIP': 'SHIPPED',
      'CANCELLED_SHOPEE': 'CANCELLED',
      'COMPLETED_SHOPEE': 'COMPLETED',
    };

    return statusMap[originalStatus] || 'PENDING';
  },

  /**
   * Xử lý Job đồng bộ lịch sử (Sync History)
   * @param shopId ID của Shop trong DB
   * @param days Số ngày cần cào lại dữ liệu
   */
  async syncHistory(shopId: string, days: number = 90) {
    console.log(`[Sync History] Starting sync for shop ${shopId} for last ${days} days...`);
    
    // Logic gọi API của TikTok/Shopee Client sẽ nằm ở đây
    // Sau đó chạy Loop để upsert dữ liệu vào Prisma
    
    return { success: true, processed: 0 };
  },

  /**
   * Upsert dữ liệu Order từ Webhook thô
   */
  async processWebhookOrder(platform: 'TIKTOK' | 'SHOPEE', rawData: any) {
     // Logic trích xuất ID, Price, Status từ JSON thô của từng sàn
     // Sau đó dùng prisma.order.upsert để cập nhật Real-time vào DB
  }
};
