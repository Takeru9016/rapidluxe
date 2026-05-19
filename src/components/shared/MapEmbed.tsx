// Phase 3B: replace with Google Maps JS API
import { Map } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MapEmbedProps {
  lat?: number
  lng?: number
  zoom?: number
  label?: string
  height?: string
  variant?: 'static' | 'interactive'
  className?: string
}

export function MapEmbed({ label, height = 'h-64', className }: MapEmbedProps) {
  return (
    <div
      className={cn(height, 'rounded-xl border border-[var(--color-navy-border)] bg-[var(--color-navy-surface)] flex flex-col items-center justify-center gap-3 relative overflow-hidden', className)}
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            var(--color-navy-border) 39px,
            var(--color-navy-border) 40px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 39px,
            var(--color-navy-border) 39px,
            var(--color-navy-border) 40px
          )
        `,
      }}
    >
      <Map size={32} className="text-[var(--color-gold)]" />
      {label && (
        <p className="font-sans text-sm text-[var(--color-text-secondary)]">{label}</p>
      )}
      <p className="font-sans text-xs text-[var(--color-text-secondary)]">
        Interactive map coming soon
      </p>
    </div>
  )
}
