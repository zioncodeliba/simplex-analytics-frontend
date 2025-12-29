import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// types.ts

export interface SlideItem {
  slideId: string
  slideName: string
  timeSpent: number
  numberOfPauses: number
}

export interface PopupSlidesResponse {
  message: string
  result: SlideItem[]
}

export const popupSlides = createApi({
  reducerPath: 'popupSlides',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: builder => ({
    getpopupSlides: builder.query<PopupSlidesResponse, { realId: string }>({
      query: ({ realId }) => ({
        url: '/reals/popup',
        params: { realId },
      }),
    }),
  }),
})

export const { useGetpopupSlidesQuery } = popupSlides
