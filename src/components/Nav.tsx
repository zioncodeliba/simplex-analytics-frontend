'use client'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { ChevronDown, LogOut, Menu, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { DateFilter } from './DateFilter'
import Navtab from './Navtab'
import simplexLogo from '../assets/logo-simplex-light.png'
import Image from 'next/image'
import { DateContext } from '@/hook/context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
const Navigation = () => (
  <nav className='flex items-center space-x-6'>
    <div className='flex items-center space-x-2'>
      <Link href='/'>
        <Image
          src={simplexLogo}
          alt='SIMPLEX'
          className='h-8'
          // style={{ width: '162px' }}
          width={162}
          height={100}
        />
      </Link>
    </div>
  </nav>
)
const Header = () => (
  <header
    style={{ backgroundColor: '#203d4d' }}
    className='border-b border-gray-600 px-4 lg:px-6 py-3'
  >
    <div className='flex items-center justify-between'>
      <Navigation />
      <div className='navbar-main'>
        <Navtab />
      </div>
      <div className='flex items-center space-x-3'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex items-center space-x-2 cursor-pointer'>
              <User className='w-4 h-4 text-gray-300' />
              <span className='text-gray-300 text-sm hidden md:block'>
                {/* {user || 'User'} */}Webvoltz
              </span>
              <ChevronDown className='w-3 h-3 text-gray-300' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem className='cursor-pointer'>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='md:hidden text-gray-300 hover:text-white'
            >
              <Menu className='w-4 h-4' />
            </Button>
          </SheetTrigger>
          <SheetContent
            side='right'
            style={{ backgroundColor: '#203d4d', color: 'white' }}
            className='border-gray-600'
          >
            <div className='flex flex-col space-y-4 mt-8'>
              <span className='text-gray-300' style={{ marginLeft: '15px' }}>
                Menu
              </span>
              <Navtab />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
)

const Navbar = () => {
  const urlpath = usePathname()
  let title = 'Management'
  if (urlpath?.includes('reals')) {
    title = 'Reals'
  } else if (urlpath?.includes('projects')) {
    title = 'Projects'
  } else if (urlpath?.includes('creators')) {
    title = 'Creators'
  } else if (urlpath?.includes('units')) {
    title = 'Units'
  }
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  })
  const handleDateRangeChange = useCallback(
    (range: { from?: Date; to?: Date }) => {
      setDateRange(range)
    },
    []
  )
  const ctx = useContext(DateContext)
  const setDate = ctx?.setDate

  useEffect(() => {
    if (!setDate) return
    setDate({
      startDate: dateRange?.from?.toISOString()?.slice(0, 10) ?? undefined,
      endDate: dateRange?.to?.toISOString()?.slice(0, 10) ?? undefined,
    })
  }, [dateRange, setDate])

  return (
    <div>
      <Header />

      <div className='container mx-auto px-4 py-4 max-w-7xl'>
        <div className='mb-4'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4'>
            <div>
              <h1 className='text-2xl font-bold' style={{ color: '#203d4d' }}>
                {title} Dashboard
              </h1>
              <p className='text-gray-600 text-sm'>
                Track REAL engagement, project and creator activity
              </p>
            </div>
            <DateFilter onDateRangeChange={handleDateRangeChange} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Navbar
