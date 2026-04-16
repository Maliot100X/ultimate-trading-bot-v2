import { NextResponse } from 'next/server';

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const SOLANA_PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY;

export async function GET() {
  try {
    console.log('=== PORTFOLIO API CALL ===');
    console.log('RPC URL:', SOLANA_RPC_URL);

    // Derive public key from private key
    let publicKey = '';
    if (SOLANA_PRIVATE_KEY) {
      try {
        const keypairData = JSON.parse(SOLANA_PRIVATE_KEY);
        if (Array.isArray(keypairData) && keypairData.length === 64) {
          // Keypair is [secretKey(64 bytes)] format
          // Need to derive public key (last 32 bytes are the public key)
          const publicKeyBytes = keypairData.slice(32, 64);
          publicKey = Buffer.from(publicKeyBytes).toString('base58');
        } else if (typeof keypairData === 'string' && keypairData.length === 128) {
          // Base58 format, need to decode and derive
          // For simplicity, use the public key from env if available
          publicKey = process.env.SOLANA_PUBLIC_KEY || '';
        }
      } catch (e) {
        publicKey = process.env.SOLANA_PUBLIC_KEY || '';
      }
    }

    if (!publicKey) {
      return NextResponse.json({
        success: false,
        error: 'No public key available',
        note: 'Check SOLANA_PRIVATE_KEY and SOLANA_PUBLIC_KEY environment variables'
      }, { status: 400 });
    }

    console.log('Public Key:', publicKey);

    // Get SOL balance using RPC
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [publicKey]
    };

    const response = await fetch(SOLANA_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`RPC error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }

    const lamports = data.result.value;
    const solBalance = lamports / 1e9;

    // Get token accounts
    const tokenPayload = {
      jsonrpc: '2.0',
      id: 2,
      method: 'getTokenAccountsByOwner',
      params: [
        publicKey,
        { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
        { encoding: 'jsonParsed' }
      ]
    };

    const tokenResponse = await fetch(SOLANA_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenPayload)
    });

    const tokenData = await tokenResponse.json();
    const tokens = [];

    if (tokenData.result && tokenData.result.value) {
      for (const account of tokenData.result.value) {
        const parsed = account.account.data.parsed;
        const tokenAmount = parsed.info.tokenAmount;
        const decimals = tokenAmount.decimals;
        const balance = parseFloat(tokenAmount.amount) / Math.pow(10, decimals);
        const mintAddress = parsed.info.mint;

        // Get mint info to get symbol
        const mintPayload = {
          jsonrpc: '2.0',
          id: 3,
          method: 'getAccountInfo',
          params: [mintAddress, { encoding: 'jsonParsed' }]
        };

        try {
          const mintResponse = await fetch(SOLANA_RPC_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mintPayload)
          });

          const mintData = await mintResponse.json();
          if (mintData.result && mintData.result.value) {
            const mintInfo = mintData.result.value.data.parsed;
            const mintDataInfo = mintInfo.info;

            tokens.push({
              address: mintAddress,
              balance: balance,
              decimals: decimals,
              symbol: mintDataInfo.symbol || mintAddress.slice(0, 8),
              name: mintDataInfo.name || 'Unknown Token'
            });
          }
        } catch (e) {
          console.log('Error getting mint info:', e);
        }
      }
    }

    const portfolioValue = solBalance; // In SOL - would need price API for USD

    return NextResponse.json({
      success: true,
      publicKey,
      balance: solBalance.toString(),
      balanceUsd: portfolioValue.toFixed(2), // Would multiply by SOL price
      tokens,
      tokenCount: tokens.length,
      timestamp: new Date().toISOString(),
      source: 'Solana RPC'
    });

  } catch (error) {
    console.error('Portfolio API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch portfolio',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
