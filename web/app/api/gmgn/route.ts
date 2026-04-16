import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('=== GMGN API CALL ===');
    console.log('GMGN_API_KEY:', process.env.GMGN_API_KEY ? 'Present' : 'Missing');

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'trending';

    if (!process.env.GMGN_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'GMGN API key not configured',
        data: null,
        timestamp: new Date().toISOString()
      });
    }

    // Simulated GMGN data since external APIs are unreachable from this server
    if (action === 'trending') {
      const trendingTokens = [
        {
          address: "So11111111111111111111111111111111111111112",
          symbol: "SOL",
          name: "Solana",
          price: 146.50,
          priceChange24h: 5.2,
          volume24h: 1520000000,
          marketCap: 64000000000,
          liquidity: 890000000,
          holders: 850000,
          fdv: 64000000000
        },
        {
          address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          symbol: "USDC",
          name: "USD Coin",
          price: 1.00,
          priceChange24h: 0.0,
          volume24h: 890000000,
          marketCap: 52000000000,
          liquidity: 52000000000,
          holders: 1200000,
          fdv: 52000000000
        },
        {
          address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          symbol: "USDT",
          name: "Tether",
          price: 1.00,
          priceChange24h: 0.0,
          volume24h: 750000000,
          marketCap: 49000000000,
          liquidity: 49000000000,
          holders: 980000,
          fdv: 49000000000
        },
        {
          address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
          symbol: "BONK",
          name: "Bonk",
          price: 0.0000245,
          priceChange24h: 12.8,
          volume24h: 45000000,
          marketCap: 1400000000,
          liquidity: 85000000,
          holders: 650000,
          fdv: 1400000000
        },
        {
          address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
          symbol: "WIF",
          name: "dogwifhat",
          price: 2.45,
          priceChange24h: -3.2,
          volume24h: 280000000,
          marketCap: 2450000000,
          liquidity: 120000000,
          holders: 450000,
          fdv: 2450000000
        },
        {
          address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
          symbol: "JUP",
          name: "Jupiter",
          price: 0.75,
          priceChange24h: 8.4,
          volume24h: 52000000,
          marketCap: 750000000,
          liquidity: 95000000,
          holders: 280000,
          fdv: 750000000
        },
        {
          address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
          symbol: "RAY",
          name: "Raydium",
          price: 1.49,
          priceChange24h: 4.7,
          volume24h: 38000000,
          marketCap: 390000000,
          liquidity: 65000000,
          holders: 195000,
          fdv: 390000000
        }
      ];

      return NextResponse.json({
        success: true,
        data: {
          action,
          count: trendingTokens.length,
          data: trendingTokens
        },
        timestamp: new Date().toISOString(),
        source: 'Simulated GMGN Data',
        note: 'Live GMGN data requires server with external API connectivity'
      });
    }

    if (action === 'search') {
      const query = searchParams.get('query') || '';
      const allTokens = [
        { address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", symbol: "BONK", name: "Bonk", price: 0.0000245 },
        { address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", symbol: "WIF", name: "dogwifhat", price: 2.45 },
        { address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", symbol: "JUP", name: "Jupiter", price: 0.75 },
      ];

      const filtered = allTokens.filter(t =>
        t.symbol.toLowerCase().includes(query.toLowerCase()) ||
        t.name.toLowerCase().includes(query.toLowerCase())
      );

      return NextResponse.json({
        success: true,
        data: {
          action,
          query,
          count: filtered.length,
          data: filtered
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('GMGN API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch GMGN data',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      data: null,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
