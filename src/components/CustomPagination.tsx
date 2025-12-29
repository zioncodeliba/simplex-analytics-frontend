'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type CustomPaginationProps = {
  limit: number
  setLimit: (limit: number) => void
  page: number
  setPage: (page: number) => void
  totalPages: number
}

const getPageNumbers = (
  current: number,
  total: number
): (number | 'ellipsis')[] => {
  const delta = 1
  const range: number[] = []
  const rangeWithDots: (number | 'ellipsis')[] = []
  let last: number | undefined

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i)
    }
  }

  for (const page of range) {
    if (last !== undefined) {
      if (page - last === 2) {
        rangeWithDots.push(last + 1)
      } else if (page - last > 2) {
        rangeWithDots.push('ellipsis')
      }
    }
    rangeWithDots.push(page)
    last = page
  }

  return rangeWithDots
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  limit,
  setLimit,
  page,
  setPage,
  totalPages,
}) => {
  return (
    <div
      className=''
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      {/* Rows per page */}

      <div className='flex items-center gap-2 w-full lg:w-auto whitespace-nowrap'>
        <span className='text-sm text-black'>Rows per page:</span>

        <Select
          value={limit.toString()}
          onValueChange={value => {
            setLimit(Number(value))
            setPage(1)
          }}
        >
          <SelectTrigger className='w-[80px] h-9'>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[10, 20, 30, 50, 100].map(value => (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination Section */}
      <Pagination style={{ justifyContent: 'end', userSelect: 'none' }}>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(Math.max(page - 1, 1))}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {getPageNumbers(page, totalPages).map(p => (
            <PaginationItem key={`page-${p}`}>
              {p === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={page === p}
                  onClick={() => setPage(p)}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(Math.min(page + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
