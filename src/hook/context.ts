import { createContext } from 'react'
export interface IDateState {
  startDate: string | undefined
  endDate: string | undefined
}
type DateContextType = {
  date: IDateState
  setDate: React.Dispatch<React.SetStateAction<IDateState>>
}
export const DateContext = createContext<DateContextType | undefined>(undefined)
