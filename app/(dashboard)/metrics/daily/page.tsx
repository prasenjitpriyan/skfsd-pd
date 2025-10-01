'use client'

import { CountdownTimer } from '@/components/metrics/countdown-timer'
import { DailyForm } from '@/components/metrics/daily-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InfoIcon } from 'lucide-react'

export default function DailyMetricsPage() {
  const today = new Date()
  const cutoffTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 0)
  const timeUntilCutoff = cutoffTime.getTime() - Date.now()
  const isLocked = timeUntilCutoff <= 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Daily Metrics Entry</h1>
        <p className="text-muted-foreground">
          Submit daily metrics for {today.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {!isLocked && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <InfoIcon className="mr-2 h-5 w-5" />
              Time Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CountdownTimer targetTime={cutoffTime} />
            <p className="text-sm text-yellow-700 mt-2">
              Metrics entry will be locked at 11:59 PM IST
            </p>
          </CardContent>
        </Card>
      )}

      {isLocked ? (
        <Alert variant="destructive">
          <AlertDescription>
            Daily metrics entry is now locked for today. Please contact your administrator
            if you need to make changes.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Enter Today&aposs Metrics</CardTitle>
            <CardDescription>
              Fill in all required fields. Data will be automatically saved as you type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DailyForm />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
