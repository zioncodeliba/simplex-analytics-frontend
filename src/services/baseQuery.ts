import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  prepareHeaders: headers => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    if (typeof window !== 'undefined') {
      const loginUrl =
        process.env.NEXT_PUBLIC_CLIENT_LOGIN ||
        process.env.CLIENT_LOGIN ||
        'https://devreals2.simplex3d.com/authenticator/login'
      window.location.href = loginUrl
    }
  }
  return result
}

export default baseQuery
