'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const targets = [
  {
    name: 'Letters Delivered',
    current: 125000,
    target: 450000,
    unit: 'letters',
    color: 'bg-blue-500',
  },
  {
    name: 'Parcels Delivered',
    current: 14500,
    target: 55000,
    unit: 'parcels',
    color: 'bg-green-500',
  },
  {
    name: 'Revenue Collection',
    current: 4800000,
    target: 18000000,
    unit: '₹',
    color: 'bg-purple-500',
  },
  {
    name: 'Savings Accounts',
    current: 680,
    target: 2400,
    unit: 'accounts',
    color: 'bg-orange-500',
  },
]

export function TargetProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Annual Targets Progress</CardTitle>
        <CardDescription>Progress towards FY 2025-26 targets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {targets.map((target) => {
          const percentage = Math.round((target.current / target.target) * 100)
          const isOnTrack = percentage >= 25 // Assuming Q1 (25% of year)

          return (
            <div key={target.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{target.name}</span>
                <Badge variant={isOnTrack ? 'success' : 'warning'}>
                  {percentage}%
                </Badge>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {target.unit === '₹'
                    ? `₹${target.current.toLocaleString()}`
                    : `${target.current.toLocaleString()} ${target.unit}`
                  }
                </span>
                <span>
                  Target: {target.unit === '₹'
                    ? `₹${target.target.toLocaleString()}`
                    : `${target.target.toLocaleString()} ${target.unit}`
                  }
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
