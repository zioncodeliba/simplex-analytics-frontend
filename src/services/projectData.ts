import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define the structure of a single project item
export interface ProjectItem {
  id: number
  name: string
  status: string
  realsCount: number
  openRate: number
  totalVisits: number
  uniqueUsers: number
  avgTimeSpent: number
  createdAt: string
  lastUpdated: string
}

export interface ProjectDataResponse {
  message: string
  totalProjects: number
  data: ProjectItem[]
}

// Create the API
export const projectData = createApi({
  reducerPath: 'projectData',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: builder => ({
    getProjectData: builder.query<
      ProjectDataResponse,
      {
        page?: number
        limit?: number
        search: string
        startDate?: string
        endDate?: string
      }
    >({
      query: ({ page = 1, limit = 10, search = '', startDate, endDate }) => ({
        url: '/project/projectsdata',
        params: { page, limit, search, startDate, endDate },
      }),
    }),
  }),
})

export const { useGetProjectDataQuery } = projectData
