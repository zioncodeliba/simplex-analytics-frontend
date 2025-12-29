import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
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
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
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
