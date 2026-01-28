'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { InfoTooltip } from '../ui/info-tooltip'
import { Checkbox } from '../ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useGetRealsDashboardQuery } from '@/services/reals/realDashboard'
import { useGetrealChart_TrendsQuery } from '@/services/reals/realsChart'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { DateContext } from '@/hook/context'
import Image from 'next/image'
import nothing from '@/assets/paper.png'
interface RealsSectionProps {
  // dateRange?: { from: Date; to: Date }
  readonly expanded?: boolean
  readonly overview?: boolean
  readonly chartOnly?: boolean
  // selectedItems?: number[]
}
interface ProjectChar2item {
  _id: string
  value: number
}

export function RealsSection({
  // dateRange,
  expanded = false,
  overview = false,
  chartOnly = false,
  // selectedItems = [],
}: RealsSectionProps) {
  dayjs.extend(duration)
  const [timelineMetric, setTimelineMetric] = useState('views')
  const [showBreakdown, setShowBreakdown] = useState(false)
  const dateContext = useContext(DateContext)
  const {
    data: dashboard,
    isLoading,
    isFetching: dashLoading,
  } = useGetRealsDashboardQuery({
    startDate: dateContext?.date?.startDate ?? undefined,
    endDate: dateContext?.date?.endDate ?? undefined,
  })
  const {
    data: trednsData,
    isLoading: trednsLoading,
    isFetching,
  } = useGetrealChart_TrendsQuery({
    metrics: timelineMetric,
    breakdown: showBreakdown,
    startDate: dateContext?.date?.startDate ?? undefined,
    endDate: dateContext?.date?.endDate ?? undefined,
  })

  // Mock data - in real app this would come from API based on dateRange
  const [chartDatas, setChartDatas] = useState<
    { date: string; value: number }[]
  >([])

  useEffect(() => {
    if (trednsData?.data) {
      const formatted = trednsData.data.map((item: ProjectChar2item) => ({
        date: `${item._id}T00:00:00Z`,
        value: item.value,
      }))
      setChartDatas(formatted)
    }
  }, [trednsData])
  useEffect(() => {
    if (!trednsData?.data) return

    if (!showBreakdown) {
      const formatted = trednsData.data.map(item => ({
        date: `${item._id}T00:00:00Z`,
        value: item.value,
      }))
      setChartDatas(formatted)
    } else {
      const formatted = trednsData.data.map(item => ({
        ...item,
        date: `${item.date}T00:00:00Z`,
      }))
      setChartDatas(formatted)
    }
  }, [trednsData, showBreakdown])
  const keys = useMemo(() => {
    if (!showBreakdown || chartDatas.length === 0) return []
    return Object.keys(chartDatas[0]).filter(k => k !== 'date')
  }, [chartDatas, showBreakdown])
  const avgtime = ((dashboard?.data.avgTimePerUser ?? 0) / 60).toFixed(2)

  const timelineLabels = {
    reals_created: 'REALS Created',
    reals_opened: 'REALS Opened',
    unique_users: 'Unique Users',
    views: 'Views',
  }

  const tooltipTexts = {
    totalCreated:
      'Total number of REALS created across all projects and creators.',
    totalOpened:
      'Number and percentage of created REALS that have been opened by at least one user.',
    uniqueUsers:
      'Total number of distinct users who have interacted with REALS.',
    totalVisits: 'Total number of page visits across all REALS.',
    avgTimePerUser: 'Average time spent per user session across all REALS.',
    avgSlidesRetention: 'Average percentage of slides viewed per REAL session.',
    avgTimeRetention:
      'Average percentage of total REAL duration viewed per session.',
  }

  // const formatTime = (hours: number) => {
  //   if (hours < 1) {
  //     return `${Math.round(hours * 60)}m`
  //   }
  //   return `${Math.round(hours)}h ${Math.round((hours % 1) * 60)}m`
  // }

  const formatValue = (value: number) => {
    return value.toLocaleString()
  }

  const chartColors = [
    '#142832', // darker deep teal
    '#8ee6b5', // brighter mint highlight
    '#4fb8a4', // darker aqua green
    '#fff28a', // stronger highlight yellow
    '#9e94d6', // darker pastel purple highlight
  ]

  if (overview) {
    return (
      <Card className='bg-white border-gray-200'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
              Total REALS
            </CardTitle>
            <InfoTooltip content={tooltipTexts.totalCreated} />
          </div>
        </CardHeader>
        <CardContent className='pt-2'>
          <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
            {isLoading ? (
              <div className='skeleton-number'></div>
            ) : (
              (dashboard?.data.realsCount ?? 0)
            )}
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            {isLoading ? (
              <div
                className='skeleton-number'
                style={{ width: '60px', height: '10px' }}
              ></div>
            ) : (
              (dashboard?.data.avgOpenRate ?? 0) + '  % open rate'
            )}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Chart only mode - timeline chart
  if (chartOnly) {
    return (
      <Card className='bg-white border-gray-200'>
        <CardHeader className='pb-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <div>
                <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                  REALS Usage
                </CardTitle>
                <CardDescription className='text-xs text-gray-600'>
                  Timeline trends
                </CardDescription>
              </div>
              <InfoTooltip
                content={`Shows ${
                  timelineLabels[timelineMetric as keyof typeof timelineLabels]
                } trends over time${
                  showBreakdown ? ' with breakdown by top 5 creators' : ''
                }.`}
              />
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='breakdownsm'
                  checked={showBreakdown}
                  onCheckedChange={checked =>
                    setShowBreakdown(checked === true)
                  }
                />
                <label htmlFor='breakdownsm' className='text-xs text-gray-600'>
                  Breakdown
                </label>
              </div>
              <Select value={timelineMetric} onValueChange={setTimelineMetric}>
                <SelectTrigger className='w-full sm:w-32 h-8 text-xs bg-white border-gray-300'>
                  <SelectValue placeholder='Metric' />
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-300'>
                  <SelectItem value='reals_created'>Created</SelectItem>
                  <SelectItem value='reals_opened'>Opened</SelectItem>
                  <SelectItem value='unique_users'>Users</SelectItem>
                  <SelectItem value='views'>Views</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            {(() => {
              // 1️⃣ Loading state
              if (trednsLoading || isFetching) {
                return (
                  <div className='loading-wave'>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                  </div>
                )
              }

              // 2️⃣ Data empty or failed
              if (!trednsData || trednsData.data?.length === 0) {
                return (
                  <div
                    className='flex  flex-col items-center '
                    style={{ justifyContent: 'center', height: '100%' }}
                  >
                    <Image
                      src={nothing}
                      width={100}
                      height={100}
                      alt='Data not found'
                    />
                    <h1>No chart data found</h1>
                  </div>
                )
              }

              // 3️⃣ Render Chart
              return (
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={chartDatas}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />

                    <XAxis
                      dataKey='date'
                      className='text-xs'
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      tickFormatter={value =>
                        new Date(value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                    />

                    <YAxis
                      className='text-xs'
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                    />

                    <Tooltip
                      formatter={(
                        value: number | undefined,
                        name: string | undefined
                      ) => [
                        formatValue(value || 0),
                        showBreakdown
                          ? name
                          : timelineLabels[
                              timelineMetric as keyof typeof timelineLabels
                            ],
                      ]}
                      labelFormatter={label =>
                        new Date(label).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      }
                      labelStyle={{ color: '#203d4d' }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                      }}
                    />

                    {showBreakdown && (
                      <Legend
                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                        iconType='line'
                      />
                    )}

                    {showBreakdown ? (
                      keys.map((key, index) => (
                        <Line
                          key={key}
                          type='monotone'
                          dataKey={key}
                          strokeWidth={2}
                          dot={{
                            fill: chartColors[index],
                            strokeWidth: 2,
                            r: 2,
                          }}
                          activeDot={{ r: 6, fill: chartColors[index] }}
                          stroke={chartColors[index]}
                        />
                      ))
                    ) : (
                      <Line
                        type='monotone'
                        dataKey='value'
                        stroke='#203d4d'
                        strokeWidth={2}
                        dot={{
                          fill: '#c0f4d1',
                          stroke: '#203d4d',
                          strokeWidth: 2,
                          r: 3,
                        }}
                        activeDot={{ r: 4, fill: '#203d4d' }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              )
            })()}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Standard and expanded modes with horizontal cards
  return (
    <div className='space-y-4'>
      {!expanded && !overview && !chartOnly && (
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold' style={{ color: '#203d4d' }}>
            REALS
          </h2>
        </div>
      )}

      {/* Horizontal cards layout */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <Card className='bg-white border-gray-200'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                Total REALS Created
              </CardTitle>
              <InfoTooltip content={tooltipTexts.totalCreated} />
            </div>
            <CardDescription className='text-gray-600 text-xs'>
              All created REALS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
              {isLoading || dashLoading ? (
                <div className='skeleton-number'></div>
              ) : (
                (dashboard?.data.realsCount ?? 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='bg-white border-gray-200'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                Total REALS Opened
              </CardTitle>
              <InfoTooltip content={tooltipTexts.totalOpened} />
            </div>
            <CardDescription className='text-gray-600 text-xs'>
              {isLoading || dashLoading ? (
                <div
                  className='skeleton-number'
                  style={{ width: '60px', height: '10px' }}
                ></div>
              ) : (
                (dashboard?.data.avgOpenRate ?? 0) + '  % open rate'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
              {isLoading || dashLoading ? (
                <div className='skeleton-number'></div>
              ) : (
                (dashboard?.data.totalRealsOpened ?? 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='bg-white border-gray-200'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                Unique Users
              </CardTitle>
              <InfoTooltip content={tooltipTexts.uniqueUsers} />
            </div>
            <CardDescription className='text-gray-600 text-xs'>
              Distinct visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
              {isLoading || dashLoading ? (
                <div className='skeleton-number'></div>
              ) : (
                (dashboard?.data.distinctVisitors ?? 0)
              )}
            </div>
          </CardContent>
        </Card>

        {expanded && (
          <>
            <Card className='bg-white border-gray-200'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                    Total Visits
                  </CardTitle>
                  <InfoTooltip content={tooltipTexts.totalVisits} />
                </div>
                <CardDescription className='text-gray-600 text-xs'>
                  Page visits count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className='text-2xl font-bold'
                  style={{ color: '#203d4d' }}
                >
                  {isLoading || dashLoading ? (
                    <div className='skeleton-number'></div>
                  ) : (
                    (dashboard?.data.totalVisits ?? 0)
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white border-gray-200'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                    Avg Time per User
                  </CardTitle>
                  <InfoTooltip content={tooltipTexts.avgTimePerUser} />
                </div>
                <CardDescription className='text-gray-600 text-xs'>
                  Per user session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className='text-2xl font-bold'
                  style={{ color: '#203d4d' }}
                >
                  {isLoading || dashLoading ? (
                    <div className='skeleton-number'></div>
                  ) : (
                    <div>{avgtime} min</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white border-gray-200'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                    Avg Slides Retention
                  </CardTitle>
                  <InfoTooltip content={tooltipTexts.avgSlidesRetention} />
                </div>
                <CardDescription className='text-gray-600 text-xs'>
                  Completion rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className='text-2xl font-bold'
                  style={{ color: '#203d4d' }}
                >
                  {isLoading || dashLoading ? (
                    <div className='skeleton-number'></div>
                  ) : (
                    (dashboard?.data.slidesRetention ?? 0) + '%'
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white border-gray-200'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                    Avg Time Retention
                  </CardTitle>
                  <InfoTooltip content={tooltipTexts.avgTimeRetention} />
                </div>
                <CardDescription className='text-gray-600 text-xs'>
                  Time completion rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className='text-2xl font-bold'
                  style={{ color: '#203d4d' }}
                >
                  <div
                    className='text-2xl font-bold'
                    style={{ color: '#203d4d' }}
                  >
                    {isLoading || dashLoading ? (
                      <div className='skeleton-number'></div>
                    ) : (
                      (dashboard?.data.avgTimeRetention ?? 0) + '%'
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {expanded && (
        <Card className='bg-white border-gray-200'>
          <CardHeader className='pb-4'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-center gap-2'>
                <div>
                  <CardTitle style={{ color: '#203d4d' }}>
                    Usage Over Time
                  </CardTitle>
                  <CardDescription className='text-gray-600'>
                    REALS usage trends
                  </CardDescription>
                </div>
                <InfoTooltip
                  content={`Timeline showing ${
                    timelineLabels[
                      timelineMetric as keyof typeof timelineLabels
                    ]
                  } trends${
                    showBreakdown
                      ? ' with breakdown by top 5 creators'
                      : ' for all REALS'
                  }.`}
                />
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='breakdown-expanded'
                    checked={showBreakdown}
                    onCheckedChange={checked =>
                      setShowBreakdown(checked === true)
                    }
                  />
                  <label
                    htmlFor='breakdown-expanded'
                    className='text-sm text-gray-600'
                  >
                    Breakdown by Creators
                  </label>
                </div>
                <Select
                  value={timelineMetric}
                  onValueChange={setTimelineMetric}
                >
                  <SelectTrigger className='w-full md:w-48 bg-white border-gray-300'>
                    <SelectValue placeholder='Select metric' />
                  </SelectTrigger>
                  <SelectContent className='bg-white border-gray-300'>
                    <SelectItem value='reals_created'>REALS Created</SelectItem>
                    <SelectItem value='reals_opened'>REALS Opened</SelectItem>
                    <SelectItem value='unique_users'>Unique Users</SelectItem>
                    <SelectItem value='views'>Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              {(() => {
                // 1. Loading
                if (trednsLoading || isFetching) {
                  return (
                    <div className='loading-wave'>
                      <div className='loading-bar'></div>
                      <div className='loading-bar'></div>
                      <div className='loading-bar'></div>
                      <div className='loading-bar'></div>
                    </div>
                  )
                }

                // 2. No data / failed
                if (!trednsData || trednsData.data.length === 0) {
                  return (
                    <div
                      className='flex  flex-col items-center '
                      style={{ justifyContent: 'center', height: '100%' }}
                    >
                      <Image
                        src={nothing}
                        width={100}
                        height={100}
                        alt='Data not found'
                      />
                      <h1>No chart data found</h1>
                    </div>
                  )
                }

                // 3. Success
                return (
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                      data={chartDatas}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />

                      <XAxis
                        dataKey='date'
                        className='text-xs'
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={value =>
                          new Date(value).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        }
                      />

                      <YAxis
                        className='text-xs'
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />

                      <Tooltip
                        formatter={(
                          value: number | undefined,
                          name: string | undefined
                        ) => [
                          formatValue(value || 0),
                          showBreakdown
                            ? name
                            : timelineLabels[
                                timelineMetric as keyof typeof timelineLabels
                              ],
                        ]}
                        labelFormatter={label =>
                          new Date(label).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        }
                        labelStyle={{ color: '#203d4d' }}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      />

                      {showBreakdown && (
                        <Legend
                          wrapperStyle={{
                            fontSize: '10px',
                            paddingTop: '10px',
                          }}
                          iconType='line'
                        />
                      )}

                      {showBreakdown ? (
                        keys.map((key, index) => (
                          <Line
                            key={key}
                            type='monotone'
                            dataKey={key}
                            strokeWidth={2}
                            dot={{
                              fill: chartColors[index],
                              strokeWidth: 2,
                              r: 2,
                            }}
                            activeDot={{ r: 6, fill: chartColors[index] }}
                            stroke={chartColors[index]}
                          />
                        ))
                      ) : (
                        <Line
                          type='monotone'
                          dataKey='value'
                          stroke='#203d4d'
                          strokeWidth={2}
                          dot={{
                            fill: '#c0f4d1',
                            stroke: '#203d4d',
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{ r: 6, fill: '#203d4d' }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
