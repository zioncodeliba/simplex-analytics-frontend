'use client'
import React, { useContext, useEffect, useState } from 'react'

import {
  Download,
  Search,
  Settings,
  ChevronDown,
  Filter,
  Maximize2,
  Minimize2,
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
import { useGetProjectDataQuery } from '@/services/projectData'

import { CustomPagination } from '../CustomPagination'
import { useDebounce } from '@/hook/useDebounce'
import dayjs from 'dayjs'
import { DateContext } from '@/hook/context'
import Image from 'next/image'
import nothing from '@/assets/paper.png'

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
  hasNoProjects: boolean
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
  hasNoProjects,
}) => (
  <div className='flex flex-col gap-4 '>
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
      <div>
        <CardTitle style={{ color: '#203d4d' }}>Projects Data</CardTitle>
        <CardDescription className='text-gray-600'>
          Complete list of projects with performance metrics
          {selectedCount > 0 && ` (${selectedCount} selected)`}
        </CardDescription>
      </div>
      <div className='flex flex-col md:flex-row gap-2'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search projects...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
                  <label className='text-sm font-medium text-gray-600'>
                    Status
                  </label>
                  <Input
                    placeholder='Filter by status...'
                    value={columnFilters.status || ''}
                    onChange={e => handleColumnFilter('status', e.target.value)}
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
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className=''>
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
              className='max-w-[95vw] max-h-[95vh] w-full h-full p-0'
              style={{ overflow: 'auto' }}
            >
              <DialogHeader className='p-6 pb-0'>
                <div className='flex items-center justify-between'>
                  <DialogTitle style={{ color: '#203d4d' }}>
                    Projects Data - Full Screen
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
              <div className='p-6 pt-4h-full overflow-auto'>
                <div className='mb-4'>
                  {/* header controls in full screen */}
                </div>
                {tableContent}
                {hasNoProjects && (
                  <div className='text-center py-8 text-gray-500'>
                    No projects found matching your search criteria.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
interface ProjectsTableProps {
  dateRange?: { from: Date; to: Date }
  onSelectionChange?: (selectedIds: number[]) => void
}

export function ProjectsTable({
  // dateRange,
  onSelectionChange,
}: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    status: true,
    realsCount: true,
    openRate: true,
    totalVisits: true,
    uniqueUsers: true,
    avgTimeSpent: true,
    createdAt: true,
    lastUpdated: true,
    actions: true,
  })

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const dateContext = useContext(DateContext)
  const {
    data: projectData,
    isLoading,
    isFetching,
    isError,
  } = useGetProjectDataQuery({
    page,
    limit,
    search: debouncedSearch,
    startDate: dateContext?.date?.startDate,
    endDate: dateContext?.date?.endDate,
  })
  const totalPages = Math.ceil((projectData?.totalProjects ?? 10) / limit)
  // Mock data - in real app this would come from API
  // const projectsData = [
  //   {
  //     id: 1,
  //     name: 'All Tel-Aviv',
  //     status: 'Active',
  //     realsCount: 156,
  //     openRate: 87.5,
  //     totalVisits: 2847,
  //     uniqueUsers: 2134,
  //     avgTimeSpent: 15.8,
  //     createdAt: '2024-03-15 09:30',
  //     lastUpdated: '2025-01-07 16:45',
  //   },
  // ]
  // Calculate aggregated "All" row
  const aggregatedData = {
    id: 'all',
    name: 'ALL PROJECTS',
    status: '-',
    realsCount:
      projectData?.data?.reduce(
        (sum, project) => sum + project.realsCount,
        0
      ) ?? 0,
    openRate:
      projectData?.data && projectData.data.length > 0
        ? projectData.data.reduce((sum, project) => sum + project.openRate, 0) /
          projectData.data.length
        : 0,
    totalVisits:
      projectData?.data?.reduce(
        (sum, project) => sum + project.totalVisits,
        0
      ) ?? 0,
    uniqueUsers:
      projectData?.data?.reduce(
        (sum, project) => sum + project.uniqueUsers,
        0
      ) ?? 0,
    avgTimeSpent:
      projectData?.data && projectData.data.length > 0
        ? projectData.data.reduce(
            (sum, project) => sum + project.avgTimeSpent,
            0
          ) / projectData.data.length
        : 0,
    createdAt: '-',
    lastUpdated: '-',
  }
  useEffect(() => {}, [debouncedSearch])
  const filteredAndSortedData = projectData?.data
    ?.filter(project => {
      const columnFiltersMatch = Object.entries(columnFilters).every(
        ([column, filter]) => {
          if (!filter) return true
          const value = project[column as keyof typeof project]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(filter.toLowerCase())
          }
          return value.toString().includes(filter)
        }
      )

      return columnFiltersMatch
    })
    .sort((a, b) => {
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
  const handleRowSelect = (projectId: number) => {
    const newSelectedRows = selectedRows.includes(projectId)
      ? selectedRows.filter(id => id !== projectId)
      : [...selectedRows, projectId]

    setSelectedRows(newSelectedRows)
    onSelectionChange?.(newSelectedRows)
  }

  const handleSelectAll = () => {
    const newSelectedRows =
      selectedRows.length === filteredAndSortedData?.length
        ? []
        : (filteredAndSortedData?.map(project => project.id) ?? [])
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

  const handleExportCSV = () => {
    const headers = Object.keys(visibleColumns)
      .filter(
        key =>
          visibleColumns[key as keyof typeof visibleColumns] &&
          key !== 'actions'
      )
      .map(key => {
        switch (key) {
          case 'name':
            return 'Project Name'
          case 'status':
            return 'Status'
          case 'realsCount':
            return 'REALS Count'
          case 'openRate':
            return 'Open Rate (%)'
          case 'totalVisits':
            return 'Total Visits'
          case 'uniqueUsers':
            return 'Unique Users'
          case 'avgTimeSpent':
            return 'Avg Time Spent (min)'
          case 'createdAt':
            return 'Created At'
          case 'lastUpdated':
            return 'Last Updated'
          default:
            return key
        }
      })

    const dataToExport =
      selectedRows.length > 0
        ? (filteredAndSortedData?.filter(project =>
            selectedRows.includes(project.id)
          ) ?? [])
        : (filteredAndSortedData ?? [])

    const csvContent = [
      '\uFEFF', // ← UTF-8 BOM FIX
      headers.join(','),
      ...dataToExport.map(project =>
        Object.keys(visibleColumns)
          .filter(
            key =>
              visibleColumns[key as keyof typeof visibleColumns] &&
              key !== 'actions'
          )
          .map(key => {
            const value = project[key as keyof typeof project]
            return typeof value === 'string' ? `"${value}"` : value
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;', // ← IMPORTANT for Hebrew/Arabic/Urdu
    })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `projects-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('CSV file downloaded successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-white border-gray-300 text-green-700'
      case 'Paused':
        return 'bg-white border-gray-300 text-orange-600'
      case 'Completed':
        return 'bg-white border-gray-300 text-blue-600'
      default:
        return 'bg-white border-gray-300 text-gray-600'
    }
  }

  const TableContent = () => (
    <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow className='border-gray-200'>
            <TableHead className='w-12'>
              <Checkbox
                checked={
                  selectedRows.length === filteredAndSortedData?.length &&
                  filteredAndSortedData?.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {visibleColumns.name && (
              <TableHead
                className='min-w-48 cursor-pointer'
                onClick={() => handleSort('name')}
                style={{ color: '#203d4d' }}
              >
                Project Name <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.status && (
              <TableHead
                className='min-w-28 cursor-pointer'
                onClick={() => handleSort('status')}
                style={{ color: '#203d4d' }}
              >
                Status <ChevronDown className='w-4 h-4 inline ml-1' />
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
            {visibleColumns.openRate && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('openRate')}
                style={{ color: '#203d4d' }}
              >
                Open Rate % <ChevronDown className='w-4 h-4 inline ml-1' />
              </TableHead>
            )}
            {visibleColumns.totalVisits && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('totalVisits')}
                style={{ color: '#203d4d' }}
              >
                Total Visits <ChevronDown className='w-4 h-4 inline ml-1' />
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
            {visibleColumns.avgTimeSpent && (
              <TableHead
                className='text-right cursor-pointer'
                onClick={() => handleSort('avgTimeSpent')}
                style={{ color: '#203d4d' }}
              >
                Avg Time (min) <ChevronDown className='w-4 h-4 inline ml-1' />
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
            {visibleColumns.lastUpdated && (
              <TableHead
                className='min-w-36 cursor-pointer'
                onClick={() => handleSort('lastUpdated')}
                style={{ color: '#203d4d' }}
              >
                Last Updated <ChevronDown className='w-4 h-4 inline ml-1' />
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
                {visibleColumns.name && (
                  <TableCell className='font-bold' style={{ color: '#203d4d' }}>
                    {aggregatedData.name}
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell className='text-gray-500'>
                    {aggregatedData.status}
                  </TableCell>
                )}
                {visibleColumns.realsCount && (
                  <TableCell className='text-right font-bold'>
                    {aggregatedData.realsCount}
                  </TableCell>
                )}
                {visibleColumns.openRate && (
                  <TableCell className='text-right font-bold'>
                    {aggregatedData.openRate.toFixed(1)}%
                  </TableCell>
                )}
                {visibleColumns.totalVisits && (
                  <TableCell className='text-right font-bold'>
                    {aggregatedData?.totalVisits?.toLocaleString()}
                  </TableCell>
                )}
                {visibleColumns.uniqueUsers && (
                  <TableCell className='text-right font-bold'>
                    {aggregatedData?.uniqueUsers?.toLocaleString()}
                  </TableCell>
                )}
                {visibleColumns.avgTimeSpent && (
                  <TableCell className='text-right font-bold'>
                    {aggregatedData?.avgTimeSpent?.toFixed(1)}
                  </TableCell>
                )}
                {visibleColumns.createdAt && (
                  <TableCell className='text-gray-500'>
                    {aggregatedData?.createdAt}
                  </TableCell>
                )}
                {visibleColumns.lastUpdated && (
                  <TableCell className='text-gray-500'>
                    {aggregatedData?.lastUpdated}
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
                  {visibleColumns.name && (
                    <TableCell>
                      <div
                        className='skeleton-number'
                        style={{ width: '100px' }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.status && (
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
                  {visibleColumns.openRate && (
                    <TableCell className='text-right'>
                      <div
                        className='skeleton-number'
                        style={{ width: '40px' }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.totalVisits && (
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
                        style={{ width: '60px' }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.avgTimeSpent && (
                    <TableCell className='text-right'>
                      <div
                        className='skeleton-number'
                        style={{ width: '60px' }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.createdAt && (
                    <TableCell>
                      <div
                        className='skeleton-number'
                        style={{ width: '80px' }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.lastUpdated && (
                    <TableCell>
                      <div
                        className='skeleton-number'
                        style={{ width: '80px' }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <div
                        className='skeleton-number'
                        style={{ width: '40px' }}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            : filteredAndSortedData?.map(project => (
                <TableRow key={project.id} className='border-gray-200'>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(project.id)}
                      onCheckedChange={() => handleRowSelect(project.id)}
                    />
                  </TableCell>

                  {visibleColumns.name && (
                    <TableCell
                      className='font-medium'
                      style={{ color: '#203d4d' }}
                    >
                      {project.name ?? '-'}
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={getStatusColor(project.status)}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.realsCount && (
                    <TableCell className='text-right'>
                      {project.realsCount}
                    </TableCell>
                  )}
                  {visibleColumns.openRate && (
                    <TableCell className='text-right'>
                      {project.openRate}%
                    </TableCell>
                  )}
                  {visibleColumns.totalVisits && (
                    <TableCell className='text-right'>
                      {project.totalVisits.toLocaleString()}
                    </TableCell>
                  )}
                  {visibleColumns.uniqueUsers && (
                    <TableCell className='text-right'>
                      {project.uniqueUsers.toLocaleString()}
                    </TableCell>
                  )}
                  {visibleColumns.avgTimeSpent && (
                    <TableCell className='text-right'>
                      {Math.round(
                        dayjs
                          .duration(project.avgTimeSpent, 'seconds')
                          .asMinutes()
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.createdAt && (
                    <TableCell className='text-gray-600 text-sm'>
                      {dayjs(project.createdAt).format('YYYY-MM-DD')}
                    </TableCell>
                  )}
                  {visibleColumns.lastUpdated && (
                    <TableCell className='text-gray-600 text-sm'>
                      {dayjs(project.lastUpdated).format('YYYY-MM-DD')}
                    </TableCell>
                  )}
                </TableRow>
              ))}

          {(projectData?.data?.length === 0 || isError) && (
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
    <div className=''>
      <Card className='bg-white border-gray-200'>
        <CardHeader>
          <HeaderControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCount={selectedRows.length}
            columnFilters={columnFilters}
            handleColumnFilter={handleColumnFilter}
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
            clearFilters={clearFilters}
            handleExportCSV={handleExportCSV}
            tableContent={<TableContent />}
            hasNoProjects={(filteredAndSortedData?.length ?? 0) === 0}
          />
        </CardHeader>
        <CardContent>
          <TableContent />
        </CardContent>
        <div style={{ margin: '15px 20px ' }}>
          <CustomPagination
            limit={limit}
            setLimit={setLimit}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </Card>
    </div>
  )
}
