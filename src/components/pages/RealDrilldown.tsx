import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps as RechartsTooltipProps,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useGetpopupSlidesQuery } from '@/services/reals/popupslides'
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent'

interface RealDrilldownProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  realId: string
  realName: string
}
interface SlideData {
  slideName: string
  timeSpent: number
  numberOfPauses: number
}

export function RealDrilldown({
  open,
  onOpenChange,
  realId,
  realName,
}: RealDrilldownProps) {
  // Transform data for the chart

  const [slides, setSlides] = useState<SlideData[]>([])
  const { data, isFetching, isLoading } = useGetpopupSlidesQuery({ realId })
  const chartData = slides.map(slide => ({
    name: slide?.slideName,
    timeSpent: Math.round((slide?.timeSpent / 60) * 10) / 10, // Convert to minutes with 1 decimal
  }))

  // Format seconds to readable time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  useEffect(() => {
    if (data?.result) {
      setSlides(data.result) // ✅ Correct value
    }
    if (open === false) {
      setSlides([]) // drawer/modal closed → clear slides
    }
  }, [open, data])

  // Custom tooltip for chart
  type CustomRechartsTooltipProps = RechartsTooltipProps<
    ValueType,
    NameType
  > & {
    payload?: Array<{
      payload: { name: string; timeSpent?: number }
      value?: number | null
    }>
  }

  const CustomTooltip: React.FC<CustomRechartsTooltipProps> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload as {
        name: string
        timeSpent?: number
      }

      return (
        <div className='bg-white p-3 border border-gray-300 rounded shadow-lg'>
          <p className='font-medium' style={{ color: '#203d4d' }}>
            {data.name}
          </p>

          <p className='text-sm' style={{ color: '#c0f4d1' }}>
            Time Spent: {payload[0].value} min
          </p>
        </div>
      )
    }

    return null
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='!max-w-[95vw] max-h-[90vh] w-full sm:!max-w-[95vw]'
        style={{ overflow: 'auto' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#203d4d' }}>
            Real Drilldown: {realName}
          </DialogTitle>
        </DialogHeader>

        {isLoading || isFetching ? (
          <span className='loader'></span>
        ) : (
          <div className='space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2'>
            {/* Chart Section */}
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <h3 className='font-medium mb-4' style={{ color: '#203d4d' }}>
                Time Spent per Slide
              </h3>
              <ResponsiveContainer width='100%' height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                  <XAxis
                    dataKey='name'
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    angle={-90}
                    textAnchor='end'
                    height={120}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    label={{
                      value: 'Minutes',
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#6b7280',
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType='rect'
                  />
                  <Bar
                    dataKey='timeSpent'
                    fill='#c0f4d1'
                    name='Time Spent (min)'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table Section */}
            <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
              <div className='p-4 border-b border-gray-200'>
                <h3 className='font-medium' style={{ color: '#203d4d' }}>
                  Slide Details
                </h3>
              </div>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-gray-200'>
                      <TableHead
                        className='min-w-32'
                        style={{ color: '#203d4d' }}
                      >
                        Slide
                      </TableHead>
                      <TableHead
                        className='text-right'
                        style={{ color: '#203d4d' }}
                      >
                        Time Spent
                      </TableHead>
                      <TableHead
                        className='text-right'
                        style={{ color: '#203d4d' }}
                      >
                        Time Paused
                      </TableHead>
                      <TableHead
                        className='text-right'
                        style={{ color: '#203d4d' }}
                      >
                        # of Pauses
                      </TableHead>
                      <TableHead
                        className='text-right'
                        style={{ color: '#203d4d' }}
                      >
                        Drawer Opens
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slides.map(slide => (
                      <TableRow
                        key={slide.slideName}
                        className='border-gray-200'
                      >
                        <TableCell
                          className='font-medium'
                          style={{ color: '#203d4d' }}
                        >
                          {slide.slideName}
                        </TableCell>
                        <TableCell className='text-right text-gray-700'>
                          {formatTime(slide.timeSpent)}
                        </TableCell>
                        <TableCell className='text-right text-gray-700'>
                          {/* {formatTime(slide.timePaused)} */}-
                        </TableCell>
                        <TableCell className='text-right text-gray-700'>
                          {slide.numberOfPauses}
                        </TableCell>
                        <TableCell className='text-right text-gray-700'>
                          {/* {slide.drawerOpensCount} */}-
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Total row */}
                    <TableRow className='border-gray-200 bg-gray-50 font-medium'>
                      <TableCell
                        className='font-bold'
                        style={{ color: '#203d4d' }}
                      >
                        TOTAL
                      </TableCell>
                      <TableCell className='text-right font-bold'>
                        {formatTime(
                          slides.reduce(
                            (sum, slide) => sum + slide.timeSpent,
                            0
                          )
                        )}
                      </TableCell>
                      <TableCell className='text-right font-bold'>
                        {/* {formatTime(
                          slides.reduce(
                            (sum, slide) => sum + slide.timePaused,
                            0
                          )
                        )} */}
                      </TableCell>
                      <TableCell className='text-right font-bold'>
                        {slides.reduce(
                          (sum, slide) => sum + slide.numberOfPauses,
                          0
                        )}
                      </TableCell>
                      <TableCell className='text-right font-bold'>
                        {/* {slides.reduce(
                          (sum, slide) => sum + slide.drawerOpensCount,
                          0
                        )} */}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
