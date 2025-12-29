'use client'
import React, { useState } from 'react'

import {
  Download,
  Search,
  Settings,
  ChevronDown,
  ExternalLink,
  Shield,
} from 'lucide-react'

import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

// interface CreatorsTableProps {
//   dateRange?: { from: Date; to: Date }
// }

export function CreatorsTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    totalCreated: true,
    totalVisits: true,
    uniqueUsers: true,
    avgTimeSpent: true,
    firstRealCreated: true,
    lastActivity: true,
    actions: true,
  })

  // Mock data - in real app this would come from API
  const creatorsData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      totalCreated: 87,
      totalVisits: 3247,
      uniqueUsers: 2456,
      avgTimeSpent: '18h 45m',
      firstRealCreated: '2024-03-15 09:30',
      lastActivity: '2025-01-07 16:45',
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      totalCreated: 76,
      totalVisits: 2856,
      uniqueUsers: 2134,
      avgTimeSpent: '16h 32m',
      firstRealCreated: '2024-04-22 14:15',
      lastActivity: '2025-01-06 11:30',
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@company.com',
      totalCreated: 65,
      totalVisits: 2543,
      uniqueUsers: 1987,
      avgTimeSpent: '15h 18m',
      firstRealCreated: '2024-05-03 10:45',
      lastActivity: '2025-01-05 13:18',
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      totalCreated: 58,
      totalVisits: 2289,
      uniqueUsers: 1743,
      avgTimeSpent: '14h 22m',
      firstRealCreated: '2024-06-11 16:20',
      lastActivity: '2025-01-04 14:52',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      totalCreated: 54,
      totalVisits: 2156,
      uniqueUsers: 1654,
      avgTimeSpent: '13h 56m',
      firstRealCreated: '2024-07-18 11:10',
      lastActivity: '2025-01-03 09:40',
    },
    {
      id: 6,
      name: 'John Martinez',
      email: 'john.martinez@company.com',
      totalCreated: 42,
      totalVisits: 1876,
      uniqueUsers: 1432,
      avgTimeSpent: '12h 34m',
      firstRealCreated: '2024-08-25 13:45',
      lastActivity: '2025-01-02 17:22',
    },
    {
      id: 7,
      name: 'Amy Taylor',
      email: 'amy.taylor@company.com',
      totalCreated: 39,
      totalVisits: 1654,
      uniqueUsers: 1287,
      avgTimeSpent: '11h 48m',
      firstRealCreated: '2024-09-12 08:30',
      lastActivity: '2025-01-01 15:18',
    },
  ]

  const filteredAndSortedData = creatorsData
    .filter(
      creator =>
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
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

  const handleCreatorDashboard = (creatorId: number, creatorName: string) => {
    toast.success(`Opening dashboard for ${creatorName}`)
  }

  const handleManagePermissions = (creatorId: number, creatorName: string) => {
    toast.success(`Managing permissions for ${creatorName}`)
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
            return 'Creator Name'
          case 'email':
            return 'Email'
          case 'totalCreated':
            return 'Total Created'
          case 'totalVisits':
            return 'Total Visits'
          case 'uniqueUsers':
            return 'Unique Users'
          case 'avgTimeSpent':
            return 'Average Time Spent'
          case 'firstRealCreated':
            return 'First REAL Created At'
          case 'lastActivity':
            return 'Last Activity'
          default:
            return key
        }
      })

    const csvContent = [
      headers.join(','),
      ...filteredAndSortedData.map(creator =>
        Object.keys(visibleColumns)
          .filter(
            key =>
              visibleColumns[key as keyof typeof visibleColumns] &&
              key !== 'actions'
          )
          .map(key => {
            const value = creator[key as keyof typeof creator]
            return typeof value === 'string' ? `"${value}"` : value
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `creators-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('CSV file downloaded successfully!')
  }

  return (
    <Card className='bg-white border-gray-200'>
      <CardHeader>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <CardTitle style={{ color: '#203d4d' }}>Creators Data</CardTitle>
            <CardDescription className='text-gray-600'>
              Performance metrics for all creators
            </CardDescription>
          </div>
          <div className='flex flex-col md:flex-row gap-2'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search creators...'
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
                        {key.replace(/([A-Z])/g, ' $1').trim()}
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
                    Creator Name <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.email && (
                  <TableHead
                    className='min-w-48 cursor-pointer'
                    onClick={() => handleSort('email')}
                    style={{ color: '#203d4d' }}
                  >
                    Email <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.totalCreated && (
                  <TableHead
                    className='text-right cursor-pointer'
                    onClick={() => handleSort('totalCreated')}
                    style={{ color: '#203d4d' }}
                  >
                    Total Created{' '}
                    <ChevronDown className='w-4 h-4 inline ml-1' />
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
                    Avg Time Spent{' '}
                    <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.firstRealCreated && (
                  <TableHead
                    className='min-w-36 cursor-pointer'
                    onClick={() => handleSort('firstRealCreated')}
                    style={{ color: '#203d4d' }}
                  >
                    First REAL Created{' '}
                    <ChevronDown className='w-4 h-4 inline ml-1' />
                  </TableHead>
                )}
                {visibleColumns.lastActivity && (
                  <TableHead
                    className='min-w-36 cursor-pointer'
                    onClick={() => handleSort('lastActivity')}
                    style={{ color: '#203d4d' }}
                  >
                    Last Activity{' '}
                    <ChevronDown className='w-4 h-4 inline ml-1' />
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
              {filteredAndSortedData.map(creator => (
                <TableRow key={creator.id} className='border-gray-200'>
                  {visibleColumns.name && (
                    <TableCell
                      className='font-medium'
                      style={{ color: '#203d4d' }}
                    >
                      {creator.name}
                    </TableCell>
                  )}
                  {visibleColumns.email && (
                    <TableCell className='text-gray-600'>
                      {creator.email}
                    </TableCell>
                  )}
                  {visibleColumns.totalCreated && (
                    <TableCell className='text-right'>
                      {creator.totalCreated}
                    </TableCell>
                  )}
                  {visibleColumns.totalVisits && (
                    <TableCell className='text-right'>
                      {creator.totalVisits.toLocaleString()}
                    </TableCell>
                  )}
                  {visibleColumns.uniqueUsers && (
                    <TableCell className='text-right'>
                      {creator.uniqueUsers.toLocaleString()}
                    </TableCell>
                  )}
                  {visibleColumns.avgTimeSpent && (
                    <TableCell className='text-right'>
                      {creator.avgTimeSpent}
                    </TableCell>
                  )}
                  {visibleColumns.firstRealCreated && (
                    <TableCell className='text-gray-600 text-sm'>
                      {creator.firstRealCreated}
                    </TableCell>
                  )}
                  {visibleColumns.lastActivity && (
                    <TableCell className='text-gray-600 text-sm'>
                      {creator.lastActivity}
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <div className='flex gap-1'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            handleCreatorDashboard(creator.id, creator.name)
                          }
                          className='h-8 w-8 p-0 bg-white border-gray-300'
                          style={{ color: '#203d4d' }}
                        >
                          <ExternalLink className='w-3 h-3' />
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            handleManagePermissions(creator.id, creator.name)
                          }
                          className='h-8 w-8 p-0 bg-white border-gray-300'
                          style={{ color: '#203d4d' }}
                        >
                          <Shield className='w-3 h-3' />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredAndSortedData.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            No creators found matching your search criteria.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
