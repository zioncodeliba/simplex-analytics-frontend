'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import '../styles/globals.css'
interface DateFilterProps {
  onDateRangeChange: (range: {
    from: Date | undefined
    to: Date | undefined
  }) => void
}

export function DateFilter({ onDateRangeChange }: DateFilterProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { label: '1D', value: 1, unit: 'days' },
    { label: '5D', value: 5, unit: 'days' },
    { label: '1M', value: 1, unit: 'months' },
    { label: '3M', value: 3, unit: 'months' },
    { label: '6M', value: 6, unit: 'months' },
    { label: '1Y', value: 1, unit: 'years' },
  ]

  const subtractTime = (date: Date, value: number, unit: string): Date => {
    const newDate = new Date(date)
    switch (unit) {
      case 'days':
        newDate.setDate(newDate.getDate() - value)
        break
      case 'months':
        newDate.setMonth(newDate.getMonth() - value)
        break
      case 'years':
        newDate.setFullYear(newDate.getFullYear() - value)
        break
    }
    return newDate
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
  }

  const handleShortcut = (shortcut: (typeof shortcuts)[0]) => {
    const to = new Date()
    const from = subtractTime(to, shortcut.value, shortcut.unit)

    const newRange = { from, to }
    setDateRange(newRange)
    onDateRangeChange(newRange)

    setIsOpen(false)
  }

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      const newRange = { from: range.from, to: range.to }
      setDateRange(newRange)
      onDateRangeChange(newRange)
    }
  }

  return (
    <div className='flex flex-col md:flex-row gap-2'>
      <div className='flex gap-1 flex-wrap'>
        {shortcuts.map(shortcut => (
          <Button
            key={shortcut.label}
            variant='outline'
            size='sm'
            onClick={() => handleShortcut(shortcut)}
            className='px-3 py-1 h-8 text-xs bg-white border-gray-300 hover:bg-gray-50'
            style={{ color: '#203d4d' }}
          >
            {shortcut.label}
          </Button>
        ))}
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='w-full md:w-auto justify-start text-left bg-white border-gray-300 hover:bg-gray-50'
            style={{ color: '#203d4d' }}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {dateRange.from && dateRange.to
              ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
              : 'Select date range'}
          </Button>
        </PopoverTrigger>

        {/* Give the popover a fixed/min width so two months have room */}
        <PopoverContent
          className='w-[540px] max-w-[90vw] p-2 bg-white border-gray-300 rounded-md'
          align='end'
        >
          <Calendar
            mode='range'
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            pagedNavigation // Ensures arrows navigate by 2 months if desired, or remove for 1
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
