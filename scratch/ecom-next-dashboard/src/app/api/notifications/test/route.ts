import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token, chatId, message } = await req.json();

    if (!token || !chatId) {
      return NextResponse.json({ error: 'Thiếu Token hoặc Chat ID' }, { status: 400 });
    }

    const testMessage = message || '🔔 <b>Ecom OS Test</b>\nChúc mừng! Kết nối với Telegram Bot của bạn đã thành công.';

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (result.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.description || 'Lỗi không xác định từ Telegram' 
      });
    }

  } catch (error) {
    console.error('Test Notification Error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi gửi tin nhắn' }, { status: 500 });
  }
}
