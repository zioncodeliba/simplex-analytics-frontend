import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const projectChartApi = createApi({
  reducerPath: 'projectChartApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  endpoints: builder => ({
    getProjectChart: builder.query({
      query: ({ metrics, startDate, endDate }) => ({
        url: '/project/performance',
        params: { metrics, endDate, startDate },
      }),
    }),
  }),
})

export const { useGetProjectChartQuery } = projectChartApi
