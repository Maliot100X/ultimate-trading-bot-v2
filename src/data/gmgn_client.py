import requests
import aiohttp
import asyncio
from typing import Dict, Any, Optional
import json

class GMGNClient:
    def __init__(self, api_key: str = None, base_url: str = "https://api.gmgn.ai"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        if api_key:
            self.session.headers.update({"Authorization": f"Bearer {api_key}"})
    
    def get_token_info(self, token_address: str, chain: str = "sol") -> Dict[str, Any]:
        url = f"{self.base_url}/v1/token/info"
        params = {"token_address": token_address, "chain": chain}
        response = self.session.get(url, params=params)
        return response.json()
    
    def get_market_rank(self, chain: str = "sol", interval: str = "1m") -> Dict[str, Any]:
        url = f"{self.base_url}/v1/market/rank"
        params = {"chain": chain, "interval": interval}
        response = self.session.get(url, params=params)
        return response.json()
    
    async def get_portfolio(self, wallet_address: str, chain: str = "sol") -> Dict[str, Any]:
        url = f"{self.base_url}/v1/portfolio"
        params = {"wallet_address": wallet_address, "chain": chain}
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                return await response.json()
