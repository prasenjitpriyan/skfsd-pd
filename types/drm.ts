export interface DRMEntry {
  id: string
  officeId: string
  officeName?: string
  entryNumber: string
  month: number
  year: number
  title: string
  description: string
  category: 'revenue' | 'expenditure' | 'savings' | 'insurance' | 'other'
  amount: number
  currency: string
  attachments: Array<{
    fileName: string
    fileSize: number
    uploadedAt: Date
    uploadedBy: string
  }>
  status: 'Draft' | 'Submitted' | 'Scrutinized' | 'Finalized' | 'Rejected'
  workflow: {
    createdBy: string
    createdAt: Date
    submittedBy?: string
    submittedAt?: Date
    scrutinizedBy?: string
    scrutinizedAt?: Date
    finalizedBy?: string
    finalizedAt?: Date
    rejectedBy?: string
    rejectedAt?: Date
    rejectionReason?: string
  }
  comments: Array<{
    userId: string
    comment: string
    timestamp: Date
    type: 'review' | 'clarification' | 'approval' | 'rejection'
  }>
  digitalSignatures: Array<{
    userId: string
    signature: string
    timestamp: Date
    ipAddress: string
  }>
  approvalHierarchy: Array<{
    level: number
    role: string
    userId: string
    status: 'pending' | 'approved' | 'rejected'
    timestamp?: Date
  }>
  metadata: {
    priority: 'low' | 'normal' | 'high' | 'urgent'
    deadline?: Date
    tags: string[]
    relatedEntries: string[]
  }
  createdAt: Date
  updatedAt: Date
  version: number
}

export interface CreateDRMRequest {
  officeId: string
  month: number
  year: number
  title: string
  description: string
  category: DRMEntry['category']
  amount: number
  metadata?: Partial<DRMEntry['metadata']>
}

export interface UpdateDRMRequest {
  title?: string
  description?: string
  amount?: number
  category?: DRMEntry['category']
  metadata?: Partial<DRMEntry['metadata']>
}

export interface SubmitDRMRequest {
  comments?: string
}

export interface ReviewDRMRequest {
  action: 'approve' | 'reject'
  comments: string
}

export interface DRMWorkflowState {
  currentStatus: DRMEntry['status']
  nextActions: Array<{
    action: string
    label: string
    requiredRole: string
    description: string
  }>
  canEdit: boolean
  canSubmit: boolean
  canReview: boolean
  canFinalize: boolean
}
