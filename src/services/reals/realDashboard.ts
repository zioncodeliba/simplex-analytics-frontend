import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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

// 🟢 Define the full response structure
export interface RealsDashboardResponse {
  message: string
  data: RealsDashboardData
}

// 🟢 Create the API slice
export const realsDashboard = createApi({
  reducerPath: 'realsDashboard',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
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

// 🟢 Export auto-generated hook
export const { useGetRealsDashboardQuery } = realsDashboard
