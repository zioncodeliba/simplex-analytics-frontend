import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'
import { Info } from 'lucide-react'

interface InfoTooltipProps {
  content: string
  className?: string
}

export function InfoTooltip({ content, className = '' }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info
            className={`w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help ${className}`}
          />
        </TooltipTrigger>
        <TooltipContent className='max-w-xs bg-white border border-gray-300 text-gray-700'>
          <p className='text-sm'>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
