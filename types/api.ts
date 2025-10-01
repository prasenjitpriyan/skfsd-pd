export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Array<{
      field: string
      message: string
    }>
  }
  meta?: {
    pagination?: {
      currentPage: number
      totalPages: number
      totalItems: number
      hasNext: boolean
      hasPrev: boolean
    }
    timestamp: string
    requestId: string
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  status?: string
  startDate?: string
  endDate?: string
  officeId?: string
  userId?: string
}

export interface ApiError {
  code: string
  message: string
  statusCode: number
  details?: unknown | null | Array<{
    field: string
    message: string
  }>
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  version: string
  services: {
    database: 'healthy' | 'degraded' | 'unhealthy'
    redis: 'healthy' | 'degraded' | 'unhealthy'
    email: 'healthy' | 'degraded' | 'unhealthy'
  }
}

export interface ExportRequest {
  type: 'daily-metrics' | 'drm-entries' | 'targets' | 'audit-logs'
  format: 'csv' | 'json' | 'pdf' | 'excel'
  filters?: FilterParams
  includeHeaders?: boolean
  dateRange?: {
    start: string
    end: string
  }
}

export interface ExportResponse {
  success: boolean
  downloadUrl: string
  fileName: string
  fileSize: number
  recordCount: number
  expiresAt: string
}

export interface BulkOperationRequest {
  action: 'create' | 'update' | 'delete'
  items: Array<{
    id?: string
    data: unknown | null
  }>
  options?: {
    skipValidation?: boolean
    continueOnError?: boolean
    returnDetails?: boolean
  }
}

export interface BulkOperationResponse {
  success: boolean
  processed: number
  succeeded: number
  failed: number
  errors?: Array<{
    index: number
    id?: string
    error: string
  }>
}
