'use client'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider as TooltipProvider } from '@radix-ui/react-tooltip'
import { store } from '@/store/index'
import { Toaster } from '@/components/ui/sonner'
interface ProvidersProps {
  readonly children: React.ReactNode
}
const Providers = ({ children }: ProvidersProps) => {
  return (
    <ReduxProvider store={store}>
      <TooltipProvider>
        {children}
        <Toaster position='top-right' />
      </TooltipProvider>
    </ReduxProvider>
  )
}
export default Providers
