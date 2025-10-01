export interface DailyMetric {
  id: string
  officeId: string
  officeName?: string
  date: Date
  metrics: {
    lettersDelivered: number
    parcelsDelivered: number
    speedPostItems: number
    moneyOrders: number
    revenueCollected: number
    savingsAccounts: number
    insurancePolicies: number
    customMetrics?: Record<string, number>
  }
  isLocked: boolean
  lockedAt?: Date
  lockedBy?: string
  submissionType: 'manual' | 'csv_import' | 'api'
  validationStatus: 'valid' | 'has_warnings' | 'has_errors'
  validationNotes?: string[]
  weather?: {
    condition: string
    temperature: number
    humidity: number
  }
  staffOnDuty?: {
    postmen: number
    clerks: number
    supervisors: number
  }
  createdBy: string
  createdAt: Date
  updatedAt: Date
  version: number
}

export interface MetricDefinition {
  key: string
  name: string
  unit: string
  category: 'delivery' | 'financial' | 'customer_service' | 'custom'
  required: boolean
  validationRules?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface SubmitMetricsRequest {
  officeId: string
  date: string
  metrics: Record<string, number>
  weather?: DailyMetric['weather']
  staffOnDuty?: DailyMetric['staffOnDuty']
}

export interface MetricsHistory {
  officeId: string
  startDate: Date
  endDate: Date
  metrics: DailyMetric[]
  summary: {
    totalDays: number
    lockedDays: number
    averages: Record<string, number>
    totals: Record<string, number>
  }
}

export interface CSVImportRequest {
  file: File
  officeId: string
  columnMapping: Record<string, string>
  overwriteExisting: boolean
}

export interface CSVImportResult {
  success: boolean
  processed: number
  imported: number
  skipped: number
  errors: Array<{
    row: number
    field: string
    message: string
  }>
}
