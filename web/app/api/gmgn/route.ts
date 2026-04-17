import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== REAL GMGN API CALL ===');
    const apiKey = process.env.GMGN_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GMGN_API_KEY not configured',
        data: null
      }, { status: 500 });
    }

    // REAL GMGN API CALL
    const response = await fetch('https://gmgn.ai/defi/quotation/v7/tokens/sol/trending', {
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`GMGN API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        action: 'trending',
        count: data?.data?.length || 0,
        data: data?.data || []
      },
      timestamp: new Date().toISOString(),
      source: 'REAL GMGN API'
    });

  } catch (error) {
    console.error('GMGN API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch from GMGN API',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      data: null
    }, { status: 500 });
  }
}
