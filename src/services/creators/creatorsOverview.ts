import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuerys from '../baseQuery'

export interface CreatorRow {
  id: number
  name: string
  email: string
  totalCreated: number
  totalVisits: number
  uniqueUsers: number
  avgTimeSpent: number
  firstRealCreated: string | null
  lastActivity: string | null
}

export interface CreatorsOverviewResponse {
  message: string
  data: {
    overview: {
      totalActive: number
      avgRealsPerCreator: number
      totalReals: number
      avgTimePerCreator: number
      totalUniqueUsers: number
    }
    topCreators: {
      reals_count: { name: string; value: number; id: number }[]
      total_visits: { name: string; value: number; id: number }[]
      avg_time: { name: string; value: number; id: number }[]
    }
    creators: CreatorRow[]
  }
}

export const creatorsOverview = createApi({
  reducerPath: 'creatorsOverview',
  baseQuery: baseQuerys,
  endpoints: builder => ({
    getCreatorsOverview: builder.query<
      CreatorsOverviewResponse,
      { startDate?: string; endDate?: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: '/creators/overview',
        params: { startDate, endDate },
      }),
    }),
  }),
})

export const { useGetCreatorsOverviewQuery } = creatorsOverview
