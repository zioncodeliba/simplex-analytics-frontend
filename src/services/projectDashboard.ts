import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface DashboardData {
  totalProjects: number
  totalReals: number
  avgOpenRate: number
  avgSessionDuration: number
}

interface DashboardResponse {
  message: string
  data: DashboardData
}

export const projectDashboard = createApi({
  reducerPath: 'projectDashboard',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: builder => ({
    getDashboard: builder.query<
      DashboardResponse,
      { startDate?: string; endDate?: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: '/project/dashboard',
        params: { startDate, endDate },
      }),
    }),
  }),
})

export const { useGetDashboardQuery } = projectDashboard
