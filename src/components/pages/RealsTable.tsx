'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react'

import {
  Download,
  Copy,
  Search,
  Settings,
  ChevronDown,
  Filter,
  Maximize2,
  Minimize2,
  Eye,
} from 'lucide-react'

import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Checkbox } from '../ui/checkbox'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import dayjs from 'dayjs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { useGetRealsDataQuery } from '@/services/reals/RealsData'
import { CustomPagination } from '../CustomPagination'
import { cn } from '../ui/utils'
import { formatMsToMinSec, useDebounce } from '@/hook/useDebounce'
import { DateContext } from '@/hook/context'
import { RealDrilldown } from './RealDrilldown'
import Image from 'next/image'
import nothing from '@/assets/paper.png'
// import { RealDrilldown } from './RealDrilldown'

interface RealsTableProps {
  // dateRange?: { from: Date; to: Date }
  readonly onSelectionChange?: (selectedIds: string[]) => void
}
interface PopUp {
  realname: string
  real: string
}
type RealRow = {
  realId: string
  realName: string
  project: string
  createdAt: string
  updatedAt: string
  sharingTitle: string
  createdBy: string
  slides: number
  slidesRetention: number | null | undefined
  interactions: number | null | undefined
  totalDuration: number
  avgTimeRetention: number | null | undefined
  visits: number
  uniqUsers: number
  currentUrl: string
  totalTime: string | null | undefined
  avgTime: number | null | undefined
  firstSeen: string
  lastSeen: string
}

interface HeaderControlsProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedCount: number
  columnFilters: Record<string, string>
  handleColumnFilter: (column: string, value: string) => void
  visibleColumns: { [key: string]: boolean }
  toggleColumn: (column: string) => void
  isFullScreen: boolean
  setIsFullScreen: (open: boolean) => void
  clearFilters: () => void
  handleExportCSV: () => void
  tableContent: React.ReactNode
  hasNoReals: boolean
}

