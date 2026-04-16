import os
import asyncio
from solders.keypair import Keypair
from solana.rpc.async_api import AsyncClient
from base58 import b58encode, b58decode
import sys

async def test_solana_key():
    private_key_str = os.getenv('SOLANA_PRIVATE_KEY', '')
    
    if not private_key_str:
        print("❌ No SOLANA_PRIVATE_KEY in .env")
        return False
    
    print(f"Testing key: {private_key_str[:20]}...")
    
    try:
        # Try to decode as base58
        key_bytes = b58decode(private_key_str)
        print(f"✅ Key decoded as base58, length: {len(key_bytes)} bytes")
        
        if len(key_bytes) == 64:
            print("✅ Looks like a 64-byte private key")
            # Try to create keypair
            keypair = Keypair.from_bytes(key_bytes)
            print(f"✅ Keypair created successfully!")
            print(f"   Public key: {keypair.pubkey()}")
            return True
        elif len(key_bytes) == 32:
            print("⚠️ 32-byte key - might be a seed")
            return False
        else:
            print(f"⚠️ Unexpected key length: {len(key_bytes)} bytes")
            return False
            
    except Exception as e:
        print(f"❌ Failed to decode as base58: {str(e)}")
        
        # Try as hex
        try:
            if private_key_str.startswith('0x'):
                key_bytes = bytes.fromhex(private_key_str[2:])
            else:
                key_bytes = bytes.fromhex(private_key_str)
            
            print(f"✅ Key decoded as hex, length: {len(key_bytes)} bytes")
            
            if len(key_bytes) == 64:
                keypair = Keypair.from_bytes(key_bytes)
                print(f"✅ Keypair created from hex!")
                print(f"   Public key: {keypair.pubkey()}")
                return True
            else:
                print(f"⚠️ Hex length unexpected: {len(key_bytes)} bytes")
                return False
                
        except Exception as e2:
            print(f"❌ Failed as hex too: {str(e2)}")
            return False

async def test_rpc_connection():
    client = AsyncClient("https://api.mainnet-beta.solana.com")
    try:
        version = await client.get_version()
        print(f"✅ Solana RPC Connected: {version.value}")
        await client.close()
        return True
    except Exception as e:
        print(f"❌ Solana RPC Error: {str(e)}")
        return False

async def main():
    print("🔧 Testing Solana Configuration...")
    
    key_test = await test_solana_key()
    rpc_test = await test_rpc_connection()
    
    if key_test and rpc_test:
        print("\n✅ SOLANA CONFIGURATION READY!")
        print("   Wallet can sign transactions")
        print("   RPC connection working")
        return True
    else:
        print("\n❌ SOLANA CONFIGURATION ISSUES")
        if not key_test:
            print("   - Private key format may be wrong")
            print("   - Expected: 64-byte base58 or hex")
        if not rpc_test:
            print("   - RPC connection failed")
        return False

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    result = asyncio.run(main())
    sys.exit(0 if result else 1)
