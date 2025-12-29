import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// 🟢 1️⃣ Define types for the trend data item
export interface RealTrendDataItem {
  date: string
  _id: string
  value: number
}

// 🟢 2️⃣ Define type for the date range metadata
export interface TrendRange {
  start: string
  end: string
  diffDays: number
}

// 🟢 3️⃣ Define full API response type
export interface RealChartTrendsResponse {
  message: string
  range: TrendRange
  total_reals: number
  data: RealTrendDataItem[]
}

// 🟢 4️⃣ Define query arguments type
export interface RealChartTrendsQueryParams {
  metrics: string
  breakdown: boolean
  startDate?: string
  endDate?: string
}

// 🟢 5️⃣ Create API slice
export const realChart_Trends = createApi({
  reducerPath: 'realChart_Trends',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

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
