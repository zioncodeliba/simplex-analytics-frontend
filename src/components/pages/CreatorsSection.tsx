'use client'
import React, { useState } from 'react'
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface CreatorsSectionProps {
  // readonly dateRange?: { from: Date; to: Date }
  readonly expanded?: boolean
  readonly overview?: boolean
  readonly chartOnly?: boolean
  // readonly selectedItems?: number[]
}

export function CreatorsSection({
  // dateRange,
  expanded = false,
  overview = false,
  chartOnly = false,
  // selectedItems = [],
}: CreatorsSectionProps) {
  const [chartMetric, setChartMetric] = useState('reals_count')
  const [showBreakdown, _] = useState(false)

  // Mock data - in real app this would come from API
  const creatorsData = {
    totalActive: 28,
    avgRealsPerCreator: 44.5,
    totalReals: 1247, // For tooltip calculation
    avgTimePerCreator: 15.7, // changed from total time to avg time per creator
  }

  const topCreatorsData = {
    reals_count: [
      { name: 'Sarah Johnson', value: 87, id: 1 },
      { name: 'Mike Chen', value: 76, id: 2 },
      { name: 'Emma Davis', value: 65, id: 3 },
      { name: 'David Wilson', value: 58, id: 4 },
      { name: 'Lisa Anderson', value: 54, id: 5 },
    ],
    total_visits: [
      { name: 'Sarah Johnson', value: 3247, id: 1 },
      { name: 'Mike Chen', value: 2856, id: 2 },
      { name: 'Emma Davis', value: 2543, id: 3 },
      { name: 'David Wilson', value: 2289, id: 4 },
      { name: 'Lisa Anderson', value: 2156, id: 5 },
    ],
    avg_time: [
      { name: 'Sarah Johnson', value: 18.9, id: 1 },
      { name: 'Mike Chen', value: 16.2, id: 2 },
      { name: 'Emma Davis', value: 14.6, id: 3 },
      { name: 'David Wilson', value: 13.4, id: 4 },
      { name: 'Lisa Anderson', value: 12.9, id: 5 },
    ],
  }

  const metricLabels = {
    reals_count: 'REALS Count',
    total_visits: 'Total Visits',
    avg_time: 'Avg Time Spent (min)',
  }

  const tooltipTexts = {
    totalActive:
      'Number of creators who have created at least one REAL in the selected time period.',
    avgRealsPerCreator: 'Average number of REALS created per active creator.',
    avgTimePerCreator:
      "Average time users spend per creator's REALS across all sessions.",
  }

  const formatValue = (value: number, metric: string) => {
    if (metric === 'avg_time') {
      return `${value}min`
    }

    return value.toLocaleString()
  }

  const chartColors = ['#203d4d', '#c0f4d1', '#8dd3c7', '#ffffb3', '#bebada']

  // Overview mode - just the key metric card
  if (overview) {
    return (
      <Card className='bg-white border-gray-200'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
              Active Creators
            </CardTitle>
            <InfoTooltip content={tooltipTexts.totalActive} />
          </div>
        </CardHeader>
        <CardContent className='pt-2'>
          <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
            {creatorsData.totalActive}
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            {creatorsData.avgRealsPerCreator} avg REALS
          </p>
        </CardContent>
      </Card>
    )
  }

  // Chart only mode - top creators chart
  if (chartOnly) {
    return (
      <Card className='bg-white border-gray-200'>
        <CardHeader className='pb-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <div>
                <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                  Top Creators
                </CardTitle>
                <CardDescription className='text-xs text-gray-600'>
                  Performance metrics
                </CardDescription>
              </div>
              <InfoTooltip
                content={`Ranking of top 5 creators by ${
                  metricLabels[chartMetric as keyof typeof metricLabels]
                }.`}
              />
            </div>
            <div className='flex items-center gap-2'>
              {/* <div className='flex items-center space-x-2'>
                <Checkbox
                  id='breakdown'
                  checked={showBreakdown}
                  // onCheckedChange={setShowBreakdown}
                />
                <label htmlFor='breakdown' className='text-xs text-gray-600'>
                  Breakdown
                </label>
              </div> */}
              <Select value={chartMetric} onValueChange={setChartMetric}>
                <SelectTrigger className='w-full sm:w-32 h-8 text-xs bg-white border-gray-300'>
                  <SelectValue placeholder='Metric' />
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-300'>
                  <SelectItem value='reals_count'>REALS</SelectItem>
                  <SelectItem value='total_visits'>Visits</SelectItem>
                  <SelectItem value='avg_time'>Avg Time Spent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={
                  topCreatorsData[chartMetric as keyof typeof topCreatorsData]
                }
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />
                <XAxis
                  dataKey='name'
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
                    formatValue(value ?? 0, chartMetric),
                    metricLabels[chartMetric as keyof typeof metricLabels],
                  ]}
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
                  />
                )}
                <Bar
                  dataKey='value'
                  fill={showBreakdown ? undefined : '#c0f4d1'}
                  stroke='#203d4d'
                  strokeWidth={1}
                  radius={[2, 2, 0, 0]}
                  className='hover:opacity-80 transition-opacity'
                >
                  {showBreakdown &&
                    topCreatorsData[
                      chartMetric as keyof typeof topCreatorsData
                    ].map((entry, index) => (
                      <Bar key={`cell-${index}`} fill={chartColors[index]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
            Creators
          </h2>
        </div>
      )}

      {/* Horizontal cards layout */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <Card className='bg-white border-gray-200'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                Total Active Creators
              </CardTitle>
              <InfoTooltip content={tooltipTexts.totalActive} />
            </div>
            <CardDescription className='text-gray-600 text-xs'>
              Creators with REALS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
              {creatorsData.totalActive}
            </div>
          </CardContent>
        </Card>

        <Card className='bg-white border-gray-200'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                Avg REALS per Creator
              </CardTitle>
              <InfoTooltip content={tooltipTexts.avgRealsPerCreator} />
            </div>
            <CardDescription className='text-gray-600 text-xs'>
              {creatorsData.totalReals} REALS total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold' style={{ color: '#203d4d' }}>
              {creatorsData.avgRealsPerCreator}
            </div>
          </CardContent>
        </Card>

        {expanded && (
          <>
            <Card className='bg-white border-gray-200'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                    Avg Time per Creator
                  </CardTitle>
                  <InfoTooltip content={tooltipTexts.avgTimePerCreator} />
                </div>
                <CardDescription className='text-gray-600 text-xs'>
                  Per creator average
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className='text-2xl font-bold'
                  style={{ color: '#203d4d' }}
                >
                  {creatorsData.avgTimePerCreator}min
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white border-gray-200'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm' style={{ color: '#203d4d' }}>
                    Total Unique Users
                  </CardTitle>
                  <InfoTooltip content="Total number of unique users who have viewed any creator's REALS." />
                </div>
                <CardDescription className='text-gray-600 text-xs'>
                  Across all creators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className='text-2xl font-bold'
                  style={{ color: '#203d4d' }}
                >
                  3,456
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
                    Top 5 Creators
                  </CardTitle>
                  <CardDescription className='text-gray-600'>
                    Performance by selected metric
                  </CardDescription>
                </div>
                <InfoTooltip
                  content={`Ranking of top 5 creators by ${
                    metricLabels[chartMetric as keyof typeof metricLabels]
                  }.`}
                />
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='breakdown-expanded'
                    checked={showBreakdown}
                    // onCheckedChange={setShowBreakdown}
                  />
                  <label
                    htmlFor='breakdown-expanded'
                    className='text-sm text-gray-600'
                  >
                    Breakdown by Creator
                  </label>
                </div>
                <Select value={chartMetric} onValueChange={setChartMetric}>
                  <SelectTrigger className='w-full md:w-48 bg-white border-gray-300'>
                    <SelectValue placeholder='Select metric' />
                  </SelectTrigger>
                  <SelectContent className='bg-white border-gray-300'>
                    <SelectItem value='reals_count'>REALS Count</SelectItem>
                    <SelectItem value='total_visits'>Total Visits</SelectItem>
                    <SelectItem value='avg_time'>Avg Time Spent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={
                    topCreatorsData[chartMetric as keyof typeof topCreatorsData]
                  }
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
                    formatter={(value: number | undefined) => [
                      formatValue(value ?? 0, chartMetric),
                      metricLabels[chartMetric as keyof typeof metricLabels],
                    ]}
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
                      wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                    />
                  )}
                  <Bar
                    dataKey='value'
                    fill={showBreakdown ? undefined : '#c0f4d1'}
                    stroke='#203d4d'
                    strokeWidth={1}
                    radius={[4, 4, 0, 0]}
                    className='hover:opacity-80 transition-opacity'
                  >
                    {showBreakdown &&
                      topCreatorsData[
                        chartMetric as keyof typeof topCreatorsData
                      ].map((entry, index) => (
                        <Bar key={`cell-${index}`} fill={chartColors[index]} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
