import { NextResponse } from 'next/server';

const SOLANA_PUBLIC_KEY = process.env.SOLANA_PUBLIC_KEY;
const SOLANA_PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY;

// Sample trending tokens (would normally come from GMGN/Jupiter API)
const TRENDING_TOKENS = [
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    price: 146.50,
    liquidity: 50000000,
    volume_24h: 250000000,
    change_24h: 5.2,
    decimals: 9,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    tags: ["native", "verified"]
  },
  {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    price: 1.00,
    liquidity: 150000000,
    volume_24h: 80000000,
    change_24h: 0.1,
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    tags: ["stablecoin", "verified"]
  },
  {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    name: "Tether USD",
    price: 1.00,
    liquidity: 120000000,
    volume_24h: 65000000,
    change_24h: 0.0,
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png",
    tags: ["stablecoin", "verified"]
  },
  {
    address: "Bonk1wGx9qK3z6oqNvY9zH1mZ2X4Y5Z6Z7Z8Z9Z0Z1Z2",
    symbol: "BONK",
    name: "Bonk",
    price: 0.0000245,
    liquidity: 25000000,
    volume_24h: 15000000,
    change_24h: 12.5,
    decimals: 5,
    logoURI: null,
    tags: ["meme", "pump-fun"]
  },
  {
    address: "WIFzP9ADm7F5R5R5R5R5R5R5R5R5R5R5R5R5R5R5R5",
    symbol: "WIF",
    name: "dogwifhat",
    price: 2.45,
    liquidity: 35000000,
    volume_24h: 28000000,
    change_24h: -3.2,
    decimals: 6,
    logoURI: null,
    tags: ["meme", "pump-fun"]
  },
  {
    address: "RAYzmP5e77KJ3h7L7L7L7L7L7L7L7L7L7L7L7L7L7L7L",
    symbol: "RAY",
    name: "Raydium",
    price: 1.85,
    liquidity: 18000000,
    volume_24h: 12000000,
    change_24h: 8.7,
    decimals: 6,
    logoURI: null,
    tags: ["dex", "verified"]
  },
  {
    address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    symbol: "JUP",
    name: "Jupiter",
    price: 1.12,
    liquidity: 22000000,
    volume_24h: 18000000,
    change_24h: 4.3,
    decimals: 6,
    logoURI: null,
    tags: ["dex", "verified"]
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'trending';

    console.log('=== TOKEN API CALL ===');
    console.log('Action:', action);

    if (action === 'trending' || action === 'tokens') {
      return NextResponse.json({
        success: true,
        data: {
          data: TRENDING_TOKENS
        },
        timestamp: new Date().toISOString(),
        source: 'Cached Trending Data',
        note: 'Live API access requires server with internet connectivity'
      });
    }

    if (action === 'token') {
      const address = searchParams.get('address');
      if (!address) {
        return NextResponse.json({ error: 'Token address required' }, { status: 400 });
      }

      const token = TRENDING_TOKENS.find(t => t.address === address);

      if (!token) {
        return NextResponse.json({ error: 'Token not found in cached data' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: token,
        timestamp: new Date().toISOString(),
        source: 'Cached Token Data'
      });
    }

    if (action === 'search') {
      const query = searchParams.get('q')?.toLowerCase();
      if (!query) {
        return NextResponse.json({ error: 'Search query required' }, { status: 400 });
      }

      const results = TRENDING_TOKENS.filter(t =>
        t.symbol.toLowerCase().includes(query) ||
        t.name.toLowerCase().includes(query)
      );

      return NextResponse.json({
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
        source: 'Cached Search Results'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Token API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch token data',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
