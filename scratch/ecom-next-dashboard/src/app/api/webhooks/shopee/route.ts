import { NextRequest, NextResponse } from 'next/server';
import { syncQueue } from '@/lib/redis';

/**
 * Shopee Webhook Handler
 * Doc: https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const shopId = req.headers.get('x-shopee-shop-id');

    // 1. Queue logic for background processing
    await syncQueue.add('shopee-webhook-event', {
      timestamp: Date.now(),
      platform: 'SHOPEE',
      shopId: shopId,
      data: body,
    });

    console.log('[Webhook] Shopee event queued successfully');

    return NextResponse.json({ message: 'Push notification received' });
  } catch (error) {
    console.error('[Webhook Error] Shopee:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
