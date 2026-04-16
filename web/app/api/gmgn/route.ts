import { NextResponse } from 'next/server';

const GMGN_API_URL = process.env.GMGN_API_URL || 'https://api.gmgn.ai';
const GMGN_API_KEY = process.env.GMGN_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'trending';

    console.log('=== GMGN API CALL ===');
    console.log('Action:', action);
    console.log('GMGN_API_URL:', GMGN_API_URL);
    console.log('GMGN_API_KEY:', GMGN_API_KEY ? 'SET' : 'NOT SET');

    let apiUrl = '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (GMGN_API_KEY) {
      headers['X-API-Key'] = GMGN_API_KEY;
      console.log('Added X-API-Key header');
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

    console.log('Fetching from:', apiUrl);
    console.log('Headers:', headers);

    const response = await fetch(apiUrl, { headers });
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('Response data type:', typeof data);
    console.log('Response data keys:', typeof data === 'object' ? Object.keys(data) : 'N/A');

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      debug: {
        apiUrl,
        hasApiKey: !!GMGN_API_KEY,
        responseStatus: response.status
      }
    });
  } catch (error) {
    console.error('GMGN API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch from GMGN API',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
