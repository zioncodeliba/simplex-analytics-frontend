import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuerys from '../baseQuery'
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
  baseQuery: baseQuerys,
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
