'use client'

import { useEffect, useState } from 'react'

export interface AqiEntry {
  userId: string
  lat: number
  lng: number
  aqi: number
}

export function useAqiStream() {
  const [data, setData] = useState<AqiEntry[]>([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8082'
    const es = new EventSource(`${apiUrl}/api/v1/sse/aqi-stream`)

    es.addEventListener('aqi-update', (e: MessageEvent) => {
      try {
        const parsed: AqiEntry[] = JSON.parse(e.data)
        setData(parsed)
        setConnected(true)
        setError(null)
      } catch {
        setError('Failed to parse AQI data')
      }
    })

    es.onerror = () => {
      setConnected(false)
      setError('Connection lost — retrying...')
    }

    return () => es.close()
  }, [])

  return { data, connected, error }
}
