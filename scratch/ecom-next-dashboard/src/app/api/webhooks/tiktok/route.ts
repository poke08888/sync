import { NextRequest, NextResponse } from 'next/server';
import { syncQueue } from '@/lib/redis';

/**
 * TikTok Shop Webhook Handler
 * Doc: https://partner.tiktokshop.com/docv2/page/6508006d6499870298a0d91d
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get('x-tt-shop-signature');

    // 1. Signature Verification (Simplified skeleton)
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // 2. Push raw event to BullMQ for Real-time processing
    // This allows the API to return 200 OK immediately and process logic in background
    await syncQueue.add('tiktok-webhook-event', {
      timestamp: Date.now(),
      platform: 'TIKTOK',
      data: body,
    });

    console.log('[Webhook] TikTok event queued successfully');

    return NextResponse.json({ code: 0, message: 'success' });
  } catch (error) {
    console.error('[Webhook Error] TikTok:', error);
    return NextResponse.json({ code: 500, message: 'internal server error' }, { status: 500 });
  }
}
