export interface Target {
  id: string
  officeId: string
  officeName?: string
  financialYear: string
  targets: Record<string, {
    target: number
    unit: string
    priority: 'low' | 'medium' | 'high' | 'critical'
  }>
  status: 'active' | 'archived' | 'revised'
  setBy: string
  approvedBy?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface TargetProgress {
  officeId: string
  officeName: string
  financialYear: string
  metrics: Array<{
    name: string
    target: number
    current: number
    percentage: number
    unit: string
    priority: string
    status: 'on_track' | 'behind' | 'ahead' | 'critical'
    projectedCompletion: number
    monthlyAverage: number
  }>
  overallProgress: {
    percentage: number
    status: 'on_track' | 'behind' | 'ahead'
    riskFactors: string[]
  }
}

export interface SetTargetsRequest {
  officeId: string
  financialYear: string
  targets: Record<string, {
    target: number
    unit: string
    priority: 'low' | 'medium' | 'high' | 'critical'
  }>
  notes?: string
}

export interface TargetAnalytics {
  period: 'monthly' | 'quarterly' | 'yearly'
  data: Array<{
    period: string
    achievements: Record<string, number>
    targets: Record<string, number>
    percentages: Record<string, number>
  }>
  trends: Record<string, {
    direction: 'increasing' | 'decreasing' | 'stable'
    rate: number
    significance: 'high' | 'medium' | 'low'
  }>
}
