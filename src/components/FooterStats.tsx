'use client'
import { useEffect, useState, useRef } from 'react'

function genSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function FooterStats() {
  const [current, setCurrent] = useState<number | null>(null)
  const [total, setTotal] = useState<number | null>(null)
  const sessionRef = useRef<string>('')

  useEffect(() => {
    // Get or create a persistent session id
    let sid = localStorage.getItem('_pv_sid')
    if (!sid) { sid = genSessionId(); localStorage.setItem('_pv_sid', sid) }
    sessionRef.current = sid

    const ping = () =>
      fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: sid }) })

    const fetchStats = () =>
      fetch('/api/stats').then(r => r.json()).then(d => {
        if (typeof d.currentViewers === 'number') setCurrent(d.currentViewers)
        if (typeof d.totalViews === 'number') setTotal(d.totalViews)
      }).catch(() => {})

    ping()
    fetchStats()

    const pingInterval = setInterval(ping, 30_000)
    const statsInterval = setInterval(fetchStats, 10_000)

    return () => { clearInterval(pingInterval); clearInterval(statsInterval) }
  }, [])

  return (
    <div className="flex items-center justify-center gap-6 mt-6 pt-6"
      style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: '#4ade80' }} />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5"
            style={{ background: '#22c55e' }} />
        </span>
        <span className="text-xs" style={{ color: '#94a3b8' }}>
          अभी देख रहे हैं:{' '}
          <span className="font-bold text-sm" style={{ color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>
            {current === null ? '—' : current.toLocaleString('hi-IN')}
          </span>
        </span>
      </div>
      <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
      <div className="flex items-center gap-2">
        <span className="text-base">👁️</span>
        <span className="text-xs" style={{ color: '#94a3b8' }}>
          कुल विज़िट:{' '}
          <span className="font-bold text-sm" style={{ color: '#e2e8f0', fontVariantNumeric: 'tabular-nums' }}>
            {total === null ? '—' : total.toLocaleString('hi-IN')}
          </span>
        </span>
      </div>
    </div>
  )
}
