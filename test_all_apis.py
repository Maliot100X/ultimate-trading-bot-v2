#!/usr/bin/env python3
import asyncio
import aiohttp
import requests
import json
from solders.keypair import Keypair
from base58 import b58decode
from solana.rpc.async_api import AsyncClient
import os
from dotenv import load_dotenv

load_dotenv()

async def test_gmgn():
    api_key = os.getenv('GMGN_API_KEY')
    if not api_key:
        return False, "No GMGN_API_KEY"
    
    try:
        url = "https://api.gmgn.ai/v1/market/rank"
        headers = {'Authorization': f'Bearer {api_key}'}
        params = {'chain': 'sol', 'interval': '1m'}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, params=params, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    return True, f"✅ GMGN API: Connected (found {len(data.get('data', []))} tokens)"
                else:
                    return False, f"❌ GMGN API: {response.status} - {await response.text()[:100]}"
    except Exception as e:
        return False, f"❌ GMGN API Error: {str(e)}"

async def test_birdeye():
    api_key = os.getenv('BIRDEYE_API_KEY')
    if not api_key:
        return False, "No BIRDEYE_API_KEY"
    
    try:
        url = "https://public-api.birdeye.so/public/price"
        headers = {'X-API-KEY': api_key}
        params = {'address': 'So11111111111111111111111111111111111111112'}  # SOL token
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, params=params, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    return True, f"✅ BirdEye API: Connected (SOL price: ${data.get('data', {}).get('value', 'N/A')})"
                else:
                    return False, f"❌ BirdEye API: {response.status}"
    except Exception as e:
        return False, f"❌ BirdEye API Error: {str(e)}"

async def test_jupiter():
    api_key = os.getenv('JUPITER_API_KEY')
    if not api_key:
        return False, "No JUPITER_API_KEY"
    
    try:
        url = "https://quote-api.jup.ag/v6/quote"
        headers = {'Authorization': f'Bearer {api_key}'} if api_key else {}
        params = {
            'inputMint': 'So11111111111111111111111111111111111111112',
            'outputMint': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            'amount': 1000000000,  # 1 SOL
            'slippageBps': 50
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, params=params, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    return True, f"✅ Jupiter API: Connected (quote available)"
                elif response.status == 429:
                    return True, f"⚠️ Jupiter API: Rate limited (working)"
                else:
                    return False, f"❌ Jupiter API: {response.status}"
    except Exception as e:
        return False, f"❌ Jupiter API Error: {str(e)}"

async def test_solana():
    private_key = os.getenv('SOLANA_PRIVATE_KEY')
    if not private_key:
        return False, "No SOLANA_PRIVATE_KEY"
    
    try:
        # Test key
        key_bytes = b58decode(private_key)
        keypair = Keypair.from_bytes(key_bytes)
        
        # Test RPC
        client = AsyncClient("https://api.mainnet-beta.solana.com")
        version = await client.get_version()
        await client.close()
        
        balance = await client.get_balance(keypair.pubkey())
        
        return True, f"✅ Solana: Connected (Pubkey: {keypair.pubkey()[:16]}..., Balance: {balance.value/1e9:.4f} SOL)"
    except Exception as e:
        return False, f"❌ Solana Error: {str(e)}"

async def test_telegram():
    token = os.getenv('TELEGRAM_BOT_TOKEN')
    if not token:
        return False, "No TELEGRAM_BOT_TOKEN"
    
    try:
        url = f"https://api.telegram.org/bot{token}/getMe"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return True, f"✅ Telegram Bot: @{data['result']['username']}"
        else:
            return False, f"❌ Telegram API: {response.status_code}"
    except Exception as e:
        return False, f"❌ Telegram Error: {str(e)}"

async def main():
    print("🔧 TESTING ALL API CONNECTIONS...\n")
    
    tests = [
        ("Telegram", test_telegram),
        ("Solana", test_solana),
        ("GMGN", test_gmgn),
        ("BirdEye", test_birdeye),
        ("Jupiter", test_jupiter),
    ]
    
    results = []
    for name, test_func in tests:
        success, message = await test_func()
        print(f"{name}: {message}")
        results.append((name, success, message))
    
    print("\n📊 SUMMARY:")
    success_count = sum(1 for _, success, _ in results if success)
    total_count = len(results)
    
    for name, success, message in results:
        status = "✅" if success else "❌"
        print(f"  {status} {name}")
    
    print(f"\n🎯 {success_count}/{total_count} APIs connected")
    
    if success_count >= 3:
        print("\n✅ READY TO BUILD COMPLETE SYSTEM!")
        return True
    else:
        print("\n❌ NEED TO FIX SOME APIS")
        return False

if __name__ == "__main__":
    asyncio.run(main())
