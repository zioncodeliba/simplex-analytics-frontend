import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// 🟢 1️⃣ Define the Type for a single Real
export interface RealData {
  realId: string
  realName: string
  project: string
  sharingTitle: string
  createdBy: string
  createdAt: string
  updatedAt: string
  firstSeen: string
  lastSeen: string
  slides: number
  visits: number
  uniqUsers: number
}

// 🟢 2️⃣ Define the API Response Type
export interface RealsApiResponse {
  message: string
  realsData: RealData[]
  total: number
}

// 🟢 3️⃣ Create the API Slice
export const RealsData = createApi({
  reducerPath: 'RealsData',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: builder => ({
    getRealsData: builder.query<
      RealsApiResponse,
      {
        page?: number
        limit?: number
        search?: string
        startDate?: string
        endDate?: string
      }
    >({
      query: ({ page = 1, limit = 10, search = '', startDate, endDate }) => ({
        url: '/reals',
        params: { page, limit, search, startDate, endDate },
      }),
    }),
  }),
})

export const { useGetRealsDataQuery } = RealsData
