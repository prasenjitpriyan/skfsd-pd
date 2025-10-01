'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { date: '01', letters: 1200, parcels: 140, revenue: 42000 },
  { date: '02', letters: 1150, parcels: 132, revenue: 38000 },
  { date: '03', letters: 1300, parcels: 158, revenue: 48000 },
  { date: '04', letters: 1180, parcels: 145, revenue: 41000 },
  { date: '05', letters: 1220, parcels: 151, revenue: 44000 },
  { date: '06', letters: 1280, parcels: 162, revenue: 46000 },
  { date: '07', letters: 1248, parcels: 156, revenue: 45230 },
]

export function MetricsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Performance</CardTitle>
        <CardDescription>Daily metrics for the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'revenue') {
                  return [`₹${value.toLocaleString()}`, 'Revenue']
                }
                return [value, name === 'letters' ? 'Letters' : 'Parcels']
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="letters"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Letters"
            />
            <Line
              type="monotone"
              dataKey="parcels"
              stroke="#10b981"
              strokeWidth={2}
              name="Parcels"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
