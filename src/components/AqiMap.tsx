'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import type { AqiEntry } from '@/hooks/useAqiStream'
import 'leaflet/dist/leaflet.css'

interface Props {
  data: AqiEntry[]
}

function aqiColor(aqi: number): string {
  if (aqi <= 50) return '#00e400'
  if (aqi <= 100) return '#ffff00'
  if (aqi <= 150) return '#ff7e00'
  if (aqi <= 200) return '#ff0000'
  if (aqi <= 300) return '#8f3f97'
  return '#7e0023'
}

function aqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

// Thailand center
const DEFAULT_CENTER: [number, number] = [13.7563, 100.5018]
const DEFAULT_ZOOM = 6

export default function AqiMap({ data }: Props) {
  useEffect(() => {
    // Fix Leaflet default icon path issue with webpack
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet')
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  }, [])

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((entry) => (
        <CircleMarker
          key={entry.userId}
          center={[entry.lat, entry.lng]}
          radius={14}
          pathOptions={{
            fillColor: aqiColor(entry.aqi),
            fillOpacity: 0.85,
            color: '#fff',
            weight: 1.5,
          }}
        >
          <Tooltip permanent={false} direction="top" offset={[0, -10]}>
            <div className="text-xs font-semibold">
              <div>AQI: {entry.aqi}</div>
              <div>{aqiLabel(entry.aqi)}</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
