'use client'

import { ReactNode, useState, useEffect } from 'react'

interface StatItem {
  label: string;
  value: string;
  change?: string;
  color: string;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Portfolio Value', value: '$0.00', change: '+0%', color: 'text-solana-green' },
    { label: "Today's P&L", value: '$0.00', change: '0%', color: 'text-gray-400' },
    { label: 'Active Positions', value: '0', change: '', color: 'text-white' },
    { label: 'Total Trades', value: '0', change: '', color: 'text-white' },
    { label: 'Win Rate', value: '0%', change: '', color: 'text-white' },
    { label: 'Bot Status', value: 'Ready', change: '', color: 'text-solana-green' },
  ])

  useEffect(() => {
    // Fetch real data from APIs
    async function fetchData() {
      try {
        // Fetch portfolio data
        const portfolioRes = await fetch('/api/portfolio')
        const portfolioData = await portfolioRes.json()

        // Fetch trades data
        const tradesRes = await fetch('/api/trades')
        const tradesData = await tradesRes.json()

        if (portfolioData.success) {
          const portfolioValue = parseFloat(portfolioData.balanceUsd || '0')
          setStats(prev => prev.map(stat =>
            stat.label === 'Portfolio Value'
              ? { ...stat, value: `$${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
              : stat
          ))
        }

        if (tradesData.success) {
          const totalTrades = tradesData.count || 0
          const statsData = tradesData.stats || {}
          const winRate = statsData.winRate || '0'
          const pnl = statsData.totalPnL || 0

          setStats(prev => prev.map(stat => {
            if (stat.label === "Today's P&L") {
              const pnlValue = pnl > 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`
              return { ...stat, value: pnlValue, change: pnl >= 0 ? `${((pnl / 1000) * 100).toFixed(1)}%` : `-${Math.abs((pnl / 1000) * 100).toFixed(1)}%` }
            }
            if (stat.label === 'Active Positions') {
              return { ...stat, value: `${portfolioData.success ? (portfolioData.tokenCount || 0) : 0}` }
            }
            if (stat.label === 'Total Trades') {
              return { ...stat, value: `${totalTrades}` }
            }
            if (stat.label === 'Win Rate') {
              return { ...stat, value: `${winRate}%` }
            }
            return stat
          }))
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-400 text-sm">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          {stat.change && (
            <p className="text-sm text-gray-400 mt-1">{stat.change}</p>
          )}
        </div>
      ))}
    </div>
  )
}
