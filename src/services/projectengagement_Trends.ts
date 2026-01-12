import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuerys from './baseQuery'

export const engagement_Trends = createApi({
  reducerPath: 'engagement_Trends',
  baseQuery: baseQuerys,

  endpoints: builder => ({
    getEngagement_Trends: builder.query({
      query: ({ metrics, breakdown, startDate, endDate }) => ({
        url: '/project/engagement_trends',
        params: { metrics, breakdown, startDate, endDate },
      }),
    }),
  }),
})

export const { useGetEngagement_TrendsQuery } = engagement_Trends
