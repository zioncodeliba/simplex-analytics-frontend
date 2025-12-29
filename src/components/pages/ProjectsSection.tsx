'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
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
import duration from 'dayjs/plugin/duration'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { useGetDashboardQuery } from '@/services/projectDashboard'
import { useGetProjectChartQuery } from '@/services/projectChart'
import { useGetEngagement_TrendsQuery } from '@/services/projectengagement_Trends'
import dayjs from 'dayjs'
import { DateContext } from '@/hook/context'
import Image from 'next/image'
import nothing from '@/assets/paper.png'
interface ProjectsSectionProps {
  //  readonly  dateRange?: { from: Date; to: Date }
  readonly expanded?: boolean
  readonly overview?: boolean
  readonly chartOnly?: boolean
  // selectedItems?: number[]
}
interface ProjectChartItem {
  projectName: string
  value: number
}
interface ProjectChar2item {
  _id: string
  value: number
}
interface ProjectChar3item {
  date: string
  [key: string]: number | string
}
export function ProjectsSection({
  // dateRange,
  expanded = false,
  overview = false,
  chartOnly = false,
  // selectedItems = [],
}: ProjectsSectionProps) {
  const [chartMetric, setChartMetric] = useState('reals_count')
  const [timelineMetric, setTimelineMetric] = useState('open_rate')
  const [showBreakdown, setShowBreakdown] = useState(false)
  const dateContext = useContext(DateContext)
  const {
    data,
    isLoading,
    isFetching: dashLoading,
  } = useGetDashboardQuery({
    startDate: dateContext?.date?.startDate ?? undefined,
    endDate: dateContext?.date?.endDate ?? undefined,
  })

  const {
    data: projectChart,
    isLoading: chartLoading,
    isFetching,
  } = useGetProjectChartQuery({
    metrics: chartMetric,
    startDate: dateContext?.date?.startDate ?? undefined,
    endDate: dateContext?.date?.endDate ?? undefined,
  })
  const {
    data: trendsChart,
    isLoading: engagementLoading,
    isFetching: engagementfetching,
  } = useGetEngagement_TrendsQuery({
    metrics: timelineMetric,
    breakdown: showBreakdown,
    startDate: dateContext?.date?.startDate,
    endDate: dateContext?.date?.endDate,
  })

  const [chartDatas, setChartDatas] = useState([])

  useEffect(() => {
    if (!trendsChart?.data) return

    if (!showBreakdown) {
      // --- Normal (no breakdown)
      const formatted = trendsChart.data.map((item: ProjectChar2item) => ({
        date: `${item._id}T00:00:00Z`,
        value: item.value,
      }))
      setChartDatas(formatted)
    } else {
      // --- Breakdown mode (keep full object)
      const formatted = trendsChart.data.map((item: ProjectChar3item) => ({
        ...item,
        date: `${item.date}T00:00:00Z`,
      }))
      setChartDatas(formatted)
    }
  }, [trendsChart, showBreakdown])
  const keys = useMemo(() => {
    if (!showBreakdown || chartDatas.length === 0) return []
    return Object.keys(chartDatas[0]).filter(k => k !== 'date')
  }, [chartDatas, showBreakdown])
  // Mock data - in real app this would come from API

  dayjs.extend(duration)
  const chartData = projectChart?.data?.map((item: ProjectChartItem) => ({
    name: item.projectName,
    value:
      chartMetric == 'avg_time'
        ? `${Math.round(dayjs.duration(item.value, 'seconds').asMinutes())} `
        : item.value,
  }))
  const metricLabels = {
    reals_count: 'REALS Count',
    open_rate: 'Open Rate (%)',
    visits: 'Visits',
    avg_time: 'Avg Time Spent (min)',
  }

  const timelineLabels = {
    open_rate: 'Open Rate (%)',
    visits: 'Visits',
  }

  const tooltipTexts = {
    totalProjects:
      'Total number of active projects in the system that have at least one REAL created.',
    reals_count:
      'Total number of REALS created for this project across all units and creators.',
    open_rate:
      'Percentage of created REALS that have been opened by at least one user.',
    visits: 'Total number of page visits across all REALS in this project.',
    avg_time:
      'Average time spent per user session viewing REALS in this project.',
  }

  // Overview mode - just the key metric card
  if (overview) {
    return (
      <Card className='bg-white border-gray-200'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
              Total Projects
            </CardTitle>
            <InfoTooltip content={tooltipTexts.totalProjects} />
          </div>
        </CardHeader>
        <CardContent className='pt-2'>
          <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
            {isLoading || dashLoading ? (
              <div className='skeleton-number'></div>
            ) : (
              data?.data.totalProjects
            )}
          </div>
          <p className='text-xs text-gray-500 mt-1'>Active projects</p>
        </CardContent>
      </Card>
    )
  }
  const chartColors = [
    '#142832', // darker deep teal
    '#8ee6b5', // brighter mint highlight
    '#4fb8a4', // darker aqua green
    '#fff28a', // stronger highlight yellow
    '#9e94d6', // darker pastel purple highlight
  ]

  // Chart only mode - timeline chart
  if (chartOnly) {
    return (
      <Card className='bg-white border-gray-200'>
        <CardHeader className='pb-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <div>
                <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                  Projects Engagement
                </CardTitle>
                <CardDescription className='text-xs text-gray-600'>
                  Timeline trends
                </CardDescription>
              </div>
              <InfoTooltip
                content={`Shows ${
                  timelineLabels[timelineMetric as keyof typeof timelineLabels]
                } trends over time for all projects${
                  showBreakdown ? ' with breakdown by top 5 projects' : ''
                }.`}
              />
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='breakdown'
                  checked={showBreakdown}
                  onCheckedChange={checked =>
                    setShowBreakdown(checked === true)
                  }
                />
                <label htmlFor='breakdown' className='text-xs text-gray-600'>
                  Breakdown
                </label>
              </div>
              <Select value={timelineMetric} onValueChange={setTimelineMetric}>
                <SelectTrigger className='w-full sm:w-32 h-8 text-xs bg-white border-gray-300'>
                  <SelectValue placeholder='Metric' />
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-300'>
                  <SelectItem value='open_rate'>Open Rate</SelectItem>
                  <SelectItem value='visits'>Visits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            {(() => {
              if (engagementfetching || engagementLoading) {
                return (
                  <div className='loading-wave'>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                  </div>
                )
              }

              if (trendsChart?.data && trendsChart.data.length !== 0) {
                return (
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                      data={chartDatas}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />
                      <XAxis
                        dataKey='date'
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={value =>
                          new Date(value).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        }
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip
                        labelFormatter={label =>
                          new Date(label).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        }
                        formatter={(value, name) => {
                          // name = key of the line, e.g., project name or 'All Projects'
                          return [`${value}`, name]
                        }}
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
                            r: 3,
                          }}
                          activeDot={{ r: 4, fill: '#203d4d' }}
                        />
                      )}
                    </LineChart>
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

  // Standard and expanded modes with horizontal cards
  return (
    <div className='space-y-4'>
      {!expanded && (
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold' style={{ color: '#203d4d' }}>
            Projects
          </h2>
        </div>
      )}

      {/* Horizontal cards layout for expanded mode */}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <Card className='bg-white border-gray-200'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                Total Projects
              </CardTitle>
              <InfoTooltip content={tooltipTexts.totalProjects} />
            </div>
            <CardDescription className='text-gray-600 text-xs'>
              Active projects count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
              {isLoading || dashLoading ? (
                <div className='skeleton-number'></div>
              ) : (
                (data?.data.totalProjects ?? 0)
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
                    Total REALS
                  </CardTitle>
                  <InfoTooltip content='Total number of REALS created across all projects.' />
                </div>
                <CardDescription className='text-gray-600 text-xs'>
                  All project REALS
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
                    (data?.data.totalReals ?? 0)
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white border-gray-200'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                    Avg Open Rate
                  </CardTitle>
                  <InfoTooltip content='Average percentage of REALS that have been opened across all projects.' />
                </div>
                <CardDescription className='text-gray-600 text-xs'>
                  Across all projects
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
                    <div>{(data?.data.avgOpenRate ?? 0) + '%'}</div>
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
                  <InfoTooltip content='Average time spent per user session across all project REALS.' />
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
                    <div>{(data?.data.avgSessionDuration ?? 0) + ' min'}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card className='bg-white border-gray-200'>
        <CardHeader className='pb-4'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <div>
                <CardTitle style={{ color: '#203d4d' }}>
                  Top 5 Projects
                </CardTitle>
                <CardDescription className='text-gray-600'>
                  Performance by selected metric
                </CardDescription>
              </div>
              <InfoTooltip
                content={`Ranking of top 5 projects by ${
                  metricLabels[chartMetric as keyof typeof metricLabels]
                }.`}
              />
            </div>
            <Select value={chartMetric} onValueChange={setChartMetric}>
              <SelectTrigger className='w-full md:w-48 bg-white border-gray-300'>
                <SelectValue placeholder='Select metric' />
              </SelectTrigger>
              <SelectContent className='bg-white border-gray-300'>
                <SelectItem value='reals_count'>REALS Count</SelectItem>
                <SelectItem value='open_rate'>REALS Open Rate</SelectItem>
                <SelectItem value='visits'>REALS Visits</SelectItem>
                <SelectItem value='avg_time'>Avg Time Spent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            {(() => {
              if (chartLoading || isFetching) {
                return (
                  <div className='loading-wave'>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                    <div className='loading-bar'></div>
                  </div>
                )
              }

              if (!projectChart || projectChart.length === 0) {
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
              }

              return (
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />
                    <XAxis
                      dataKey='name'
                      className='text-xs'
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      interval={0}
                      angle={-45}
                      textAnchor='end'
                      height={80}
                    />
                    <YAxis
                      className='text-xs'
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `${chartMetric === 'avg_time' ? value + 'Min' : value}`,
                        chartMetric,
                      ]}
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
            })()}
          </div>
        </CardContent>
      </Card>

      {expanded && (
        <Card className='bg-white border-gray-200'>
          <CardHeader className='pb-4'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-center gap-2'>
                <div>
                  <CardTitle style={{ color: '#203d4d' }}>
                    Engagement Over Time
                  </CardTitle>
                  <CardDescription className='text-gray-600'>
                    Project engagement trends
                  </CardDescription>
                </div>
                <InfoTooltip
                  content={`Timeline showing ${
                    timelineLabels[
                      timelineMetric as keyof typeof timelineLabels
                    ]
                  } trends${
                    showBreakdown
                      ? ' with breakdown by top 5 projects'
                      : ' for all projects'
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
                    Breakdown by Projects
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
                    <SelectItem value='open_rate'>REALS Open Rate</SelectItem>
                    <SelectItem value='visits'>REALS Visits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              {(() => {
                if (engagementfetching || engagementLoading) {
                  return (
                    <div className='loading-wave'>
                      <div className='loading-bar'></div>
                      <div className='loading-bar'></div>
                      <div className='loading-bar'></div>
                      <div className='loading-bar'></div>
                    </div>
                  )
                }

                if (!trendsChart || trendsChart.length === 0) {
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
                }

                return (
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                      data={chartDatas}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />
                      <XAxis
                        dataKey='date'
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={value =>
                          new Date(value).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        }
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip
                        labelFormatter={label =>
                          new Date(label).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        }
                        formatter={(value, name) => {
                          // name = key of the line, e.g., project name or 'All Projects'
                          return [`${value}`, name]
                        }}
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
      )}
    </div>
  )
}
