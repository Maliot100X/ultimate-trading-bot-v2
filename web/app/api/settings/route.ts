import { NextResponse } from 'next/server';

const MAX_POSITION_SIZE_USD = parseInt(process.env.MAX_POSITION_SIZE_USD || '1000');
const MAX_SLIPPAGE_PERCENT = parseInt(process.env.MAX_SLIPPAGE_PERCENT || '2');
const JITO_TIP_LAMPORTS = parseInt(process.env.JITO_TIP_LAMPORTS || '10000');
const MIN_TOKEN_LIQUIDITY_USD = parseInt(process.env.MIN_TOKEN_LIQUIDITY_USD || '10000');
const MAX_DAILY_LOSS_PERCENT = parseInt(process.env.MAX_DAILY_LOSS_PERCENT || '5');
const MAX_POSITIONS_COUNT = parseInt(process.env.MAX_POSITIONS_COUNT || '10');
const STOP_LOSS_PERCENT = parseInt(process.env.STOP_LOSS_PERCENT || '10');
const TAKE_PROFIT_PERCENT = parseInt(process.env.TAKE_PROFIT_PERCENT || '25');

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: {
      // Position Management
      maxPositionSizeUsd: MAX_POSITION_SIZE_USD,
      maxPositionsCount: MAX_POSITIONS_COUNT,
      minTokenLiquidityUsd: MIN_TOKEN_LIQUIDITY_USD,

      // Trading Parameters
      maxSlippagePercent: MAX_SLIPPAGE_PERCENT,
      jitoTipLamports: JITO_TIP_LAMPORTS,

      // Risk Management
      maxDailyLossPercent: MAX_DAILY_LOSS_PERCENT,
      stopLossPercent: STOP_LOSS_PERCENT,
      takeProfitPercent: TAKE_PROFIT_PERCENT,

      // API Configuration
      solanaRpcUrl: process.env.SOLANA_RPC_URL,
      jupiterApiUrl: process.env.JUPITER_API_URL,
      birdeyeApiUrl: process.env.BIRDEYE_API_URL,
    },
    timestamp: new Date().toISOString()
  });
}
