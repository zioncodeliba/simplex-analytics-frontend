import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuerys from './baseQuery'
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
  baseQuery: baseQuerys,
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
