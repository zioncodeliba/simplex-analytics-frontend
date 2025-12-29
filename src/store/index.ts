import { projectChartApi } from '@/services/projectChart'
import { projectDashboard } from '@/services/projectDashboard'
import { projectData } from '@/services/projectData'
import { engagement_Trends } from '@/services/projectengagement_Trends'
import { popupSlides } from '@/services/reals/popupslides'
import { realsDashboard } from '@/services/reals/realDashboard'
import { realChart_Trends } from '@/services/reals/realsChart'
import { RealsData } from '@/services/reals/RealsData'
import { performanceChart } from '@/services/units/performaceChart'
import { unitDashboard } from '@/services/units/unitDashboard'
import { unitDataApi } from '@/services/units/unitData'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    [projectDashboard.reducerPath]: projectDashboard.reducer,
    [projectData.reducerPath]: projectData.reducer,
    [projectChartApi.reducerPath]: projectChartApi.reducer,
    [engagement_Trends.reducerPath]: engagement_Trends.reducer,
    [realsDashboard.reducerPath]: realsDashboard.reducer,
    [RealsData.reducerPath]: RealsData.reducer,
    [realChart_Trends.reducerPath]: realChart_Trends.reducer,
    [unitDashboard.reducerPath]: unitDashboard.reducer,
    [unitDataApi.reducerPath]: unitDataApi.reducer,
    [performanceChart.reducerPath]: performanceChart.reducer,
    [popupSlides.reducerPath]: popupSlides.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      projectDashboard.middleware,
      projectData.middleware,
      projectChartApi.middleware,
      engagement_Trends.middleware,
      realsDashboard.middleware,
      RealsData.middleware,
      realChart_Trends.middleware,
      unitDashboard.middleware,
      unitDataApi.middleware,
      performanceChart.middleware,
      popupSlides.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
