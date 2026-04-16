import DashboardStats from '@/components/DashboardStats'
import PortfolioChart from '@/components/PortfolioChart'
import StrategyPerformance from '@/components/StrategyPerformance'
import RecentTrades from '@/components/RecentTrades'
import RiskDashboard from '@/components/RiskDashboard'
import APIConnections from '@/components/APIConnections'

export default function Dashboard() {
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
              <button className="w-full bg-solana-green text-black py-3 rounded-lg font-bold hover:opacity-90 transition">
                Start Trading
              </button>
              <button className="w-full bg-gmgn-blue text-white py-3 rounded-lg font-bold hover:opacity-90 transition">
                Scan GMGN Signals
              </button>
              <button className="w-full bg-pumpfun-orange text-white py-3 rounded-lg font-bold hover:opacity-90 transition">
                Activate Sniper
              </button>
              <button className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:opacity-90 transition">
                Emergency Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
