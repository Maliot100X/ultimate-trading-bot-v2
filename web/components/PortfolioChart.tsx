'use client'

import { useState, useEffect } from 'react'

interface PortfolioData {
  success: boolean
  publicKey: string
  balance: string
  balanceUsd: string
  tokens: Array<{
    address: string
    symbol: string
    name: string
    balance: number
    decimals: number
    valueUsd: number
  }>
  tokenCount: number
  totalValueUsd: string
}

export default function PortfolioChart() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch('/api/portfolio')
        const data = await response.json()

        if (data.success) {
          setPortfolio(data)
        }
      } catch (error) {
        console.error('Failed to fetch portfolio:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
    const interval = setInterval(fetchPortfolio, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="animate-spin mr-2">⟳</div>
        Loading portfolio...
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        Portfolio not available
      </div>
    )
  }

  const balance = parseFloat(portfolio.balance)
  const balanceUsd = parseFloat(portfolio.balanceUsd)
  const tokens = portfolio.tokens || []

  // Calculate token distribution
  const totalValue = tokens.reduce((sum, t) => sum + t.valueUsd, 0) + balanceUsd
  const solPercent = totalValue > 0 ? (balanceUsd / totalValue) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Main Balance Display */}
      <div className="text-center">
        <p className="text-gray-400 mb-2">Total Portfolio Value</p>
        <p className="text-5xl font-bold gradient-text">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-gray-400 mt-2">
          {balance.toFixed(4)} SOL (${balanceUsd.toLocaleString()})
        </p>
      </div>

      {/* Token Distribution */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-gray-400 text-sm">SOL</span>
          </div>
          <p className="text-xl font-bold">{solPercent.toFixed(1)}%</p>
          <p className="text-gray-400 text-sm">${balanceUsd.toLocaleString()}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-400 text-sm">Tokens</span>
          </div>
          <p className="text-xl font-bold">{(100 - solPercent).toFixed(1)}%</p>
          <p className="text-gray-400 text-sm">${(totalValue - balanceUsd).toLocaleString()}</p>
        </div>
      </div>

      {/* Token List */}
      {tokens.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-bold mb-2">Your Tokens</h3>
          {tokens.map((token, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <p className="font-bold">{token.symbol}</p>
                <p className="text-gray-400 text-sm">{token.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{token.balance}</p>
                <p className="text-gray-400 text-sm">${token.valueUsd.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Public Key */}
      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-gray-400 text-sm mb-1">Public Key</p>
        <p className="text-xs font-mono text-gray-300 break-all">
          {portfolio.publicKey}
        </p>
      </div>
    </div>
  )
}
