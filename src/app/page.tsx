'use client'

import dynamic from 'next/dynamic'
import { useAqiStream } from '@/hooks/useAqiStream'

const AqiMap = dynamic(() => import('@/components/AqiMap'), { ssr: false })

function aqiColor(aqi: number): string {
  if (aqi <= 50) return 'bg-green-400'
  if (aqi <= 100) return 'bg-yellow-300'
  if (aqi <= 150) return 'bg-orange-400'
  if (aqi <= 200) return 'bg-red-500'
  if (aqi <= 300) return 'bg-purple-600'
  return 'bg-rose-900'
}

function aqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy (Sensitive)'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

export default function Dashboard() {
  const { data, connected, error } = useAqiStream()

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">AQI Live Map</span>
          <span className="text-xs text-zinc-400">Thailand Air Quality</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}
          />
          <span className={connected ? 'text-green-400' : 'text-red-400'}>
            {connected ? `Live · ${data.length} users` : error ?? 'Connecting...'}
          </span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <AqiMap data={data} />
        </div>

        {/* Sidebar */}
        <aside className="w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 text-sm font-semibold text-zinc-300">
            User Readings
          </div>

          {data.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
              Waiting for data...
            </div>
          ) : (
            <ul className="flex-1 overflow-y-auto divide-y divide-zinc-800">
              {data.map((entry) => (
                <li key={entry.userId} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-zinc-400 truncate">{entry.userId}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {entry.lat.toFixed(4)}, {entry.lng.toFixed(4)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full text-zinc-900 ${aqiColor(entry.aqi)}`}
                    >
                      {entry.aqi}
                    </span>
                    <span className="text-xs text-zinc-500 mt-0.5">{aqiLabel(entry.aqi)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Legend */}
          <div className="px-4 py-3 border-t border-zinc-800 text-xs space-y-1 text-zinc-400">
            <div className="font-semibold text-zinc-300 mb-2">AQI Legend</div>
            {[
              { range: '0–50', label: 'Good', color: 'bg-green-400' },
              { range: '51–100', label: 'Moderate', color: 'bg-yellow-300' },
              { range: '101–150', label: 'Unhealthy (Sensitive)', color: 'bg-orange-400' },
              { range: '151–200', label: 'Unhealthy', color: 'bg-red-500' },
              { range: '201–300', label: 'Very Unhealthy', color: 'bg-purple-600' },
              { range: '301+', label: 'Hazardous', color: 'bg-rose-900' },
            ].map(({ range, label, color }) => (
              <div key={range} className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
                <span className="text-zinc-500">{range}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
