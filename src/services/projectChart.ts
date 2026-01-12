import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuerys from './baseQuery'

export const projectChartApi = createApi({
  reducerPath: 'projectChartApi',

  baseQuery: baseQuerys,

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
