import { NextResponse } from 'next/server';

const GMGN_API_URL = process.env.GMGN_API_URL || 'https://api.gmgn.ai';
const GMGN_API_KEY = process.env.GMGN_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'trending';

    let apiUrl = '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (GMGN_API_KEY) {
      headers['X-API-Key'] = GMGN_API_KEY;
    }

    if (action === 'trending') {
      apiUrl = `${GMGN_API_URL}/v1/ranking/solana`;
    } else if (action === 'token') {
      const address = searchParams.get('address');
      if (!address) {
        return NextResponse.json({ error: 'Token address required' }, { status: 400 });
      }
      apiUrl = `${GMGN_API_URL}/v2/token_info/${address}?address=${address}`;
    } else if (action === 'trades') {
      const address = searchParams.get('address');
      if (!address) {
        return NextResponse.json({ error: 'Token address required' }, { status: 400 });
      }
      apiUrl = `${GMGN_API_URL}/v1/token_trades/${address}?address=${address}`;
    }

    if (!apiUrl) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const response = await fetch(apiUrl, { headers });
    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GMGN API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch from GMGN API'
    }, { status: 500 });
  }
}
