export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('hi-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export function getDifficultyLabel(d: string): string {
  return d === 'EASY' ? 'आसान' : d === 'HARD' ? 'कठिन' : 'मध्यम'
}

export function getDifficultyColor(d: string): string {
  return d === 'EASY' ? 'text-green-600' : d === 'HARD' ? 'text-red-600' : 'text-yellow-600'
}
