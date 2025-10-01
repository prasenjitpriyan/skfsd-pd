export interface AuditLog {
  id: string
  entityType: 'DailyMetric' | 'DRMEntry' | 'User' | 'Office' | 'Target'
  entityId: string
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
  userId: string
  userEmail: string
  userRole: string
  changes: Array<{
    field: string
    oldValue: unknown | null
    newValue: unknown | null
    changeType: 'value_update' | 'timestamp_update' | 'status_change'
  }>
  requestMetadata: {
    ipAddress: string
    userAgent: string
    sessionId: string
    requestId: string
    endpoint: string
    method: string
  }
  contextData: {
    officeId?: string
    officeName?: string
    reason?: string
    businessJustification?: string
  }
  severity: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL'
  category: 'authentication' | 'authorization' | 'data_modification' | 'system_operation'
  isSystemGenerated: boolean
  retentionDate: Date
  timestamp: Date
}

export interface AuditQuery {
  entityType?: string
  entityId?: string
  userId?: string
  action?: string
  severity?: string
  category?: string
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AuditSummary {
  totalEvents: number
  eventsByType: Record<string, number>
  eventsBySeverity: Record<string, number>
  topUsers: Array<{
    userId: string
    userEmail: string
    eventCount: number
  }>
  timeline: Array<{
    date: string
    count: number
  }>
}

export interface PDFRecord {
  id: string
  entityType: 'DRMEntry' | 'DailyMetric' | 'Report'
  entityId: string
  fileName: string
  originalFileName: string
  filePath: string
  fileSize: number
  mimeType: string
  fileHash: string
  generationParameters: {
    template: string
    includeSignatures: boolean
    includeAttachments: boolean
    watermark?: string
    quality: 'low' | 'medium' | 'high'
  }
  generatedBy: string
  purpose: 'submission' | 'archive' | 'review' | 'audit'
  accessControl: {
    visibility: 'public' | 'office' | 'admin' | 'private'
    allowedRoles: string[]
    allowedUsers: string[]
    expiresAt?: Date
  }
  downloadHistory: Array<{
    userId: string
    timestamp: Date
    ipAddress: string
    userAgent: string
  }>
  downloadCount: number
  isArchived: boolean
  archiveDate?: Date
  metadata: {
    pageCount: number
    containsSignatures: boolean
    signatureCount: number
    version: string
    relatedDocuments: string[]
  }
  createdAt: Date
  updatedAt: Date
}
