import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const engagement_Trends = createApi({
  reducerPath: 'engagement_Trends',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

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
