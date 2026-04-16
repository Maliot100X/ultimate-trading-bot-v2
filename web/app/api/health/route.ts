import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    all_envs: {
      GMGN_API_KEY: !!process.env.GMGN_API_KEY,
      GMGN_API_KEY_VALUE: process.env.GMGN_API_KEY ? 'HIDDEN' : 'MISSING',
      JUPITER_API_KEY: !!process.env.JUPITER_API_KEY,
      JUPITER_API_KEY_VALUE: process.env.JUPITER_API_KEY ? 'HIDDEN' : 'MISSING',
      BIRDEYE_API_KEY: !!process.env.BIRDEYE_API_KEY,
      BIRDEYE_API_KEY_VALUE: process.env.BIRDEYE_API_KEY ? 'HIDDEN' : 'MISSING',
      SOLANA_PRIVATE_KEY: !!process.env.SOLANA_PRIVATE_KEY,
      SOLANA_PRIVATE_KEY_VALUE: process.env.SOLANA_PRIVATE_KEY ? 'HIDDEN' : 'MISSING',
      TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
      TELEGRAM_BOT_TOKEN_VALUE: process.env.TELEGRAM_BOT_TOKEN ? 'HIDDEN' : 'MISSING',
      MAX_POSITION_SIZE_USD: process.env.MAX_POSITION_SIZE_USD,
      MAX_SLIPPAGE_PERCENT: process.env.MAX_SLIPPAGE_PERCENT,
    },
    apis: {
      gmgn: !!process.env.GMGN_API_KEY,
      jupiter: !!process.env.JUPITER_API_KEY,
      birdeye: !!process.env.BIRDEYE_API_KEY,
      solana: !!process.env.SOLANA_PRIVATE_KEY,
      telegram: !!process.env.TELEGRAM_BOT_TOKEN
    }
  });
}
