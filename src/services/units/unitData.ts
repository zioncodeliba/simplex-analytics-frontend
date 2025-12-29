import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export interface UnitItem {
  name: string
  availability: string
  totalTime: number
  uniqueUsers: number
  realsCount: number
  slideViews: number
  avgTime: number
  firstSeen: number | null
  lastSeen: number | null
  seenCount: number
  id: string
}

export interface UnitPagination {
  page: number
  limit: number
  total: number
}

export interface UnitApiResponse {
  message: string
  data: UnitItem[]
  pagination: UnitPagination
}

export interface UnitApiParams {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
}

export const unitDataApi = createApi({
  reducerPath: 'unitDataApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  endpoints: builder => ({
    getUnitData: builder.query<UnitApiResponse, UnitApiParams>({
      query: ({ page = 1, limit = 10, search = '', startDate, endDate }) => ({
        url: '/unit',
        params: { page, limit, search, startDate, endDate },
      }),
    }),
  }),
})

export const { useGetUnitDataQuery } = unitDataApi