const HeaderControls: React.FC<HeaderControlsProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCount,
  columnFilters,
  handleColumnFilter,
  visibleColumns,
  toggleColumn,
  isFullScreen,
  setIsFullScreen,
  clearFilters,
  handleExportCSV,
  tableContent,
  hasNoReals,
}) => (
  <div className='flex flex-col gap-4'>
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
      <div>
        <CardTitle style={{ color: '#203d4d' }}>REALS Data</CardTitle>
        <CardDescription className='text-gray-600'>
          Complete list of created REALS with detailed metrics
          {selectedCount > 0 && ` (${selectedCount} selected)`}
        </CardDescription>
      </div>

      <div className='flex flex-col md:flex-row gap-2'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <input
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={cn(
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10 w-full md:w-64 bg-white border-gray-300'
            )}
            placeholder='Search REALS...'
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='bg-white border-gray-300'
              style={{ color: '#203d4d' }}
            >
              <Filter className='w-4 h-4 mr-2' />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80 bg-white border-gray-300'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h4
                  className='font-medium leading-none'
                  style={{ color: '#203d4d' }}
                >
                  Column Filters
                </h4>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={clearFilters}
                  className='text-xs'
                >
                  Clear All
                </Button>
              </div>
              <Separator />
              <div className='space-y-3 max-h-64 overflow-y-auto'>
                <div>
                  <label
                    htmlFor='project-filter'
                    className='text-sm font-medium text-gray-600'
                  >
                    Project
                  </label>

                  <Input
                    id='project-filter'
                    placeholder='Filter by project...'
                    value={columnFilters.project || ''}
                    onChange={e =>
                      handleColumnFilter('project', e.target.value)
                    }
                    className='mt-1 h-8 text-sm'
                  />
                </div>
                <div>
                  <label
                    htmlFor='created'
                    className='text-sm font-medium text-gray-600'
                  >
                    Created By
                  </label>
                  <Input
                    id='created'
                    placeholder='Filter by creator...'
                    value={columnFilters.createdBy || ''}
                    onChange={e =>
                      handleColumnFilter('createdBy', e.target.value)
                    }
                    className='mt-1 h-8 text-sm'
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
              <div className='space-y-2 max-h-64 overflow-y-auto'>
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
            </div>
          </PopoverContent>
        </Popover>
        <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              className='bg-white border-gray-300'
              style={{ color: '#203d4d' }}
            >
              <Maximize2 className='w-4 h-4 mr-2' />
              Full Screen
            </Button>
          </DialogTrigger>
          <DialogContent
            className='max-w-[95vw] w-full p-0'
            style={{ overflow: 'auto', height: '500px' }}
          >
            <DialogHeader className='p-6 pb-0'>
              <div className='flex items-center justify-between'>
                <DialogTitle style={{ color: '#203d4d' }}>
                  REALS Data - Full Screen
                </DialogTitle>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setIsFullScreen(false)}
                  className='bg-white border-gray-300'
                  style={{ color: '#203d4d' }}
                >
                  <Minimize2 className='w-4 h-4 mr-2' />
                  Exit Full Screen
                </Button>
              </div>
            </DialogHeader>
            <div className='p-6 pt-4 h-full overflow-auto'>
              {tableContent}

              {hasNoReals && (
                <div className='text-center py-8 text-gray-500'>
                  No REALS found matching your search criteria.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
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
  </div>
)

export function RealsTable({ onSelectionChange }: RealsTableProps) {
  const [sortField, setSortField] = useState<keyof RealRow | 'uniqueUsers'>(
    'realName'
  )
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [popupid, setPopupid] = useState<PopUp>()
  const [drilldownOpen, setDrilldownOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    realName: true,
    project: true,
    createdAt: true,
    updatedAt: true,
    sharingTitle: true,
    createdBy: true,
    slides: true,
    slidesRetention: true,
    interactions: true,
    totalDuration: true,
    avgTimeRetention: true,
    visits: true,
    uniqueUsers: true,
    avgTime: true,
    firstSeen: true,
    lastSeen: true,
    actions: true,
  })

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const dateContext = useContext(DateContext)
  const {
    data: RealsDatas,
    isLoading,
    isFetching,
    isError,
  } = useGetRealsDataQuery({
    page,
    limit,
    search: debouncedSearch,
    startDate: dateContext?.date?.startDate ?? undefined,
    endDate: dateContext?.date?.endDate ?? undefined,
  })

  const totalPages = Math.ceil((RealsDatas?.total ?? 10) / limit)
  useEffect(() => {
    //
  }, [debouncedSearch])
  // Map of UI column keys to actual data keys
  const columnAccessorMap: Record<string, keyof RealRow> = {
    realName: 'realName',
    project: 'project',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    sharingTitle: 'sharingTitle',
    createdBy: 'createdBy',
    slides: 'slides',
    slidesRetention: 'slidesRetention',
    interactions: 'interactions',
    totalDuration: 'totalDuration',
    avgTimeRetention: 'avgTimeRetention',
    visits: 'visits',
    uniqueUsers: 'uniqUsers', // UI key -> data key
    avgTime: 'avgTime',
    firstSeen: 'firstSeen',
    lastSeen: 'lastSeen',
  }
  const handleRowClick = (real: string, realname: string) => {
    setPopupid({ real, realname })
    setDrilldownOpen(true)
  }

  const getComparableValue = (
    row: RealRow,
    key: keyof RealRow
  ): string | number => {
    const value = row[key] as unknown
    switch (key) {
      case 'createdAt':
      case 'updatedAt':
      case 'firstSeen':
      case 'lastSeen': {
        const t = dayjs(String(value))
        return t.isValid() ? t.valueOf() : Number.NEGATIVE_INFINITY
      }
      case 'totalDuration':
      case 'slidesRetention':
      case 'interactions':
      case 'avgTimeRetention':
      case 'avgTime':
        return typeof value === 'number' ? value : Number.NEGATIVE_INFINITY
      default:
        return (value as string | number) ?? ''
    }
  }

  const dataRows: RealRow[] = useMemo(
    () => (RealsDatas?.realsData as RealRow[] | undefined) ?? [],
    [RealsDatas]
  )

  // Calculate aggregated "All" row
  const aggregatedData = {
    id: 'all',
    realName: 'ALL REALS',
    project: '-',
    createdAt: '-',
    updatedAt: '-',
    sharingTitle: '-',
    createdBy: '-',
    slides: dataRows.reduce((sum, real) => sum + (real.slides ?? 0), 0),
    slidesRetention:
      dataRows.length > 0
        ? dataRows.reduce((sum, real) => sum + (real.slidesRetention ?? 0), 0) /
          dataRows.length
        : 0,
    interactions:
      dataRows.length > 0
        ? dataRows.reduce((sum, real) => sum + (real.interactions ?? 0), 0) /
          dataRows.length
        : 0,
    totalDuration: '-',
    avgTimeRetention:
      dataRows.length > 0
        ? dataRows.reduce(
            (sum, real) => sum + (real?.avgTimeRetention ?? 0),
            0
          ) / dataRows.length
        : 0,
    visits: dataRows.reduce((sum, real) => sum + (real.visits ?? 0), 0),
    uniqueUsers: dataRows.reduce((sum, real) => sum + (real.uniqUsers ?? 0), 0),
    totalTime: '-',
    avgTime:
      dataRows.length > 0
        ? dataRows.reduce((sum, real) => sum + (real.avgTime ?? 0), 0) /
          dataRows.length
        : 0,
    firstSeen: '-',
    lastSeen: '-',
  }

  const filteredAndSortedData: RealRow[] = useMemo(() => {
    const rows = dataRows
    const filtered = rows.filter(real => {
      // Search filter

      // Column filters
      const columnFiltersMatch = Object.entries(columnFilters).every(
        ([column, filter]) => {
          if (!filter) return true
          const accessor = columnAccessorMap[column] as
            | keyof RealRow
            | undefined
          if (!accessor) return true
          const value = real[accessor]
          if (value == null) return false
          if (typeof value === 'string') {
            return value.toLowerCase().includes(filter.toLowerCase())
          }
          return String(value).includes(filter)
        }
      )

      return columnFiltersMatch
    })

    const accessorKey =
      columnAccessorMap[sortField] ?? (sortField as keyof RealRow)

    const sorted = [...filtered].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1
      const aValue = getComparableValue(a, accessorKey)
      const bValue = getComparableValue(b, accessorKey)

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction
      }
      return ((aValue as number) - (bValue as number)) * direction
    })

    return sorted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRows, columnFilters, sortField, sortDirection])

  const handleSort = (field: string) => {
    const normalizedField = (field as keyof RealRow) || field
    if (sortField === normalizedField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(normalizedField)
      setSortDirection('asc')
    }
  }

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev],
    }))
  }

  const handleRowSelect = (realId: string) => {
    const newSelectedRows = selectedRows.includes(realId)
      ? selectedRows.filter(id => id !== realId)
      : [...selectedRows, realId]

    setSelectedRows(newSelectedRows)
    onSelectionChange?.(newSelectedRows)
  }

  const handleSelectAll = () => {
    const newSelectedRows =
      selectedRows.length === filteredAndSortedData.length
        ? []
        : filteredAndSortedData.map(real => real.realId)
    setSelectedRows(newSelectedRows)
    onSelectionChange?.(newSelectedRows)
  }

  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value,
    }))
  }

  const clearFilters = () => {
    setColumnFilters({})
  }

  const handleCopyLink = (realId: string) => {
    const link = `${realId}`
    navigator.clipboard.writeText(link)
    toast.success('Link copied to clipboard!')
  }

  const handleExportCSV = () => {
    const headers = Object.keys(visibleColumns)
      .filter(
        key =>
          visibleColumns[key as keyof typeof visibleColumns] &&
          key !== 'actions'
      )
      .map(key => {
        switch (key) {
          case 'realName':
            return 'REAL Name'
          case 'project':
            return 'Project'
          case 'createdAt':
            return 'Created At'
          case 'updatedAt':
            return 'Updated At'
          case 'sharingTitle':
            return 'Sharing Title'
          case 'createdBy':
            return 'Created By'
          case 'slides':
            return 'Slides'
          case 'slidesRetention':
            return 'Slides Retention (%)'
          case 'interactions':
            return 'Interactions'
          case 'totalDuration':
            return 'Total Duration'
          case 'avgTimeRetention':
            return 'Time Retention (%)'
          case 'visits':
            return 'Visits'
          case 'uniqueUsers':
            return 'Unique Users'
          case 'avgTime':
            return 'Avg Time (min)'
          case 'firstSeen':
            return 'First Seen'
          case 'lastSeen':
            return 'Last Seen'
          default:
            return key
        }
      })

    const dataToExport =
      selectedRows.length > 0
        ? filteredAndSortedData.filter(real =>
            selectedRows.includes(real.realId)
          )
        : filteredAndSortedData

    const csvContent = [
      '\uFEFF', // BOM FIX
      headers.join(','),
      ...dataToExport.map(real =>
        Object.keys(visibleColumns)
          .filter(
            key =>
              visibleColumns[key as keyof typeof visibleColumns] &&
              key !== 'actions'
          )
          .map(key => {
            const accessor = columnAccessorMap[key]
            const value = real[accessor]
            return typeof value === 'string' ? `"${value}"` : value
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reals-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('CSV file downloaded successfully!')
  }

  // NOSONAR - ignore component inside component warning
  const TableContent = () => (
    <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow className='border-gray-200'>
            <TableHead className='w-12'></TableHead>
            <TableHead className='w-12'>
              <Checkbox
                checked={
                  selectedRows.length === filteredAndSortedData.length &&
                  filteredAndSortedData.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {visibleColumns.realName && (
              <TableHead
                className='min-w-48 cursor-pointer'
                onClick={() => handleSort('realName')}
                style={{ color: '#203d4d' }}
              >
                REAL Name <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.project && (
              <TableHead
                className='min-w-32 cursor-pointer'
                onClick={() => handleSort('project')}
                style={{ color: '#203d4d' }}
              >
                Project <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.createdAt && (
              <TableHead
                className='min-w-36 cursor-pointer'
                onClick={() => handleSort('createdAt')}
                style={{ color: '#203d4d' }}
              >
                Created At <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.updatedAt && (
              <TableHead
                className='min-w-36 cursor-pointer'
                onClick={() => handleSort('updatedAt')}
                style={{ color: '#203d4d' }}
              >
                Updated At <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.sharingTitle && (
              <TableHead
                className='min-w-48 cursor-pointer'
                onClick={() => handleSort('sharingTitle')}
                style={{ color: '#203d4d' }}
              >
                Sharing Title <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.createdBy && (
              <TableHead
                className='min-w-32 cursor-pointer'
                onClick={() => handleSort('createdBy')}
                style={{ color: '#203d4d' }}
              >
                Created By <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.slides && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('slides')}
                style={{ color: '#203d4d' }}
              >
                Slides <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.slidesRetention && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('slidesRetention')}
                style={{ color: '#203d4d' }}
              >
                Retention % <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.interactions && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('interactions')}
                style={{ color: '#203d4d' }}
              >
                Interactions <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.totalDuration && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('totalDuration')}
                style={{ color: '#203d4d' }}
              >
                Duration <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.avgTimeRetention && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('avgTimeRetention')}
                style={{ color: '#203d4d' }}
              >
                Time Ret % <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.visits && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('visits')}
                style={{ color: '#203d4d' }}
              >
                Visits <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.uniqueUsers && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('uniqueUsers')}
                style={{ color: '#203d4d' }}
              >
                Users <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.avgTime && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('avgTime')}
                style={{ color: '#203d4d' }}
              >
                Avg Time <ChevronDown className='w-4 h-4 inline ml-1' />
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
            {visibleColumns.actions && (
              <TableHead className='min-w-32' style={{ color: '#203d4d' }}>
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Aggregated "All" row */}
          {!isLoading ||
            (!isFetching && (
              <TableRow className='border-gray-200 bg-gray-50 font-medium'>
                <TableCell>
                  <Checkbox disabled />
                </TableCell>
                {visibleColumns.realName && (
                  <TableCell
                    className='font-bold'
                    style={{ color: '#203d4d' }}
                  ></TableCell>
                )}
                {visibleColumns.project && (
                  <TableCell className='text-gray-500'></TableCell>
                )}
                {visibleColumns.createdAt && (
                  <TableCell className='text-gray-500'>
                    {aggregatedData.createdAt}
                  </TableCell>
                )}
                {visibleColumns.updatedAt && (
                  <TableCell className='text-gray-500'>
                    {aggregatedData.updatedAt}
                  </TableCell>
                )}
                {visibleColumns.sharingTitle && (
                  <TableCell className='text-gray-500'>
                    {aggregatedData.sharingTitle}
                  </TableCell>
                )}
                {visibleColumns.createdBy && (
                  <TableCell className='text-gray-500'>
                    {aggregatedData.createdBy}
                  </TableCell>
                )}
                {visibleColumns.slides && (
                  <TableCell className='text-right font-bold'>
                    {aggregatedData.slides}
                  </TableCell>
                )}
                {visibleColumns.slidesRetention && (
                  <TableCell className='text-right font-bold'>
                    {Number(aggregatedData.slidesRetention).toFixed(1)}%
                  </TableCell>
                )}
                {visibleColumns.interactions && (
                  <TableCell className='text-right font-bold'>
                    {Number(aggregatedData.interactions).toFixed(1)}
                  </TableCell>
                )}
                {visibleColumns.totalDuration && (
                  <TableCell className='text-right text-gray-500'>
                    {aggregatedData.totalDuration}
                  </TableCell>
                )}
                {visibleColumns.avgTimeRetention && (
                  <TableCell className='text-right font-bold'>
                    {Number(aggregatedData.avgTimeRetention).toFixed(1)}%
                  </TableCell>
                )}
                {visibleColumns.visits && (
                  <TableCell className='text-right font-bold'>
                    {aggregatedData.visits}
                  </TableCell>
                )}
                {visibleColumns.uniqueUsers && (
                  <TableCell className='text-right font-bold'>
                    {aggregatedData.uniqueUsers}
                  </TableCell>
                )}
                {visibleColumns.avgTime && (
                  <TableCell className='text-right font-bold'>
                    {aggregatedData.avgTime}
                  </TableCell>
                )}
                {visibleColumns.firstSeen && (
                  <TableCell className='text-gray-500'>
                    {aggregatedData.firstSeen}
                  </TableCell>
                )}
                {visibleColumns.lastSeen && (
                  <TableCell className='text-gray-500'>
                    {aggregatedData.lastSeen}
                  </TableCell>
                )}
                {visibleColumns.actions && <TableCell></TableCell>}
              </TableRow>
            ))}
          {/* Regular data rows */}
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

                  <TableCell>
                    <div
                      className='skeleton-number'
                      style={{ width: '100px' }}
                    />
                  </TableCell>

                  <TableCell>
                    <div
                      className='skeleton-number'
                      style={{ width: '70px' }}
                    />
                  </TableCell>

                  <TableCell className='text-right'>
                    <div
                      className='skeleton-number'
                      style={{ width: '40px' }}
                    />
                  </TableCell>

                  <TableCell className='text-right'>
                    <div
                      className='skeleton-number'
                      style={{ width: '40px' }}
                    />
                  </TableCell>

                  <TableCell className='text-right'>
                    <div
                      className='skeleton-number'
                      style={{ width: '40px' }}
                    />
                  </TableCell>

                  <TableCell className='text-right'>
                    <div
                      className='skeleton-number'
                      style={{ width: '60px' }}
                    />
                  </TableCell>

                  <TableCell className='text-right'>
                    <div
                      className='skeleton-number'
                      style={{ width: '60px' }}
                    />
                  </TableCell>

                  <TableCell>
                    <div
                      className='skeleton-number'
                      style={{ width: '80px' }}
                    />
                  </TableCell>

                  <TableCell>
                    <div
                      className='skeleton-number'
                      style={{ width: '80px' }}
                    />
                  </TableCell>

                  <TableCell>
                    <div
                      className='skeleton-number'
                      style={{ width: '40px' }}
                    />
                  </TableCell>
                </TableRow>
              ))
            : filteredAndSortedData.map(real => (
                <TableRow key={real.realId} className='border-gray-200'>
                  <TableCell>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleRowClick(real.realId, real.realName)}
                      className='h-8 w-8 p-0 bg-white border-gray-300'
                      style={{ color: '#203d4d' }}
                    >
                      <Eye className='w-4 h-4' />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(real.realId)}
                      onCheckedChange={() => handleRowSelect(real.realId)}
                    />
                  </TableCell>
                  {visibleColumns.realName && (
                    <TableCell
                      className='font-medium'
                      style={{ color: '#203d4d' }}
                    >
                      {real.realName == '' || null ? 'N/A' : real.realName}
                    </TableCell>
                  )}
                  {visibleColumns.project && (
                    <TableCell>
                      <Badge
                        variant='outline'
                        className='bg-white border-gray-300'
                        style={{ color: '#203d4d' }}
                      >
                        {real.project == '' || null ? '-' : real.project}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.createdAt && (
                    <TableCell className='text-gray-600 text-sm'>
                      {real.createdAt !== null
                        ? dayjs(real.createdAt).format('YYYY-MM-DD HH:mm')
                        : 'N/A'}
                    </TableCell>
                  )}
                  {visibleColumns.updatedAt && (
                    <TableCell className='text-gray-600 text-sm'>
                      {real.updatedAt !== null
                        ? dayjs(real.updatedAt).format('YYYY-MM-DD HH:mm')
                        : 'N/A'}
                    </TableCell>
                  )}
                  {visibleColumns.sharingTitle && (
                    <TableCell className='text-gray-700'>
                      {real.sharingTitle == '' || real.sharingTitle == null
                        ? '-'
                        : real.sharingTitle}
                    </TableCell>
                  )}
                  {visibleColumns.createdBy && (
                    <TableCell className='text-gray-700'>
                      {real.createdBy ?? 'N/A'}
                    </TableCell>
                  )}
                  {visibleColumns.slides && (
                    <TableCell className='text-right'>
                      {real.slides ?? '-'}
                    </TableCell>
                  )}
                  {visibleColumns.slidesRetention && (
                    <TableCell className='text-right'>
                      {real.slidesRetention ? real.slidesRetention + '%' : '-'}
                    </TableCell>
                  )}
                  {visibleColumns.interactions && (
                    <TableCell className='text-right'>
                      {real.interactions ?? '-'}
                    </TableCell>
                  )}
                  {visibleColumns.totalDuration && (
                    <TableCell className='text-right'>
                      {formatMsToMinSec(real?.totalDuration)}
                    </TableCell>
                  )}

                  {visibleColumns.avgTimeRetention && (
                    <TableCell className='text-right'>
                      {real.avgTimeRetention ?? '-'}
                    </TableCell>
                  )}
                  {visibleColumns.visits && (
                    <TableCell className='text-right'>{real.visits}</TableCell>
                  )}
                  {visibleColumns.uniqueUsers && (
                    <TableCell className='text-right'>
                      {real.uniqUsers ?? '-'}
                    </TableCell>
                  )}
                  {visibleColumns.avgTime && (
                    <TableCell className='text-right'>
                      {((real.avgTime ?? 0) / 60).toFixed(2)}
                    </TableCell>
                  )}
                  {visibleColumns.firstSeen && (
                    <TableCell className='text-gray-600 text-sm'>
                      {real.firstSeen !== null
                        ? dayjs(real.firstSeen).format('YYYY-MM-DD HH:mm')
                        : 'N/A'}
                    </TableCell>
                  )}
                  {visibleColumns.lastSeen && (
                    <TableCell className='text-gray-600 text-sm'>
                      {real.lastSeen !== null
                        ? dayjs(real.lastSeen).format('YYYY-MM-DD HH:mm')
                        : 'N/A'}
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <div className='flex gap-1'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleCopyLink(real.currentUrl)}
                          className='h-8 w-8 p-0 bg-white border-gray-300'
                          style={{ color: '#203d4d' }}
                        >
                          <Copy className='w-3 h-3' />
                        </Button>
                        {/* <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleArchive(real.id, real.realName)}
                      className='h-8 w-8 p-0 text-red-600 hover:text-red-700 bg-white border-gray-300'
                    >
                      <Archive className='w-3 h-3' />
                    </Button> */}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}

          {(RealsDatas?.realsData.length === 0 || isError) && (
            <TableRow>
              <TableCell colSpan={10} className='text-center text-red-500 py-4'>
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
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <>
      <Card className='bg-white border-gray-200'>
        <CardHeader>
          <HeaderControls
            searchTerm={searchTerm}
            setSearchTerm={value => setSearchTerm(value)}
            selectedCount={selectedRows.length ?? 0}
            columnFilters={columnFilters}
            handleColumnFilter={handleColumnFilter}
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
            clearFilters={clearFilters}
            handleExportCSV={handleExportCSV}
            tableContent={<TableContent />}
            hasNoReals={filteredAndSortedData.length === 0}
          />
        </CardHeader>
        <CardContent>
          <TableContent />
          <div style={{ margin: '15px 20px ' }}>
            <CustomPagination
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
          {/* <RealDrilldown open={true} realName={'vfdjv'} slides={[]} /> */}
        </CardContent>
      </Card>
      {popupid && (
        <RealDrilldown
          open={drilldownOpen}
          onOpenChange={setDrilldownOpen}
          realId={popupid.real}
          realName={popupid.realname}
        />
      )}
    </>
  )
}
