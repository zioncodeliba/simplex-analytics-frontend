import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuerys from '../baseQuery'
export interface UnitDashboardResponse {
  message: string
  TotalUnits: number
  totalVisits: number
  unitOpenRate: number
  totalunitOpen: number
  avgTimePerUser: number
}

export const unitDashboard = createApi({
  reducerPath: 'unitDashboard',
  baseQuery: baseQuerys,
  endpoints: builder => ({
    getunitDashboard: builder.query<
      UnitDashboardResponse,
      { startDate?: string; endDate?: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: '/unit/dashboard',
        params: { startDate, endDate },
      }),
    }),
  }),
})

export const { useGetunitDashboardQuery } = unitDashboard
