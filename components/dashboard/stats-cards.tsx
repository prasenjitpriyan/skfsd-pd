'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useApi } from '@/hooks/use-api'
import { DollarSign, FileText, Mail, Package, TrendingDown, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface StatsData {
  todaysMetrics: {
    lettersDelivered: number
    parcelsDelivered: number
    revenueCollected: number
    change: {
      letters: number
      parcels: number
      revenue: number
    }
  }
  drmEntries: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const { get, isLoading } = useApi()

const loadStats = useCallback(async () => {
  const response = await get<StatsData>('/api/dashboard/stats')
  if (response.success && response.data) {
    setStats(response.data)
  }
}, [get])

useEffect(() => {
  loadStats()
}, [loadStats])

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatChange = (change: number) => {
    const isPositive = change > 0
    const Icon = isPositive ? TrendingUp : TrendingDown
    const color = isPositive ? 'text-green-600' : 'text-red-600'

    return (
      <div className={`flex items-center text-xs ${color}`}>
        <Icon className="mr-1 h-3 w-3" />
        {Math.abs(change).toFixed(1)}%
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Letters Delivered</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.todaysMetrics.lettersDelivered.toLocaleString()}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Today</p>
            {formatChange(stats.todaysMetrics.change.letters)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Parcels Delivered</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.todaysMetrics.parcelsDelivered.toLocaleString()}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Today</p>
            {formatChange(stats.todaysMetrics.change.parcels)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Collected</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{stats.todaysMetrics.revenueCollected.toLocaleString()}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Today</p>
            {formatChange(stats.todaysMetrics.change.revenue)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">DRM Entries</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.drmEntries.total}</div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-xs">
                {stats.drmEntries.pending} Pending
              </Badge>
              <Badge variant="success" className="text-xs">
                {stats.drmEntries.approved} Approved
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
