import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuerys from './baseQuery'

export interface CurrentUser {
  userId: string
  name: string
  email: string
  userType: string
  client_id: string
}

export interface CurrentUserResponse {
  user: CurrentUser
}

export const userProfileApi = createApi({
  reducerPath: 'userProfileApi',
  baseQuery: baseQuerys,
  endpoints: builder => ({
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => ({
        url: '/auth/me',
      }),
    }),
  }),
})

export const { useGetCurrentUserQuery } = userProfileApi
