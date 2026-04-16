export default function APIConnections() {
  const connections = [
    { name: 'Telegram Bot', status: 'connected', color: 'bg-green-500' },
    { name: 'Solana Wallet', status: 'connected', color: 'bg-green-500' },
    { name: 'GMGN API', status: 'configured', color: 'bg-blue-500' },
    { name: 'BirdEye API', status: 'configured', color: 'bg-blue-500' },
    { name: 'Jupiter API', status: 'configured', color: 'bg-blue-500' },
    { name: 'Pump.fun', status: 'ready', color: 'bg-yellow-500' },
  ]

  return (
    <div className="space-y-3">
      {connections.map((conn, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${conn.color} mr-3`} />
            <span>{conn.name}</span>
          </div>
          <span className="text-gray-400 capitalize">{conn.status}</span>
        </div>
      ))}
    </div>
  )
}
