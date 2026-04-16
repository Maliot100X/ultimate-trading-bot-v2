import asyncio
from typing import Dict, List, Any, Optional, Tuple
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from dataclasses import dataclass
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

@dataclass
class Pattern:
    name: str
    features: List[str]
    threshold: float
    weight: float

class AIPatternRecognition:
    def __init__(self):
        self.patterns = [
            Pattern("pump_and_dump", ["volume_spike", "price_change", "social_mentions"], 0.7, 0.3),
            Pattern("smart_money_entry", ["large_buys", "wallet_age", "transaction_count"], 0.8, 0.25),
            Pattern("accumulation", ["buy_volume", "holder_growth", "price_stability"], 0.6, 0.2),
            Pattern("breakout", ["resistance_break", "volume_confirmation", "momentum"], 0.75, 0.15),
            Pattern("whale_alert", ["large_transfers", "exchange_inflows", "price_impact"], 0.85, 0.1)
        ]
        
        # Initialize ML model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    async def extract_features(self, token_data: Dict[str, Any]) -> Dict[str, float]:
        features = {}
        
        # Price features
        if "price_history" in token_data:
            prices = token_data["price_history"]
            if len(prices) >= 10:
                features["price_change_1h"] = ((prices[-1] / prices[-6]) - 1) * 100  # 10-min intervals
                features["price_change_24h"] = ((prices[-1] / prices[0]) - 1) * 100
                features["price_volatility"] = np.std(prices[-20:]) / np.mean(prices[-20:]) * 100
        
        # Volume features
        if "volume_history" in token_data:
            volumes = token_data["volume_history"]
            if len(volumes) >= 10:
                features["volume_spike"] = volumes[-1] / np.mean(volumes[-10:-1]) if np.mean(volumes[-10:-1]) > 0 else 1
                features["volume_trend"] = np.polyfit(range(len(volumes[-20:])), volumes[-20:], 1)[0]
        
        # Social features
        if "social_metrics" in token_data:
            social = token_data["social_metrics"]
            features["social_mentions"] = social.get("mentions_24h", 0)
            features["social_sentiment"] = social.get("sentiment_score", 0.5)
        
        # On-chain features
        if "onchain_metrics" in token_data:
            onchain = token_data["onchain_metrics"]
            features["holder_growth"] = onchain.get("holders_growth_24h", 0)
            features["large_buys"] = onchain.get("large_buy_count_24h", 0)
            features["transaction_count"] = onchain.get("transactions_24h", 0)
        
        return features
    
    async def detect_patterns(self, token: str, token_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        features = await self.extract_features(token_data)
        detected_patterns = []
        
        for pattern in self.patterns:
            pattern_score = 0
            pattern_features = []
            
            for feature_name in pattern.features:
                if feature_name in features:
                    pattern_features.append(features[feature_name])
            
            if pattern_features:
                # Simple weighted average for now
                pattern_score = np.mean(pattern_features)
                
                if pattern_score >= pattern.threshold:
                    detected_patterns.append({
                        "pattern": pattern.name,
                        "score": pattern_score,
                        "threshold": pattern.threshold,
                        "weight": pattern.weight,
                        "features": {f: features.get(f, 0) for f in pattern.features if f in features}
                    })
        
        return detected_patterns
    
    async def train_model(self, training_data: List[Dict[str, Any]]):
        if not training_data:
            return False
        
        X = []
        y = []
        
        for data in training_data:
            features = await self.extract_features(data["token_data"])
            feature_vector = list(features.values())
            
            if len(feature_vector) > 0:
                X.append(feature_vector)
                y.append(data["label"])  # 1 for profitable, 0 for not
        
        if len(X) < 10:
            return False
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        return True
    
    async def predict_profitability(self, token: str, token_data: Dict[str, Any]) -> Dict[str, Any]:
        features = await self.extract_features(token_data)
        
        if not features:
            return {"error": "Insufficient data"}
        
        feature_vector = list(features.values())
        
        if self.is_trained:
            X_scaled = self.scaler.transform([feature_vector])
            prediction = self.model.predict(X_scaled)[0]
            probability = self.model.predict_proba(X_scaled)[0][1]
            
            return {
                "token": token,
                "prediction": "profitable" if prediction == 1 else "not_profitable",
                "probability": float(probability),
                "confidence": "high" if probability > 0.7 else "medium" if probability > 0.5 else "low",
                "features": features
            }
        else:
            # Fallback to pattern detection
            patterns = await self.detect_patterns(token, token_data)
            pattern_score = sum(p["score"] * p["weight"] for p in patterns) if patterns else 0
            
            return {
                "token": token,
                "prediction": "profitable" if pattern_score > 0.6 else "not_profitable",
                "probability": pattern_score,
                "confidence": "medium",
                "patterns": patterns,
                "features": features
            }
