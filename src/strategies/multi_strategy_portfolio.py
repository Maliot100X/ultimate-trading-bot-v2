import asyncio
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

@dataclass
class Position:
    token_address: str
    amount: float
    entry_price: float
    current_price: float
    pnl_percent: float
    timestamp: datetime

class MultiStrategyPortfolio:
    def __init__(self):
        self.positions: Dict[str, Position] = {}
        self.strategy_weights = {
            "pumpfun_sniper": 0.1,
            "gmgn_alpha": 0.2,
            "hybrid_signal": 0.15,
            "ai_pattern": 0.15,
            "social_signal": 0.1,
            "smart_money": 0.1,
            "risk_adjusted": 0.1,
            "time_based": 0.05,
            "rebalancer": 0.05
        }
        self.max_positions = 10
        self.max_position_size_usd = 1000
    
    async def calculate_allocation(self, signals: Dict[str, float]) -> Dict[str, float]:
        total_score = sum(signals.values())
        if total_score == 0:
            return {}
        
        allocations = {}
        for token, score in signals.items():
            allocation = (score / total_score) * self.max_position_size_usd
            allocations[token] = min(allocation, self.max_position_size_usd)
        
        return allocations
    
    async def rebalance_portfolio(self, new_signals: Dict[str, float]):
        current_value = sum([p.amount * p.current_price for p in self.positions.values()])
        allocations = await self.calculate_allocation(new_signals)
        
        rebalance_actions = []
        for token, target_allocation in allocations.items():
            if token in self.positions:
                position = self.positions[token]
                current_allocation = position.amount * position.current_price
                
                if abs(current_allocation - target_allocation) > 10:  # $10 threshold
                    action = "BUY" if target_allocation > current_allocation else "SELL"
                    amount = abs(target_allocation - current_allocation) / position.current_price
                    rebalance_actions.append({
                        "token": token,
                        "action": action,
                        "amount": amount,
                        "current_price": position.current_price
                    })
            else:
                # New position
                if target_allocation > 0:
                    rebalance_actions.append({
                        "token": token,
                        "action": "BUY",
                        "amount": target_allocation,  # USD amount
                        "current_price": 0  # Will fetch price
                    })
        
        return rebalance_actions
    
    async def get_portfolio_metrics(self):
        total_value = 0
        total_pnl = 0
        positions_data = []
        
        for position in self.positions.values():
            position_value = position.amount * position.current_price
            position_pnl = position_value - (position.amount * position.entry_price)
            
            total_value += position_value
            total_pnl += position_pnl
            
            positions_data.append({
                "token": position.token_address[:8] + "...",
                "amount": position.amount,
                "entry_price": position.entry_price,
                "current_price": position.current_price,
                "value_usd": position_value,
                "pnl_usd": position_pnl,
                "pnl_percent": position.pnl_percent,
                "age_hours": (datetime.now() - position.timestamp).total_seconds() / 3600
            })
        
        return {
            "total_value_usd": total_value,
            "total_pnl_usd": total_pnl,
            "total_pnl_percent": (total_pnl / total_value * 100) if total_value > 0 else 0,
            "positions_count": len(self.positions),
            "positions": positions_data,
            "strategy_weights": self.strategy_weights
        }
