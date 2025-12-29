'use client'
import { ReactNode, useState } from 'react'
import { DateContext, IDateState } from './context'

type Props = {
  children: ReactNode
}

export function DateProvider({ children }: Props) {
  const [date, setDate] = useState<IDateState>({
    startDate: undefined,
    endDate: undefined,
  })

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  )
}
