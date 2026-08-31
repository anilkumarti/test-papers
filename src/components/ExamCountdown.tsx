'use client'
import { useState, useEffect } from 'react'

const EXAM_DATE = new Date('2026-09-22T00:00:00+05:30')

function getLeft() {
  const diff = EXAM_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  }
}

// Compact chip for Navbar
export function CountdownChip() {
  const [t, setT] = useState(getLeft)
  useEffect(() => {
    const id = setInterval(() => setT(getLeft()), 60000)
    return () => clearInterval(id)
  }, [])
  if (t.expired) return null
  return (
    <span className="inline-flex items-center gap-1 font-bold rounded-full"
      style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde08a', fontSize: 12, padding: '3px 10px' }}>
      ⏳ {t.days} दिन बचे
    </span>
  )
}

// Full countdown for hero section
export default function ExamCountdown() {
  const [t, setT] = useState(getLeft)
  useEffect(() => {
    const id = setInterval(() => setT(getLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (t.expired) return (
    <div className="text-center py-3" style={{ color: '#fcd34d', fontWeight: 700 }}>परीक्षा का दिन आ गया! शुभकामनाएं 🎯</div>
  )

  const units = [
    { val: t.days,    label: 'दिन' },
    { val: t.hours,   label: 'घंटे' },
    { val: t.minutes, label: 'मिनट' },
    { val: t.seconds, label: 'सेकंड' },
  ]

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {units.map((u, i) => (
        <div key={i} className="flex items-start gap-2 sm:gap-3">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-bold text-xl sm:text-2xl text-white"
              style={{ background: 'rgba(255,255,255,0.15)', fontVariantNumeric: 'tabular-nums', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {String(u.val).padStart(2, '0')}
            </div>
            <div className="text-xs mt-1 font-medium" style={{ color: '#93c5fd' }}>{u.label}</div>
          </div>
          {i < 3 && (
            <div className="text-xl font-bold mt-3.5 sm:mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>:</div>
          )}
        </div>
      ))}
    </div>
  )
}
