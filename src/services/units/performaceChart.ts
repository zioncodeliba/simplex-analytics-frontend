import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * Response shape for /unit/performance
 */
export interface UnitPerformanceItem {
  id: number
  unitId: string
  name: string
  project: string
  unit: string
  value: number
}

export interface UnitPerformanceResponse {
  message: string
  data: UnitPerformanceItem[]
}

/**
 * Query argument type
 */
export interface GetUnitChartArgs {
  metrics: string
  startDate: string | undefined
  endDate: string | undefined
}

export const performanceChart = createApi({
  reducerPath: 'performanceChart',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  endpoints: builder => ({
    getUnitChart: builder.query<UnitPerformanceResponse, GetUnitChartArgs>({
      query: ({ metrics, startDate, endDate }) => ({
        url: '/unit/performance',
        params: { metrics, startDate, endDate },
      }),
    }),
  }),
})

export const { useGetUnitChartQuery } = performanceChart
