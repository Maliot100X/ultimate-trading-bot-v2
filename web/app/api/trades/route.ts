import { NextResponse } from 'next/server';

const SOLANA_PUBLIC_KEY = process.env.SOLANA_PUBLIC_KEY;

// Sample trade history (would normally come from database or API)
const SAMPLE_TRADES = [
  {
    id: "trade_001",
    timestamp: "2026-04-16T14:32:15Z",
    type: "buy",
    token: {
      address: "Bonk1wGx9qK3z6oqNvY9zH1mZ2X4Y5Z6Z7Z8Z9Z0Z1Z2",
      symbol: "BONK",
      name: "Bonk"
    },
    amount: 5000000,
    price: 0.0000245,
    valueUsd: 122.50,
    txId: "5H7j8k9L0m1N2o3P4q5R6s7T8u9V0wX1Y2z3A4b5C6",
    status: "completed"
  },
  {
    id: "trade_002",
    timestamp: "2026-04-16T15:45:22Z",
    type: "sell",
    token: {
      address: "WIFzP9e77KJ3h7L7L7L7L7L7L7L7L7L7L7L7L7L7L7L",
      symbol: "WIF",
      name: "dogwifhat"
    },
    amount: 50,
    price: 2.50,
    valueUsd: 125.00,
    txId: "7K9l0m1N2o3P4q5R6s7T8u9V0wX1Y2z3A4b5C6D7e8",
    status: "completed",
    pnlUsd: 15.00,
    pnlPercent: 12.0
  },
  {
    id: "trade_003",
    timestamp: "2026-04-16T16:22:08Z",
    type: "buy",
    token: {
      address: "RAYzmP5e77KJ3h7L7L7L7L7L7L7L7L7L7L7L7L7L7L",
      symbol: "RAY",
      name: "Raydium"
    },
    amount: 75,
    price: 1.82,
    valueUsd: 136.50,
    txId: "9M1n2o3P4q5R6s7T8u9V0wX1Y2z3A4b5C6D7e8F9g0",
    status: "completed"
  },
  {
    id: "trade_004",
    timestamp: "2026-04-16T17:10:33Z",
    type: "buy",
    token: {
      address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      symbol: "JUP",
      name: "Jupiter"
    },
    amount: 100,
    price: 1.15,
    valueUsd: 115.00,
    txId: "2o3P4q5R6s7T8u9V0wX1Y2z3A4b5C6D7e8F9g0H1i2",
    status: "completed"
  }
];

export async function GET() {
  try {
    console.log('=== TRADES API CALL ===');

    if (!SOLANA_PUBLIC_KEY) {
      console.log('No SOLANA_PUBLIC_KEY in environment');
      return NextResponse.json({
        success: false,
        error: 'Wallet not configured',
        trades: [],
        count: 0,
        stats: null,
        timestamp: new Date().toISOString(),
        note: 'Configure SOLANA_PUBLIC_KEY in Vercel environment variables'
      });
    }

    console.log('Public Key:', SOLANA_PUBLIC_KEY);

    // Calculate trade statistics
    const completedTrades = SAMPLE_TRADES.filter(t => t.status === 'completed');
    const buyTrades = completedTrades.filter(t => t.type === 'buy');
    const sellTrades = completedTrades.filter(t => t.type === 'sell');

    const totalVolume = completedTrades.reduce((sum, t) => sum + t.valueUsd, 0);
    const totalPnL = sellTrades.reduce((sum, t) => sum + (t.pnlUsd || 0), 0);
    const winRate = sellTrades.length > 0
      ? (sellTrades.filter(t => (t.pnlUsd || 0) > 0).length / sellTrades.length) * 100
      : 0;

    const stats = {
      totalTrades: completedTrades.length,
      buyTrades: buyTrades.length,
      sellTrades: sellTrades.length,
      totalVolume: totalVolume,
      totalPnL: totalPnL,
      winRate: winRate.toFixed(1),
      avgTradeSize: completedTrades.length > 0 ? totalVolume / completedTrades.length : 0
    };

    return NextResponse.json({
      success: true,
      publicKey: SOLANA_PUBLIC_KEY,
      trades: SAMPLE_TRADES.reverse(), // Most recent first
      count: SAMPLE_TRADES.length,
      stats: stats,
      timestamp: new Date().toISOString(),
      source: 'Trade History Database (Simulated)',
      note: 'Live trade history requires database connection'
    });

  } catch (error) {
    console.error('Trades API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch trades',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      trades: [],
      count: 0,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
