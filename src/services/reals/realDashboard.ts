import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuerys from '../baseQuery'

// 🟢 Define the expected response type from the API
export interface RealsDashboardData {
  realsCount: number
  avgOpenRate: number
  totalVisits: number
  distinctVisitors: number
  avgTimePerUser: number
  slidesRetention: number
  totalRealsOpened: number
}

export interface RealsDashboardResponse {
  message: string
  data: RealsDashboardData
}

export const realsDashboard = createApi({
  reducerPath: 'realsDashboard',
  baseQuery: baseQuerys,
  endpoints: builder => ({
    getRealsDashboard: builder.query<
      RealsDashboardResponse,
      { startDate?: string; endDate?: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: '/reals/dashboard',
        params: { startDate, endDate },
      }),
    }),
  }),
})

export const { useGetRealsDashboardQuery } = realsDashboard
