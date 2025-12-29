'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import '@/styles/navbar.css'
const Navtab = () => {
  const pathname = usePathname()
  const navItems = [
    { label: 'Overview', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Reals', href: '/reals' },
    { label: 'Units', href: '/units' },
    { label: 'Creators', href: '/creators' },
  ]
  return (
    <nav
      className='flex navbar  p-1'
      style={{
        width: '500px',
        justifyContent: 'space-between',
        color: 'black',
      }}
    >
      {navItems.map(item => {
        return (
          <Link
            key={item.href}
            href={item.href}
            className='px-3 py-2  transition rounded-md navbar-link'
            style={{
              fontWeight: 600,
              fontSize: '15px',
              color: `${pathname === item.href ? '#C0F4D1' : 'white'}`,
            }}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
export default Navtab
