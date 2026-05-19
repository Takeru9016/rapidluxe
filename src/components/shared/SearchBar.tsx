'use client'

import { useState } from 'react'
import { MapPin, Calendar, Users, Search, Minus, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'

interface SearchBarProps {
  variant?: 'hero' | 'inline'
  className?: string
}

interface TravelerRowProps {
  label: string
  sublabel: string
  value: number
  min: number
  max: number
  onDecrement: () => void
  onIncrement: () => void
}

function TravelerRow({ label, sublabel, value, min, max, onDecrement, onIncrement }: TravelerRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-sans text-white">{label}</p>
        <p className="text-xs font-sans text-[var(--color-text-secondary)]">{sublabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrement}
          disabled={value <= min}
          className="w-7 h-7 rounded-full border border-[var(--color-navy-border)] flex items-center justify-center text-white disabled:opacity-30 hover:border-[var(--color-gold)] transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="w-4 text-center font-mono text-white text-sm">{value}</span>
        <button
          onClick={onIncrement}
          disabled={value >= max}
          className="w-7 h-7 rounded-full border border-[var(--color-navy-border)] flex items-center justify-center text-white disabled:opacity-30 hover:border-[var(--color-gold)] transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  )
}

export function SearchBar({ variant = 'hero', className }: SearchBarProps) {
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState<Date | null>(null)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  const travelerSummary = () => {
    const parts = [`${adults} Adult${adults !== 1 ? 's' : ''}`]
    if (children > 0) parts.push(`${children} Child${children !== 1 ? 'ren' : ''}`)
    if (infants > 0) parts.push(`${infants} Infant${infants !== 1 ? 's' : ''}`)
    return parts.join(', ')
  }

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 bg-[#111827]/90 backdrop-blur-md rounded-full border border-[var(--color-navy-border)] px-4 py-2',
          className
        )}
      >
        <MapPin size={14} className="text-[var(--color-gold)] shrink-0" />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Search destinations..."
          className="flex-1 bg-transparent text-sm font-sans text-white placeholder:text-[var(--color-text-secondary)] outline-none min-w-0"
        />
        <button className="bg-[var(--color-coral)] text-white rounded-full px-4 py-1.5 text-sm font-sans font-medium flex items-center gap-1.5 shrink-0">
          <Search size={14} />
          Search
        </button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-[#111827]/90 backdrop-blur-md rounded-2xl border border-[var(--color-navy-border)] shadow-2xl overflow-hidden',
        'flex flex-col md:flex-row md:items-stretch',
        className
      )}
    >
      {/* Destination */}
      <div className="flex-1 flex items-center gap-3 px-5 py-4 border-b border-[var(--color-navy-border)] md:border-b-0 md:border-r">
        <MapPin size={16} className="text-[var(--color-gold)] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-sans text-[var(--color-text-secondary)] mb-0.5">Destination</p>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where to?"
            className="w-full bg-transparent font-sans text-white placeholder:text-[var(--color-text-secondary)] outline-none text-sm"
          />
        </div>
      </div>

      {/* Date */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex-1 flex items-center gap-3 px-5 py-4 border-b border-[var(--color-navy-border)] md:border-b-0 md:border-r text-left hover:bg-white/5 transition-colors">
            <Calendar size={16} className="text-[var(--color-gold)] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans text-[var(--color-text-secondary)] mb-0.5">Date</p>
              <p className={cn('text-sm font-sans', date ? 'text-white' : 'text-[var(--color-text-secondary)]')}>
                {date ? format(date, 'dd MMM yyyy') : 'Select date'}
              </p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[#111827] border-[var(--color-navy-border)]" align="start">
          <CalendarComponent
            mode="single"
            selected={date ?? undefined}
            onSelect={(d) => setDate(d ?? null)}
            disabled={{ before: new Date() }}
            className="text-white"
          />
        </PopoverContent>
      </Popover>

      {/* Travelers */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex-1 flex items-center gap-3 px-5 py-4 border-b border-[var(--color-navy-border)] md:border-b-0 md:border-r text-left hover:bg-white/5 transition-colors">
            <Users size={16} className="text-[var(--color-gold)] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans text-[var(--color-text-secondary)] mb-0.5">Travelers</p>
              <p className="text-sm font-sans text-white truncate">{travelerSummary()}</p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-[#111827] border-[var(--color-navy-border)] p-4" align="start">
          <div className="divide-y divide-[var(--color-navy-border)]">
            <TravelerRow
              label="Adults"
              sublabel="Age 13+"
              value={adults}
              min={1}
              max={10}
              onDecrement={() => setAdults((v) => Math.max(1, v - 1))}
              onIncrement={() => setAdults((v) => Math.min(10, v + 1))}
            />
            <TravelerRow
              label="Children"
              sublabel="Age 2–12"
              value={children}
              min={0}
              max={8}
              onDecrement={() => setChildren((v) => Math.max(0, v - 1))}
              onIncrement={() => setChildren((v) => Math.min(8, v + 1))}
            />
            <TravelerRow
              label="Infants"
              sublabel="Under 2"
              value={infants}
              min={0}
              max={5}
              onDecrement={() => setInfants((v) => Math.max(0, v - 1))}
              onIncrement={() => setInfants((v) => Math.min(5, v + 1))}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Search button */}
      <div className="flex items-stretch p-3 md:p-2">
        <button className="w-full md:w-auto bg-[var(--color-coral)] text-white rounded-xl px-6 py-3 font-sans font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <Search size={16} />
          Search
        </button>
      </div>
    </div>
  )
}
