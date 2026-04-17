'use client'

import { useState } from 'react'
import DashboardStats from '@/components/DashboardStats'
import PortfolioChart from '@/components/PortfolioChart'
import StrategyPerformance from '@/components/StrategyPerformance'
import RecentTrades from '@/components/RecentTrades'
import RiskDashboard from '@/components/RiskDashboard'
import APIConnections from '@/components/APIConnections'

export default function Dashboard() {
  const [botStatus, setBotStatus] = useState<'Ready' | 'Running' | 'Stopped'>('Ready')
  const [scanning, setScanning] = useState(false)
  const [sniperActive, setSniperActive] = useState(false)

  const handleStartTrading = async () => {
    if (botStatus === 'Running') {
      setBotStatus('Stopped')
    } else {
      setBotStatus('Running')
    }
  }

  const handleScanGMGN = async () => {
    setScanning(true)
    try {
      const response = await fetch('/api/gmgn?action=trending')
      const data = await response.json()

      if (data.success) {
        const tokens = data.data.data

        // Create an alert with trending tokens
        const tokenList = tokens.slice(0, 5).map((t: any, i: number) =>
          `${i + 1}. ${t.symbol} - $${t.price} (${t.change_24h > 0 ? '+' : ''}${t.change_24h}%)\n   Liquidity: $${(t.liquidity / 1000000).toFixed(1)}M\n   Volume: $${(t.volume_24h / 1000000).toFixed(1)}M`
        ).join('\n\n')

        alert(`🚀 GMGN TRENDING TOKENS SCANNED!\n\n${tokenList}`)
      } else {
        alert('❌ Failed to scan GMGN signals')
      }
    } catch (error) {
      alert('❌ Error scanning GMGN: ' + (error as Error).message)
    } finally {
      setScanning(false)
    }
  }

  const handleActivateSniper = async () => {
    setSniperActive(!sniperActive)
    const status = !sniperActive ? 'ACTIVE' : 'DEACTIVATED'
    alert(`🎯 Pump.fun Sniper ${status}!\n\nMonitoring for new launches...`)
  }

  const handleEmergencyStop = () => {
    if (confirm('⚠️ EMERGENCY STOP - Are you sure?\n\nThis will halt all trading activity.')) {
      setBotStatus('Stopped')
      setSniperActive(false)
      alert('🛑 EMERGENCY STOP ACTIVATED\n\nAll trading has been halted.')
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold gradient-text">
          Ultimate Trading Bot Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Real-time monitoring for GMGN + Pump.fun trading system
        </p>
      </header>

      {/* Stats Overview */}
      <div className="mb-8">
        <DashboardStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Portfolio Value</h2>
            <PortfolioChart />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Strategy Performance</h2>
            <StrategyPerformance />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Trades</h2>
            <RecentTrades />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Risk Dashboard</h2>
            <RiskDashboard />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">API Connections</h2>
            <APIConnections />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={handleStartTrading}
                className={`w-full py-3 rounded-lg font-bold transition ${
                  botStatus === 'Running'
                    ? 'bg-red-600 text-white hover:opacity-90'
                    : 'bg-solana-green text-black hover:opacity-90'
                }`}
              >
                {botStatus === 'Running' ? 'Stop Trading' : 'Start Trading'}
              </button>
              <button
                onClick={handleScanGMGN}
                disabled={scanning}
                className={`w-full bg-gmgn-blue text-white py-3 rounded-lg font-bold hover:opacity-90 transition ${
                  scanning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {scanning ? '🔄 Scanning...' : '🚀 Scan GMGN Signals'}
              </button>
              <button
                onClick={handleActivateSniper}
                className={`w-full py-3 rounded-lg font-bold transition ${
                  sniperActive
                    ? 'bg-red-600 text-white hover:opacity-90'
                    : 'bg-pumpfun-orange text-white hover:opacity-90'
                }`}
              >
                {sniperActive ? '🎯 Deactivate Sniper' : '🎯 Activate Sniper'}
              </button>
              <button
                onClick={handleEmergencyStop}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:opacity-90 transition border-2 border-red-600 hover:bg-red-600"
              >
                🛑 Emergency Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
