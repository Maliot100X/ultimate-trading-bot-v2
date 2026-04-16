import asyncio
from typing import Dict, List, Any, Optional, Tuple
import pandas as pd
import numpy as np
from datetime import datetime
from dataclasses import dataclass

@dataclass
class Signal:
    source: str  # "gmgn", "social", "technical", "onchain", "smart_money"
    score: float  # 0-100
    confidence: float  # 0-1
    timestamp: datetime
    metadata: Dict[str, Any]

class HybridSignalAggregator:
    def __init__(self):
        self.signal_sources = {
            "gmgn": {"weight": 0.3, "min_confidence": 0.7},
            "social": {"weight": 0.2, "min_confidence": 0.6},
            "technical": {"weight": 0.2, "min_confidence": 0.8},
            "onchain": {"weight": 0.15, "min_confidence": 0.75},
            "smart_money": {"weight": 0.15, "min_confidence": 0.85}
        }
        self.signal_history: Dict[str, List[Signal]] = {}
    
    async def add_signal(self, token: str, signal: Signal):
        if token not in self.signal_history:
            self.signal_history[token] = []
        self.signal_history[token].append(signal)
        # Keep only last 100 signals per token
        if len(self.signal_history[token]) > 100:
            self.signal_history[token] = self.signal_history[token][-100:]
    
    async def calculate_composite_score(self, token: str) -> Optional[Tuple[float, Dict[str, float]]]:
        if token not in self.signal_history:
            return None
        
        recent_signals = [s for s in self.signal_history[token] 
                         if (datetime.now() - s.timestamp).total_seconds() < 3600]  # Last hour
        
        if not recent_signals:
            return None
        
        source_scores = {}
        for source, config in self.signal_sources.items():
            source_signals = [s for s in recent_signals if s.source == source]
            if not source_signals:
                continue
            
            # Calculate weighted average of signals from this source
            valid_signals = [s for s in source_signals if s.confidence >= config["min_confidence"]]
            if not valid_signals:
                continue
            
            total_weight = sum(s.confidence for s in valid_signals)
            weighted_score = sum(s.score * s.confidence for s in valid_signals) / total_weight
            source_scores[source] = weighted_score
        
        if not source_scores:
            return None
        
        # Calculate composite score
        composite_score = 0
        for source, score in source_scores.items():
            weight = self.signal_sources[source]["weight"]
            composite_score += score * weight
        
        return composite_score, source_scores
    
    async def get_top_tokens(self, limit: int = 10) -> List[Dict[str, Any]]:
        token_scores = []
        
        for token in self.signal_history.keys():
            result = await self.calculate_composite_score(token)
            if result:
                composite_score, source_scores = result
                if composite_score > 50:  # Minimum threshold
                    token_scores.append({
                        "token": token,
                        "composite_score": composite_score,
                        "source_scores": source_scores,
                        "signal_count": len([s for s in self.signal_history[token] 
                                           if (datetime.now() - s.timestamp).total_seconds() < 3600])
                    })
        
        # Sort by composite score descending
        token_scores.sort(key=lambda x: x["composite_score"], reverse=True)
        return token_scores[:limit]
    
    async def get_signal_analysis(self, token: str) -> Dict[str, Any]:
        if token not in self.signal_history:
            return {"error": "No signals found"}
        
        signals = self.signal_history[token]
        recent_signals = [s for s in signals if (datetime.now() - s.timestamp).total_seconds() < 86400]
        
        analysis = {
            "token": token,
            "total_signals": len(signals),
            "recent_signals_24h": len(recent_signals),
            "signal_timeline": [],
            "source_distribution": {},
            "confidence_distribution": {"high": 0, "medium": 0, "low": 0}
        }
        
        # Group by source
        for signal in recent_signals:
            source = signal.source
            if source not in analysis["source_distribution"]:
                analysis["source_distribution"][source] = 0
            analysis["source_distribution"][source] += 1
            
            # Confidence distribution
            if signal.confidence >= 0.8:
                analysis["confidence_distribution"]["high"] += 1
            elif signal.confidence >= 0.6:
                analysis["confidence_distribution"]["medium"] += 1
            else:
                analysis["confidence_distribution"]["low"] += 1
            
            analysis["signal_timeline"].append({
                "timestamp": signal.timestamp.isoformat(),
                "source": signal.source,
                "score": signal.score,
                "confidence": signal.confidence
            })
        
        # Calculate composite score
        result = await self.calculate_composite_score(token)
        if result:
            composite_score, source_scores = result
            analysis["composite_score"] = composite_score
            analysis["source_scores"] = source_scores
        
        return analysis
