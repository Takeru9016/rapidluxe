'use client'

import { cn } from '@/lib/utils'
import { useCountdown } from '@/hooks/useCountdown'

interface CountdownTimerProps {
  expiresAt: Date
  variant?: 'inline' | 'blocks'
  className?: string
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function CountdownTimer({ expiresAt, variant = 'inline', className }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, expired } = useCountdown(expiresAt)

  if (variant === 'inline') {
    if (expired) {
      return (
        <span className={cn('font-sans text-sm text-[var(--color-text-secondary)]', className)}>
          Expired
        </span>
      )
    }
    return (
      <span className={cn('font-mono text-sm text-[var(--color-coral)]', className)}>
        {pad(days)}d : {pad(hours)}h : {pad(minutes)}m : {pad(seconds)}s
      </span>
    )
  }

  if (expired) {
    return (
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 font-sans text-sm text-[var(--color-text-secondary)]',
          className
        )}
      >
        Deal Ended
      </span>
    )
  }

  const blocks: { value: number; label: string }[] = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hrs' },
    { value: minutes, label: 'Mins' },
    { value: seconds, label: 'Secs' },
  ]

  return (
    <div className={cn('flex gap-3', className)}>
      {blocks.map(({ value, label }) => (
        <div
          key={label}
          className="bg-[var(--color-navy-surface)] border border-[var(--color-coral)]/30 rounded-lg px-3 py-2 flex flex-col items-center min-w-[56px]"
        >
          <span className="font-mono text-2xl font-bold text-[var(--color-coral)] leading-none">
            {pad(value)}
          </span>
          <span className="font-sans text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mt-1">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
