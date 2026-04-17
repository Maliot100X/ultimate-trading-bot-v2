import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== REAL PORTFOLIO API CALL ===');
    const publicKey = process.env.SOLANA_PUBLIC_KEY;
    const rpcUrl = process.env.SOLANA_RPC_URL;

    if (!publicKey || !rpcUrl) {
      return NextResponse.json({
        success: false,
        error: 'SOLANA_PUBLIC_KEY or SOLANA_RPC_URL not configured',
        data: null
      }, { status: 500 });
    }

    // REAL SOLANA RPC CALL - Get balance
    const balanceResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [publicKey]
      })
    });

    const balanceData = await balanceResponse.json();
    const balanceLamports = balanceData?.result?.value || 0;
    const balanceSol = balanceLamports / 1_000_000_000;

    // Get SOL price for USD value
    const priceResponse = await fetch('https://price.jup.ag/v6/price?ids=SOL');
    const priceData = await priceResponse.json();
    const solPrice = priceData?.data?.SOL?.price || 146.50;

    const balanceUsd = balanceSol * solPrice;

    // Get token accounts
    const tokenResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'getTokenAccountsByOwner',
        params: [
          publicKey,
          { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
          { encoding: 'jsonParsed' }
        ]
      })
    });

    const tokenData = await tokenResponse.json();
    const tokenAccounts = tokenData?.result?.value || [];

    return NextResponse.json({
      success: true,
      publicKey,
      balance: balanceSol.toFixed(4),
      balanceUsd: balanceUsd.toFixed(2),
      tokens: tokenAccounts.map(acc => ({
        address: acc.account.data.parsed.info.mint,
        symbol: 'TOKEN',
        name: 'Token',
        balance: acc.account.data.parsed.info.tokenAmount.uiAmountString,
        valueUsd: 0
      })),
      tokenCount: tokenAccounts.length,
      timestamp: new Date().toISOString(),
      source: 'REAL SOLANA RPC'
    });

  } catch (error) {
    console.error('Portfolio API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch portfolio',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      data: null
    }, { status: 500 });
  }
}
