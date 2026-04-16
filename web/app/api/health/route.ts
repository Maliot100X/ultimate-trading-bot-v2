import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Force Node.js runtime instead of Edge

export async function GET() {
  const envVars = {
    GMGN_API_KEY: process.env.GMGN_API_KEY,
    JUPITER_API_KEY: process.env.JUPITER_API_KEY,
    BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY,
    SOLANA_PRIVATE_KEY: process.env.SOLANA_PRIVATE_KEY,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    SOLANA_PUBLIC_KEY: process.env.SOLANA_PUBLIC_KEY,
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
    JUPITER_API_URL: process.env.JUPITER_API_URL,
    BIRDEYE_API_URL: process.env.BIRDEYE_API_URL,
    MAX_POSITION_SIZE_USD: process.env.MAX_POSITION_SIZE_USD,
    MAX_SLIPPAGE_PERCENT: process.env.MAX_SLIPPAGE_PERCENT,
    STOP_LOSS_PERCENT: process.env.STOP_LOSS_PERCENT,
    TAKE_PROFIT_PERCENT: process.env.TAKE_PROFIT_PERCENT,
  };

  // Log all env vars for debugging (in production this will be safe)
  console.log('Health check - Env vars:', Object.keys(envVars).filter(k => envVars[k]));

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    runtime: 'nodejs',
    all_envs: {
      GMGN_API_KEY: !!envVars.GMGN_API_KEY,
      GMGN_API_KEY_VALUE: envVars.GMGN_API_KEY ? 'HIDDEN' : 'MISSING',
      JUPITER_API_KEY: !!envVars.JUPITER_API_KEY,
      JUPITER_API_KEY_VALUE: envVars.JUPITER_API_KEY ? 'HIDDEN' : 'MISSING',
      BIRDEYE_API_KEY: !!envVars.BIRDEYE_API_KEY,
      BIRDEYE_API_KEY_VALUE: envVars.BIRDEYE_API_KEY ? 'HIDDEN' : 'MISSING',
      SOLANA_PRIVATE_KEY: !!envVars.SOLANA_PRIVATE_KEY,
      SOLANA_PRIVATE_KEY_VALUE: envVars.SOLANA_PRIVATE_KEY ? 'HIDDEN' : 'MISSING',
      TELEGRAM_BOT_TOKEN: !!envVars.TELEGRAM_BOT_TOKEN,
      TELEGRAM_BOT_TOKEN_VALUE: envVars.TELEGRAM_BOT_TOKEN ? 'HIDDEN' : 'MISSING',
      SOLANA_PUBLIC_KEY: envVars.SOLANA_PUBLIC_KEY || 'MISSING',
      MAX_POSITION_SIZE_USD: envVars.MAX_POSITION_SIZE_USD,
      MAX_SLIPPAGE_PERCENT: envVars.MAX_SLIPPAGE_PERCENT,
      STOP_LOSS_PERCENT: envVars.STOP_LOSS_PERCENT,
      TAKE_PROFIT_PERCENT: envVars.TAKE_PROFIT_PERCENT,
    },
    apis: {
      gmgn: !!envVars.GMGN_API_KEY,
      jupiter: !!envVars.JUPITER_API_KEY,
      birdeye: !!envVars.BIRDEYE_API_KEY,
      solana: !!envVars.SOLANA_PRIVATE_KEY,
      telegram: !!envVars.TELEGRAM_BOT_TOKEN
    }
  });
}
