import { ReactNode } from 'react'

interface StatItem {
  label: string;
  value: string;
  change?: string;
  color: string;
}

export default function DashboardStats() {
  const stats: StatItem[] = [
    { label: 'Portfolio Value', value: '$0.00', change: '+0%', color: 'text-solana-green' },
    { label: "Today's P&L", value: '$0.00', change: '0%', color: 'text-gray-400' },
    { label: 'Active Positions', value: '0', change: '', color: 'text-white' },
    { label: 'Total Trades', value: '0', change: '', color: 'text-white' },
    { label: 'Win Rate', value: '0%', change: '', color: 'text-white' },
    { label: 'Bot Status', value: 'Ready', change: '', color: 'text-solana-green' },
  ]

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
