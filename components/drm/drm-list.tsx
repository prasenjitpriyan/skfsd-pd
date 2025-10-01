'use client'

import { LoadingState } from '@/components/common/loading-state'
import { Button } from '@/components/ui/button'
import { useApi } from '@/hooks/use-api'
import { DRMEntry } from '@/types/drm'
import { ApiResponse } from '@/types/index'
import { RefreshCw } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { DRMCard } from './drm-card'

interface DRMListProps {
  searchTerm: string
  statusFilter: string
  categoryFilter: string
}

export function DRMList({ searchTerm, statusFilter, categoryFilter }: DRMListProps) {
  const [entries, setEntries] = useState<DRMEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<DRMEntry[]>([])
  const { get, isLoading } = useApi()

  // ✅ Memoized fetch function
  const fetchEntries = useCallback(async () => {
    try {
      const res: ApiResponse<{ entries: DRMEntry[] }> = await get('/api/drm')

      if (res.success && res.data) {
        setEntries(res.data.entries || [])
      } else {
        console.error('Failed to fetch DRM entries:', res.error?.message)
        setEntries([])
      }
    } catch (error) {
      console.error('Failed to fetch DRM entries:', error)
      setEntries([])
    }
  }, [get])

  // ✅ Memoized filter function
  const filterEntries = useCallback(() => {
    let filtered = entries

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(entry => entry.category === categoryFilter)
    }

    setFilteredEntries(filtered)
  }, [entries, searchTerm, statusFilter, categoryFilter])

  // ✅ Run fetch once on mount
  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  // ✅ Run filter when dependencies change
  useEffect(() => {
    filterEntries()
  }, [filterEntries])

  if (isLoading) {
    return <LoadingState message="Loading DRM entries..." />
  }

  if (filteredEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
          <p className="text-gray-500 mb-4">
            {entries.length === 0
              ? "You haven't created any DRM entries yet."
              : "No entries match your current filters."
            }
          </p>
          {entries.length === 0 ? (
            <Button asChild>
              <Link href={"/drm/create" as Route}>
                Create Your First Entry
              </Link>
            </Button>
          ) : (
            <Button onClick={fetchEntries} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEntries.length} of {entries.length} entries
        </p>
        <Button onClick={fetchEntries} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredEntries.map((entry) => (
          <DRMCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
