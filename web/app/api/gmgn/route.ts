import { NextResponse } from 'next/server';

const JUPITER_API_URL = process.env.JUPITER_API_URL || 'https://quote-api.jup.ag';
const GMGN_API_KEY = process.env.GMGN_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'trending';

    console.log('=== TOKEN API CALL ===');
    console.log('Action:', action);

    // FALLBACK: Use Jupiter API for real token data
    // Since GMGN API might not be accessible from Vercel due to network restrictions
    if (action === 'trending' || action === 'tokens') {
      // Get trending/volume tokens from Jupiter
      const jupiterUrl = `${JUPITER_API_URL}/v6/tokens`;

      console.log('Fetching from Jupiter:', jupiterUrl);

      const response = await fetch(jupiterUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Jupiter API error: ${response.status}`);
      }

      const jupiterData = await response.json();

      // Transform Jupiter data to match expected format
      const tokens = Array.isArray(jupiterData) ? jupiterData.slice(0, 50) : [];

      const formattedData = {
        success: true,
        data: {
          data: tokens.map(token => ({
            address: token.address,
            symbol: token.symbol,
            name: token.name,
            price: parseFloat(token.price || '0'),
            liquidity: parseFloat(token.liquidity || '0'),
            volume_24h: parseFloat(token.volume || '0'),
            change_24h: parseFloat(token.change24h || '0'),
            decimals: token.decimals || 9,
            logoURI: token.logoURI || null,
            tags: token.tags || []
          }))
        },
        timestamp: new Date().toISOString(),
        source: 'Jupiter API',
        fallback: true
      };

      console.log(`✅ Retrieved ${tokens.length} tokens from Jupiter`);

      return NextResponse.json(formattedData);
    }

    if (action === 'token') {
      const address = searchParams.get('address');
      if (!address) {
        return NextResponse.json({ error: 'Token address required' }, { status: 400 });
      }

      // Get specific token info from Jupiter
      const jupiterUrl = `${JUPITER_API_URL}/v6/tokens`;

      const response = await fetch(jupiterUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Jupiter API error: ${response.status}`);
      }

      const jupiterData = await response.json();
      const token = Array.isArray(jupiterData)
        ? jupiterData.find(t => t.address === address)
        : null;

      if (!token) {
        return NextResponse.json({ error: 'Token not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          price: parseFloat(token.price || '0'),
          liquidity: parseFloat(token.liquidity || '0'),
          volume_24h: parseFloat(token.volume || '0'),
          change_24h: parseFloat(token.change24h || '0'),
          decimals: token.decimals || 9,
          logoURI: token.logoURI || null,
          tags: token.tags || []
        },
        timestamp: new Date().toISOString(),
        source: 'Jupiter API'
      });
    }

    if (action === 'trades') {
      const address = searchParams.get('address');
      if (!address) {
        return NextResponse.json({ error: 'Token address required' }, { status: 400 });
      }

      // Real trade data would come from a different API (e.g., Birdeye, Helius)
      // For now, return empty array with structure
      return NextResponse.json({
        success: true,
        data: {
          address,
          trades: [],
          count: 0
        },
        timestamp: new Date().toISOString(),
        note: 'Trade history requires additional API integration (Birdeye, Helius)'
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
