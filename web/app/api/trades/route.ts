import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Force Node.js runtime

export async function GET() {
  try {
    console.log('=== TRADES API CALL ===');
    console.log('SOLANA_PUBLIC_KEY:', process.env.SOLANA_PUBLIC_KEY);

    if (!process.env.SOLANA_PUBLIC_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Solana public key not configured',
        trades: [],
        count: 0,
        stats: null,
        timestamp: new Date().toISOString()
      });
    }

    // Simulated trade history for demo purposes
    // In production, this would fetch from a database or on-chain transactions
    const trades = [
      {
        id: '1',
        timestamp: '2026-04-16T18:30:00Z',
        token: {
          address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
          symbol: 'JUP',
          name: 'Jupiter'
        },
        type: 'buy',
        amount: 150.0,
        amountUsd: '150.00',
        price: 0.75,
        pnl: 22.5,
        pnlPercent: 15.0,
        status: 'completed'
      },
      {
        id: '2',
        timestamp: '2026-04-16T17:45:00Z',
        token: {
          address: 'RAYzmP5e77KJ3h7L7L7L7L7L7L7L7L7L7L7L7L7L7L',
          symbol: 'RAY',
          name: 'Raydium'
        },
        type: 'buy',
        amount: 100.0,
        amountUsd: '149.00',
        price: 1.49,
        pnl: 12.5,
        pnlPercent: 8.4,
        status: 'completed'
      },
      {
        id: '3',
        timestamp: '2026-04-16T16:20:00Z',
        token: {
          address: 'WIFzP9e77KJ3h7L7L7L7L7L7L7L7L7L7L7L7L7L7L',
          symbol: 'WIF',
          name: 'dogwifhat'
        },
        type: 'sell',
        amount: 50.0,
        amountUsd: '122.50',
        price: 2.45,
        pnl: 30.0,
        pnlPercent: 32.4,
        status: 'completed'
      },
      {
        id: '4',
        timestamp: '2026-04-16T15:10:00Z',
        token: {
          address: 'BONKzP9e77KJ3h7L7L7L7L7L7L7L7L7L7L7L7L7L',
          symbol: 'BONK',
          name: 'Bonk'
        },
        type: 'buy',
        amount: 5000000.0,
        amountUsd: '77.50',
        price: 0.0000155,
        pnl: 8.5,
        pnlPercent: 10.9,
        status: 'completed'
      }
    ];

    const stats = {
      totalTrades: trades.length,
      totalVolume: '499.00',
      totalPnl: '73.50',
      winRate: 100.0,
      avgPnlPercent: 16.7
    };

    return NextResponse.json({
      success: true,
      trades,
      count: trades.length,
      stats,
      timestamp: new Date().toISOString(),
      source: 'Simulated Trades History',
      note: 'Live trade history requires database or on-chain transaction tracking'
    });

  } catch (error) {
    console.error('Trades API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch trades',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      trades: [],
      count: 0,
      stats: null,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
