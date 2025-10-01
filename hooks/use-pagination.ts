import { useMemo, useState } from 'react'

interface UsePaginationProps {
  totalItems: number
  itemsPerPage?: number
  initialPage?: number
}

export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginationInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      startIndex,
      endIndex,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
    }
  }, [currentPage, totalPages, totalItems, itemsPerPage])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => {
    if (paginationInfo.hasNext) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (paginationInfo.hasPrev) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const reset = () => {
    setCurrentPage(1)
  }

  return {
    ...paginationInfo,
    goToPage,
    nextPage,
    prevPage,
    reset,
  }
}
