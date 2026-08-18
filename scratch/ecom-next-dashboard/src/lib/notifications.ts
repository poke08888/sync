import nodemailer from 'nodemailer';

/**
 * Gửi thông báo qua Email
 */
export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) {
  // Demo configuration - Cần thay thế bằng thông tin thực tế của bạn
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Ecom OS Inventory" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Email Error:', error);
    return false;
  }
}

/**
 * Gửi thông báo qua Telegram
 */
export async function sendTelegram(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    return res.ok;
  } catch (error) {
    console.error('Telegram Error:', error);
    return false;
  }
}

/**
 * Hàm chung để gửi thông báo alert
 */
export async function notifyReplenishmentAlert(sku: any, metrics: any) {
  const message = `
🚨 <b>CẢNH BÁO TỒN KHO: ${sku.skuCode}</b>
---------------------------------------
Sản phẩm: ${sku.productName}
Tồn kho hiện tại: ${metrics.currentStock}
Ngày cung ứng còn lại: ${metrics.daysRemaining} ngày
Ngày cần nhập hàng: ${new Date(metrics.reorderDate).toLocaleDateString()}
Số lượng đề xuất: <b>${metrics.recommendedQty}</b>
---------------------------------------
Vui lòng kiểm tra Dashboard để biết chi tiết.
  `;

  await sendTelegram(message);
  
  if (sku.supplier?.contactEmail) {
    await sendEmail({
      to: 'manager@example.com', // Cấu hình nhận cảnh báo chung
      subject: `[CRITICAL] Phân tích tái cung ứng: ${sku.skuCode}`,
      text: message.replace(/<[^>]*>/g, ''),
    });
  }
}
