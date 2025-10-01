import { MetricsChart } from '@/components/dashboard/metrics-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { TargetProgress } from '@/components/dashboard/target-progress'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Overview',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your SKFSD Portal dashboard
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MetricsChart />
        </div>
        <div>
          <TargetProgress />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
      </div>
    </div>
  )
}
