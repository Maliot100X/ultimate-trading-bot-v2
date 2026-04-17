import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== TRADES API CALL ===');
    const publicKey = process.env.SOLANA_PUBLIC_KEY;
    const birdeyeKey = process.env.BIRDEYE_API_KEY;

    if (!publicKey) {
      return NextResponse.json({
        success: false,
        error: 'SOLANA_PUBLIC_KEY not configured',
        data: null
      }, { status: 500 });
    }

    // Try to fetch recent trades from Birdeye API
    if (birdeyeKey) {
      try {
        const response = await fetch(`https://public-api.birdeye.so/v1/wallet/tx_list?wallet=${publicKey}`, {
          headers: {
            'X-API-KEY': birdeyeKey,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const trades = data?.data?.items?.map((tx: any) => ({
            id: tx.tx_hash,
            timestamp: new Date(tx.block_time * 1000).toISOString(),
            token: {
              address: tx.token_address,
              symbol: tx.symbol,
              name: tx.token_name
            },
            type: tx.type,
            amount: tx.amount || 0,
            amountUsd: tx.volume_usd || '0',
            price: tx.price || 0,
            pnl: tx.pnl || 0,
            pnlPercent: tx.pnl_percent || 0,
            status: tx.status
          })) || [];

          return NextResponse.json({
            success: true,
            trades,
            count: trades.length,
            stats: {
              totalTrades: trades.length,
              totalVolume: 'N/A',
              totalPnl: 'N/A',
              winRate: 'N/A',
              avgPnlPercent: 'N/A'
            },
            timestamp: new Date().toISOString(),
            source: 'REAL BIRDEYE API'
          });
        }
      } catch (birdeyeError) {
        console.log('Birdeye API failed, falling back to empty trades');
      }
    }

    // If no Birdeye key or API failed
    return NextResponse.json({
      success: true,
      trades: [],
      count: 0,
      stats: {
        totalTrades: 0,
        totalVolume: '0',
        totalPnl: '0',
        winRate: 0,
        avgPnlPercent: 0
      },
      timestamp: new Date().toISOString(),
      source: 'No trades available - Configure BIRDEYE_API_KEY for trade history',
      note: 'Real trade data requires blockchain indexer (Birdeye, Helius, etc.)'
    });

  } catch (error) {
    console.error('Trades API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch trades',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      data: null
    }, { status: 500 });
  }
}
