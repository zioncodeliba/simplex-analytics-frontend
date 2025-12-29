'use client'
import React, { useContext, useEffect, useState } from 'react'

import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { ChevronDown, Download, Search, Settings } from 'lucide-react'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import duration from 'dayjs/plugin/duration'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import nothing from '@/assets/paper.png'
import { Badge } from '../ui/badge'
import { CustomPagination } from '../CustomPagination'
import { useGetUnitDataQuery } from '@/services/units/unitData'
import dayjs from 'dayjs'
import { useDebounce } from '@/hook/useDebounce'
import { DateContext } from '@/hook/context'
import Image from 'next/image'

// interface UnitsTableProps {
//   dateRange?: { from: Date; to: Date }
// }

export function UnitsTable() {
  const [sortField, setSortField] = useState('name')
  const [searchname, setSearchname] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    availability: true,
    realsCount: true,
    slideViews: true,
    uniqueUsers: true,
    totalTime: true,
    avgTime: true,
    firstSeen: true,
    lastSeen: true,
    seenCount: true,
  })
  const debouncedSearch = useDebounce(searchname, 500)
  const dateContext = useContext(DateContext)
  const { data, isFetching, isLoading, isError } = useGetUnitDataQuery({
    page,
    limit,
    search: debouncedSearch,
    startDate: dateContext?.date?.startDate ?? undefined,
    endDate: dateContext?.date?.endDate ?? undefined,
  })
  const totalPages = Math.ceil((data?.pagination.total ?? 10) / limit)
  useEffect(() => {
    //
  }, [debouncedSearch])
  const unitData = data?.data ?? []
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-white border-gray-300 text-green-700'
      case 'Reserved':
        return 'bg-white border-gray-300 text-orange-600'
      case 'Sold':
        return 'bg-white border-gray-300 text-gray-600'
      default:
        return 'bg-white border-gray-300 text-gray-600'
    }
  }

  const filteredAndSortedData = [...unitData].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]
    const direction = sortDirection === 'asc' ? 1 : -1

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * direction
    }

    return ((aValue as number) - (bValue as number)) * direction
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev],
    }))
  }

  const handleExportCSV = () => {
    const headers = Object.keys(visibleColumns)
      .filter(key => visibleColumns[key as keyof typeof visibleColumns])
      .map(key => {
        switch (key) {
          case 'name':
            return 'Unit Name'
          case 'availability':
            return 'Availability'
          case 'realsCount':
            return 'REALS Count'
          case 'slideViews':
            return 'Slide Views'
          case 'uniqueUsers':
            return 'Unique Users'
          case 'totalTime':
            return 'Total Time'
          case 'avgTime':
            return 'Average Time (min)'
          case 'firstSeen':
            return 'First Seen'
          case 'lastSeen':
            return 'Last Seen'
          case 'seenCount':
            return 'Seen Count'
          default:
            return key
        }
      })

    const csvContent = [
      '\uFEFF', // UTF-8 BOM FIX → avoids corrupted Hebrew/Arabic/Urdu
      headers.join(','),
      ...filteredAndSortedData.map(unit =>
        Object.keys(visibleColumns)
          .filter(key => visibleColumns[key as keyof typeof visibleColumns])
          .map(key => {
            const value = unit[key as keyof typeof unit]
            return typeof value === 'string' ? `"${value}"` : value
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = globalThis.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `units-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    globalThis.URL.revokeObjectURL(url)

    toast.success('CSV file downloaded successfully!')
  }

  dayjs.extend(duration)
  const secondsToHM = (seconds: number): string => {
    const d = dayjs.duration(seconds, 'seconds')

    const hours = Math.floor(d.asHours()) // total hours
    const minutes = d.minutes() // remaining minutes

    return `${hours}h ${minutes}m`
  }
  return (
    <Card className='bg-white border-gray-200'>
      <CardHeader>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <CardTitle style={{ color: '#203d4d' }}>Units Data</CardTitle>
            <CardDescription className='text-gray-600'>
              Performance metrics for all unit types
            </CardDescription>
          </div>
          <div className='flex flex-col md:flex-row gap-2'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search units...'
                value={searchname}
                onChange={e => setSearchname(e.target.value)}
                className='pl-10 w-full md:w-64 bg-white border-gray-300'
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='bg-white border-gray-300'
                  style={{ color: '#203d4d' }}
                >
                  <Settings className='w-4 h-4 mr-2' />
                  Columns
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-56 bg-white border-gray-300'>
                <div className='space-y-2'>
                  <h4
                    className='font-medium leading-none mb-2'
                    style={{ color: '#203d4d' }}
                  >
                    Toggle Columns
                  </h4>
                  {Object.entries(visibleColumns).map(([key, visible]) => (
                    <div key={key} className='flex items-center space-x-2'>
                      <Checkbox
                        id={key}
                        checked={visible}
                        onCheckedChange={() => toggleColumn(key)}
                      />
                      <label
                        htmlFor={key}
                        className='text-sm text-gray-600 capitalize'
                      >
                        {key.replaceAll(/([A-Z])/g, ' $1').trim()}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleExportCSV}
              className='text-white border-0'
              style={{ backgroundColor: '#c0f4d1', color: '#203d4d' }}
            >
              <Download className='w-4 h-4 mr-2' />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-gray-200'>
                {visibleColumns.name && (
                  <TableHead
                    className='min-w-48 cursor-pointer'
                    onClick={() => handleSort('name')}
                    style={{ color: '#203d4d' }}
                  >
                    Unit Name <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.availability && (
                  <TableHead
                    className='min-w-28 cursor-pointer'
                    onClick={() => handleSort('availability')}
                    style={{ color: '#203d4d' }}
                  >
                    Availability <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.realsCount && (
                  <TableHead
                    className='text-right cursor-pointer'
                    onClick={() => handleSort('realsCount')}
                    style={{ color: '#203d4d' }}
                  >
                    REALS Count <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.slideViews && (
                  <TableHead
                    className='text-right cursor-pointer'
                    onClick={() => handleSort('slideViews')}
                    style={{ color: '#203d4d' }}
                  >
                    Slide Views <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.uniqueUsers && (
                  <TableHead
                    className='text-right cursor-pointer'
                    onClick={() => handleSort('uniqueUsers')}
                    style={{ color: '#203d4d' }}
                  >
                    Unique Users <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.totalTime && (
                  <TableHead
                    className='text-right cursor-pointer'
                    onClick={() => handleSort('totalTime')}
                    style={{ color: '#203d4d' }}
                  >
                    Total Time <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.avgTime && (
                  <TableHead
                    className='text-right cursor-pointer'
                    onClick={() => handleSort('avgTime')}
                    style={{ color: '#203d4d' }}
                  >
                    Avg Time (min){' '}
                    <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.firstSeen && (
                  <TableHead
                    className='min-w-36 cursor-pointer'
                    onClick={() => handleSort('firstSeen')}
                    style={{ color: '#203d4d' }}
                  >
                    First Seen <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.lastSeen && (
                  <TableHead
                    className='min-w-36 cursor-pointer'
                    onClick={() => handleSort('lastSeen')}
                    style={{ color: '#203d4d' }}
                  >
                    Last Seen <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.seenCount && (
                  <TableHead
                    className='text-right cursor-pointer'
                    onClick={() => handleSort('seenCount')}
                    style={{ color: '#203d4d' }}
                  >
                    Seen Count <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching
                ? Array.from({ length: 5 }).map(_ => (
                    <TableRow
                      key={`skeleton-${Math.random().toString(36).slice(2)}`}
                      className='border-gray-200'
                    >
                      <TableCell>
                        <div
                          className='skeleton-number'
                          style={{ width: '20px' }}
                        />
                      </TableCell>
                      {visibleColumns.name && (
                        <TableCell>
                          <div
                            className='skeleton-number'
                            style={{ width: '100px' }}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.availability && (
                        <TableCell>
                          <div
                            className='skeleton-number'
                            style={{ width: '70px' }}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.realsCount && (
                        <TableCell className='text-right'>
                          <div
                            className='skeleton-number'
                            style={{ width: '40px' }}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.slideViews && (
                        <TableCell className='text-right'>
                          <div
                            className='skeleton-number'
                            style={{ width: '40px' }}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.uniqueUsers && (
                        <TableCell className='text-right'>
                          <div
                            className='skeleton-number'
                            style={{ width: '40px' }}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.totalTime && (
                        <TableCell className='text-right'>
                          <div
                            className='skeleton-number'
                            style={{ width: '60px' }}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.avgTime && (
                        <TableCell className='text-right'>
                          <div
                            className='skeleton-number'
                            style={{ width: '60px' }}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.firstSeen && (
                        <TableCell>
                          <div
                            className='skeleton-number'
                            style={{ width: '80px' }}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.lastSeen && (
                        <TableCell>
                          <div
                            className='skeleton-number'
                            style={{ width: '80px' }}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.seenCount && (
                        <TableCell>
                          <div
                            className='skeleton-number'
                            style={{ width: '40px' }}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                : filteredAndSortedData.map(unit => (
                    <TableRow key={unit.id} className='border-gray-200'>
                      {visibleColumns.name && (
                        <TableCell
                          className='font-medium'
                          style={{ color: '#203d4d' }}
                        >
                          {unit.name ?? '-'}
                        </TableCell>
                      )}
                      {visibleColumns.availability && (
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={
                              getAvailabilityColor(unit.availability) ?? '-'
                            }
                          >
                            {unit.availability ?? '-'}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.realsCount && (
                        <TableCell className='text-right'>
                          {unit.realsCount ?? '-'}
                        </TableCell>
                      )}
                      {visibleColumns.slideViews && (
                        <TableCell className='text-right'>
                          {unit.slideViews.toLocaleString() ?? '-'}
                        </TableCell>
                      )}
                      {visibleColumns.uniqueUsers && (
                        <TableCell className='text-right'>
                          {unit.uniqueUsers.toLocaleString() ?? '-'}
                        </TableCell>
                      )}
                      {visibleColumns.totalTime && (
                        <TableCell className='text-right'>
                          {secondsToHM(unit.totalTime) ?? '-'}
                        </TableCell>
                      )}
                      {visibleColumns.avgTime && (
                        <TableCell className='text-right'>
                          {((unit.avgTime ?? 0) / 60).toFixed(2)} min
                        </TableCell>
                      )}
                      {visibleColumns.firstSeen && (
                        <TableCell className='text-gray-600 text-sm'>
                          {unit.firstSeen !== null
                            ? dayjs(unit.firstSeen).format('YYYY-MM-DD HH:mm')
                            : 'N/A'}
                        </TableCell>
                      )}
                      {visibleColumns.lastSeen && (
                        <TableCell className='text-gray-600 text-sm'>
                          {unit.firstSeen !== null
                            ? dayjs(unit.lastSeen).format('YYYY-MM-DD HH:mm')
                            : 'N/A'}
                        </TableCell>
                      )}
                      {visibleColumns.seenCount && (
                        <TableCell className='text-right'>
                          {unit.seenCount ?? '-'}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              {(data?.data?.length === 0 || isError) && (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className='text-center text-red-500 py-4'
                  >
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
                      <h1> Failed to load data. Please try again.</h1>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div style={{ margin: '15px 20px ' }}>
          <CustomPagination
            limit={limit}
            setLimit={setLimit}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </CardContent>
    </Card>
  )
}
