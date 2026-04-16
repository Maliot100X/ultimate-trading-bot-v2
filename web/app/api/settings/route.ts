import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Force Node.js runtime

export async function GET() {
  const settings = {
    // Position Management
    maxPositionSizeUsd: parseInt(process.env.MAX_POSITION_SIZE_USD || '1000'),
    maxPositionsCount: parseInt(process.env.MAX_POSITIONS_COUNT || '10'),
    minTokenLiquidityUsd: parseInt(process.env.MIN_TOKEN_LIQUIDITY_USD || '10000'),

    // Trading Parameters
    maxSlippagePercent: parseInt(process.env.MAX_SLIPPAGE_PERCENT || '2'),
    jitoTipLamports: parseInt(process.env.JITO_TIP_LAMPORTS || '10000'),

    // Risk Management
    maxDailyLossPercent: parseInt(process.env.MAX_DAILY_LOSS_PERCENT || '5'),
    stopLossPercent: parseInt(process.env.STOP_LOSS_PERCENT || '10'),
    takeProfitPercent: parseInt(process.env.TAKE_PROFIT_PERCENT || '25'),

    // API Configuration
    solanaRpcUrl: process.env.SOLANA_RPC_URL,
    jupiterApiUrl: process.env.JUPITER_API_URL,
    birdeyeApiUrl: process.env.BIRDEYE_API_URL,
  };

  return NextResponse.json({
    success: true,
    settings,
    timestamp: new Date().toISOString()
  });
}
