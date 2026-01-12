import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuerys from '../baseQuery'

export interface RealTrendDataItem {
  date: string
  _id: string
  value: number
}

export interface TrendRange {
  start: string
  end: string
  diffDays: number
}

export interface RealChartTrendsResponse {
  message: string
  range: TrendRange
  total_reals: number
  data: RealTrendDataItem[]
}

export interface RealChartTrendsQueryParams {
  metrics: string
  breakdown: boolean
  startDate?: string
  endDate?: string
}

export const realChart_Trends = createApi({
  reducerPath: 'realChart_Trends',

  baseQuery: baseQuerys,

  endpoints: builder => ({
    getrealChart_Trends: builder.query<
      RealChartTrendsResponse,
      RealChartTrendsQueryParams
    >({
      query: ({ metrics, breakdown, startDate, endDate }) => ({
        url: '/reals/trends',
        params: { metrics, breakdown, startDate, endDate },
      }),
    }),
  }),
})

// 🟢 6️⃣ Export hook
export const { useGetrealChart_TrendsQuery } = realChart_Trends
