'use client'
import React, { useContext, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { InfoTooltip } from '../ui/info-tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useGetunitDashboardQuery } from '@/services/units/unitDashboard'
import {
  UnitPerformanceResponse,
  useGetUnitChartQuery,
} from '@/services/units/performaceChart'
import { DateContext } from '@/hook/context'
import Image from 'next/image'
import nothing from '@/assets/paper.png'
interface UnitsSectionProps {
  // dateRange?: { from: Date; to: Date }
  readonly expanded?: boolean
  readonly overview?: boolean
  readonly chartOnly?: boolean
  // selectedItems?: number[]
}

export function UnitsSection({
  // dateRange,
  expanded = false,
  overview = false,
  chartOnly = false,
  // selectedItems = [],
}: UnitsSectionProps) {
  const [chartMetric, setChartMetric] = useState('reals_count')
  const dateContext = useContext(DateContext)
  const {
    data,
    isLoading,
    isFetching: dashLoading,
  } = useGetunitDashboardQuery({
    startDate: dateContext?.date?.startDate ?? undefined,
    endDate: dateContext?.date?.endDate ?? undefined,
  })
  const {
    data: chartData,
    isLoading: chartLoading,
    isFetching,
    isError,
  } = useGetUnitChartQuery({
    metrics: chartMetric,
    startDate: dateContext?.date?.startDate ?? undefined,
    endDate: dateContext?.date?.endDate ?? undefined,
  }) as {
    data?: UnitPerformanceResponse
    isError: boolean
    isLoading: boolean
    isFetching: boolean
  }
  // Mock data - in real app this would come from API
  const metricLabels = {
    reals_count: 'REALS Count',
    open_rate: 'Open Rate (%)',
    slide_views: 'Slide Views',
    avg_time: 'Avg Time Spent (min)',
  }
  const tooltipTexts = {
    totalInReals:
      'Total number of unique units that have been featured in at least one created REAL.',
    openRate:
      'Percentage of units in REALS that have been viewed by at least one user.',
    avgTimePerUser:
      'Average time spent per user session when viewing units in REALS.',
  }

  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case 'open_rate':
        return `${value}%`
      case 'avg_time':
        return `${value}min`
      default:
        return value.toLocaleString()
    }
  }

  // Overview mode - just the key metric card
  if (overview) {
    return (
      <Card className='bg-white border-gray-200'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
              Total Units
            </CardTitle>
            <InfoTooltip content={tooltipTexts.totalInReals} />
          </div>
        </CardHeader>
        <CardContent className='pt-2'>
          <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
            {isLoading ? (
              <div className='skeleton-number'></div>
            ) : (
              (data?.TotalUnits ?? 0)
            )}
          </div>
          <div className='text-xs text-gray-500 mt-1'>
            {isLoading ? (
              <div
                className='skeleton-number'
                style={{ width: '60px', height: '10px' }}
              ></div>
            ) : (
              <div>{data?.unitOpenRate ?? 0} % open rate</div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Chart only mode - top units chart (removed breakdown)
  if (chartOnly) {
    return (
      <Card className='bg-white border-gray-200'>
        <CardHeader className='pb-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <div>
                <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                  Top Units
                </CardTitle>
                <CardDescription className='text-xs text-gray-600'>
                  Performance metrics
                </CardDescription>
              </div>

              <InfoTooltip
                content={`Ranking of top 5 units by ${
                  metricLabels[chartMetric as keyof typeof metricLabels]
                }.`}
              />
            </div>
            <Select value={chartMetric} onValueChange={setChartMetric}>
              <SelectTrigger className='w-full sm:w-40 h-8 text-xs bg-white border-gray-300'>
                <SelectValue placeholder='Metric' />
              </SelectTrigger>
              <SelectContent className='bg-white border-gray-300'>
                <SelectItem value='reals_count'>REALS</SelectItem>
                <SelectItem value='open_rate'>Open Rate</SelectItem>
                <SelectItem value='slide_views'>Views</SelectItem>
                <SelectItem value='avg_time'>Avg Time Spent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            {(() => {
              if (chartLoading ?? isFetching) {
                return (
                  <div className='loading-wave'>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                  </div>
                )
              }
              if (
                chartData?.data &&
                chartData?.data.length !== 0 &&
                isError === false
              ) {
                return (
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={chartData?.data}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />
                      <XAxis
                        dataKey='unit'
                        className='text-xs'
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        interval={0}
                        angle={-45}
                        textAnchor='end'
                        height={60}
                      />
                      <YAxis
                        className='text-xs'
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                      />
                      <Tooltip
                        formatter={(value: number | undefined) => [
                          formatValue(value || 0, chartMetric),
                          metricLabels[
                            chartMetric as keyof typeof metricLabels
                          ],
                        ]}
                        labelFormatter={(label, payload) => {
                          if (payload && payload[0]) {
                            const data = payload[0].payload
                            return `${data.project} - ${data.unit}`
                          }
                          return label
                        }}
                        labelStyle={{ color: '#203d4d' }}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          fontSize: '12px',
                        }}
                      />
                      <Bar
                        dataKey='value'
                        fill='#c0f4d1'
                        stroke='#203d4d'
                        strokeWidth={1}
                        radius={[2, 2, 0, 0]}
                        className='hover:opacity-80 transition-opacity'
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )
              }

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
                  <h1> No data available.</h1>
                </div>
              )
            })()}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      {!expanded && !overview && !chartOnly && (
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold' style={{ color: '#203d4d' }}>
            Units
          </h2>
        </div>
      )}

      {/* Horizontal cards layout */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <Card className='bg-white border-gray-200'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                Total Units in REALS
              </CardTitle>
              <InfoTooltip content={tooltipTexts.totalInReals} />
            </div>
            <CardDescription className='text-gray-600 text-xs'>
              Units featured in REALS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
              {isLoading || dashLoading ? (
                <div className='skeleton-number'></div>
              ) : (
                (data?.TotalUnits ?? 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='bg-white border-gray-200'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                Units Open Rate
              </CardTitle>
              <InfoTooltip content={tooltipTexts.openRate} />
            </div>
            <CardDescription className='text-gray-600 text-xs'>
              Percentage viewed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
              {isLoading || dashLoading ? (
                <div className='skeleton-number'></div>
              ) : (
                <div> {data?.unitOpenRate ?? 0}%</div>
              )}
            </div>
            <div
              className='text-xs text-gray-500 mt-1'
              style={{ color: '#203d4d' }}
            >
              {isLoading || dashLoading ? (
                <div className='skeleton-number'></div>
              ) : (
                <div> ( {data?.totalunitOpen ?? 0} ) units</div>
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
                    <div>
                      {((data?.avgTimePerUser ?? 0) / 60).toFixed(2)} min
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white border-gray-200'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                    Total Slide Views
                  </CardTitle>
                  <InfoTooltip content='Total number of individual slide views across all unit REALS.' />
                </div>
                <CardDescription className='text-gray-600 text-xs'>
                  All unit slides
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
                    <div> {data?.totalVisits ?? 0}</div>
                  )}
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
                    Top 5 Units
                  </CardTitle>
                  <CardDescription className='text-gray-600'>
                    Performance by selected metric
                  </CardDescription>
                </div>
                <InfoTooltip
                  content={`Ranking of top 5 units by ${
                    metricLabels[chartMetric as keyof typeof metricLabels]
                  }. Unit names include project prefix.`}
                />
              </div>
              <Select value={chartMetric} onValueChange={setChartMetric}>
                <SelectTrigger className='w-full md:w-48 bg-white border-gray-300'>
                  <SelectValue placeholder='Select metric' />
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-300'>
                  <SelectItem value='reals_count'>REALS Count</SelectItem>
                  <SelectItem value='open_rate'>Open Rate</SelectItem>
                  <SelectItem value='slide_views'>Slide Views</SelectItem>
                  <SelectItem value='avg_time'>Avg Time Spent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              {(() => {
                if (chartLoading ?? isFetching) {
                  return (
                    <div className='loading-wave'>
                      <div className='loading-bar'></div>
                      <div className='loading-bar'></div>
                      <div className='loading-bar'></div>
                      <div className='loading-bar'></div>
                    </div>
                  )
                }
                if (
                  chartData?.data &&
                  chartData?.data.length !== 0 &&
                  isError === false
                ) {
                  return (
                    <ResponsiveContainer width='100%' height='100%'>
                      <BarChart
                        data={chartData?.data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />
                        <XAxis
                          dataKey='unit'
                          className='text-xs'
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          interval={0}
                          angle={-45}
                          textAnchor='end'
                          height={100}
                        />
                        <YAxis
                          className='text-xs'
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <Tooltip
                          formatter={(value: number | undefined) => [
                            formatValue(
                              chartMetric === 'avg_time'
                                ? Number(Number(value ?? 0).toFixed(2))
                                : Number(value),
                              chartMetric
                            ),
                            metricLabels[
                              chartMetric as keyof typeof metricLabels
                            ],
                          ]}
                          labelFormatter={(label, payload) => {
                            const data = payload?.[0]?.payload
                            return data
                              ? `${data.project} - ${data.unit}`
                              : label
                          }}
                          labelStyle={{ color: '#203d4d' }}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Bar
                          dataKey='value'
                          fill='#c0f4d1'
                          stroke='#203d4d'
                          strokeWidth={1}
                          radius={[4, 4, 0, 0]}
                          className='hover:opacity-80 transition-opacity'
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )
                }

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
                    <h1> No data available.</h1>
                  </div>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
