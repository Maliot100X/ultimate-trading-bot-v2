'use client'

import { useState, useEffect } from 'react'

interface Trade {
  id: string
  timestamp: string
  type: 'buy' | 'sell'
  token: {
    symbol: string
    name: string
  }
  amount: number
  price: number
  valueUsd: number
  txId: string
  status: string
  pnlUsd?: number
  pnlPercent?: number
}

export default function RecentTrades() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [totalVolume, setTotalVolume] = useState(0)
  const [winRate, setWinRate] = useState('0%')

  useEffect(() => {
    async function fetchTrades() {
      try {
        const response = await fetch('/api/trades')
        const data = await response.json()

        if (data.success) {
          setTrades(data.trades || [])
          if (data.stats) {
            setTotalVolume(data.stats.totalVolume || 0)
            setWinRate(`${data.stats.winRate || 0}%`)
          }
        }
      } catch (error) {
        console.error('Failed to fetch trades:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
    const interval = setInterval(fetchTrades, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="animate-spin mr-2">⟳</div>
        Loading trades...
      </div>
    )
  }

  if (trades.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400 space-y-2">
        <div className="text-4xl">📊</div>
        <p>No trades yet</p>
        <p className="text-sm">Start trading to see your history</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Total Volume</p>
          <p className="text-xl font-bold text-white">${totalVolume.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Win Rate</p>
          <p className="text-xl font-bold text-solana-green">{winRate}</p>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              trade.type === 'buy' ? 'bg-blue-900/20 border-l-4 border-blue-500' : 'bg-green-900/20 border-l-4 border-green-500'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${trade.type === 'buy' ? 'text-blue-400' : 'text-green-400'}`}>
                  {trade.type.toUpperCase()}
                </span>
                <span className="font-bold">{trade.token.symbol}</span>
              </div>
              <p className="text-gray-400 text-sm">{new Date(trade.timestamp).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">${trade.valueUsd.toFixed(2)}</p>
              {trade.pnlUsd !== undefined && (
                <p className={`text-sm ${trade.pnlUsd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.pnlUsd >= 0 ? '+' : ''}${trade.pnlUsd.toFixed(2)}
                  <span className="ml-1">({trade.pnlPercent}%)</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
