import { ReactNode } from 'react';

/** ======================================================
 *  UTILITIES
 * ====================================================== */

export type ID = string;
export type Timestamp = string; // ISO 8601 datetime
export type Dictionary<T = unknown> = Record<string, T>;

/** ======================================================
 *  API BASE TYPES
 * ====================================================== */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/** ======================================================
 *  USER TYPES
 * ====================================================== */

export type UserRole =
  | 'Admin'
  | 'Supervisor'
  | 'OfficeUser'
  | 'DeliveryCenterUser';

export interface UserRoleInfo {
  role: UserRole;
  permissions: string[];
  officeId?: ID;
  deliveryCenterId?: ID;
  isActive: boolean;
  assignedAt: Timestamp;
  validFrom: Timestamp;
  validTo?: Timestamp | null;
}

export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: Timestamp | null;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'hi' | 'bn';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  roles: UserRoleInfo[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AuthUser {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: Timestamp;
}

/** ======================================================
 *  OFFICE & DELIVERY CENTER TYPES
 * ====================================================== */

export interface Office {
  id: ID;
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  phone: string;
  email: string;
  isActive: boolean;
  metadata: {
    region: string;
    divisionCode: string;
    establishedDate: Timestamp;
    officerInCharge?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DeliveryCenter {
  id: ID;
  name: string;
  code: string;
  officeId: ID;
  address: {
    street: string;
    area: string;
    pincode: string;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** ======================================================
 *  METRICS TYPES
 * ====================================================== */

export interface DailyMetrics {
  id: ID;
  officeId: ID;
  date: Timestamp;
  isLocked: boolean;
  metrics: {
    lettersDelivered: number;
    parcelsDelivered: number;
    speedPostItems: number;
    moneyOrders: number;
    revenueCollected: number;
    savingsAccounts: number;
    insurancePolicies: number;
  };
  weather?: {
    condition: string;
    temperature: number;
    humidity: number;
  };
  staffOnDuty: {
    postmen: number;
    clerks: number;
    supervisors: number;
  };
  submissionType: 'manual' | 'csv_import' | 'api';
  validationStatus: 'valid' | 'invalid' | 'pending_review';
  validationErrors?: string[];
  createdBy: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
}

export interface MetricsTarget {
  id: ID;
  officeId: ID;
  financialYear: number;
  targetType: 'monthly' | 'quarterly' | 'annual';
  targets: {
    lettersDelivered: number;
    parcelsDelivered: number;
    revenueCollection: number;
    newSavingsAccounts: number;
    insurancePolicies: number;
  };
  status: 'active' | 'archived' | 'draft';
  createdBy: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** ======================================================
 *  DRM TYPES
 * ====================================================== */

export type DRMStatus =
  | 'Draft'
  | 'Submitted'
  | 'Scrutinized'
  | 'Finalized'
  | 'Rejected';

export type DRMCategory =
  | 'revenue'
  | 'expenditure'
  | 'savings'
  | 'insurance'
  | 'other';

export type DRMPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface DRMEntry {
  id: ID;
  entryNumber: string;
  officeId: ID;
  title: string;
  description: string;
  category: DRMCategory;
  amount: number;
  month: number;
  year: number;
  status: DRMStatus;
  workflow: {
    createdBy: ID;
    createdAt: Timestamp;
    submittedAt?: Timestamp;
    submittedBy?: ID;
    reviewedAt?: Timestamp;
    reviewedBy?: ID;
    finalizedAt?: Timestamp;
    finalizedBy?: ID;
    rejectedAt?: Timestamp;
    rejectedBy?: ID;
    rejectionReason?: string;
  };
  metadata: {
    priority: DRMPriority;
    deadline?: Timestamp;
    tags: string[];
  };
  comments: DRMComment[];
  attachments: FileAttachment[];
  digitalSignatures: DigitalSignature[];
  approvalHierarchy: ApprovalLevel[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
}

export interface DRMComment {
  id: ID;
  userId: ID;
  userName: string;
  comment: string;
  createdAt: Timestamp;
}

export interface ApprovalLevel {
  level: number;
  role: UserRole;
  userId?: ID;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: Timestamp;
  comments?: string;
}

export interface DigitalSignature {
  userId: ID;
  userName: string;
  signedAt: Timestamp;
  signature: string;
  certificateHash: string;
}

/** ======================================================
 *  FILE TYPES
 * ====================================================== */

export interface FileAttachment {
  id: ID;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: ID;
  uploadedAt: Timestamp;
}

export interface FileUploadResponse {
  success: boolean;
  file?: FileAttachment;
  error?: string;
}

/** ======================================================
 *  AUDIT LOG TYPES
 * ====================================================== */

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW'
  | 'DOWNLOAD'
  | 'UPLOAD'
  | 'APPROVE'
  | 'REJECT'
  | 'SUBMIT'
  | 'LOCK'
  | 'UNLOCK';

export type AuditSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface AuditLog {
  id: ID;
  entityType: string;
  entityId: ID;
  action: AuditAction;
  userId: ID;
  userEmail: string;
  userRole: string;
  changes: AuditChange[];
  requestMetadata: {
    ipAddress: string;
    userAgent: string;
    sessionId: string;
    requestId: string;
    endpoint: string;
    method: string;
  };
  contextData: {
    officeId?: ID;
    reason?: string;
    additionalInfo?: Dictionary;
  };
  severity: AuditSeverity;
  category: string;
  isSystemGenerated: boolean;
  retentionDate: Timestamp;
  timestamp: Timestamp;
}

export interface AuditChange {
  field: string;
  oldValue?: unknown;
  newValue?: unknown;
}

/** ======================================================
 *  PDF TYPES
 * ====================================================== */

export interface PDFRecord {
  id: ID;
  entityType: string;
  entityId: ID;
  fileName: string;
  title: string;
  template: string;
  generatedBy: ID;
  generatedAt: Timestamp;
  fileSize: number;
  url: string;
  isArchived: boolean;
  expiresAt?: Timestamp;
}

export interface PDFGenerationRequest {
  template: string;
  data: Dictionary;
  options?: {
    format?: 'A4' | 'A3' | 'Letter';
    orientation?: 'portrait' | 'landscape';
    margins?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
}

/** ======================================================
 *  NOTIFICATION TYPES
 * ====================================================== */

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'drm_submitted'
  | 'drm_approved'
  | 'drm_rejected'
  | 'metrics_reminder'
  | 'target_achieved';

export interface Notification {
  id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  message: string;
  data?: Dictionary;
  read: boolean;
  createdAt: Timestamp;
}

/** ======================================================
 *  FORM & UI TYPES
 * ====================================================== */

export interface FormState<T = unknown> {
  data: T;
  errors: Record<string, string>;
  isLoading: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ComponentProps {
  children?: ReactNode;
  className?: string;
}

export interface ButtonProps extends ComponentProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends ComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}

export interface TableColumn<T = unknown> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  sortable?: boolean;
  render?: (value: unknown, record: T, index: number) => ReactNode;
}

/** ======================================================
 *  DASHBOARD TYPES
 * ====================================================== */

export interface DashboardStats {
  todaysMetrics: {
    lettersDelivered: number;
    parcelsDelivered: number;
    revenueCollected: number;
    change: {
      letters: number;
      parcels: number;
      revenue: number;
    };
  };
  drmEntries: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  targetProgress: {
    letters: { current: number; target: number; percentage: number };
    parcels: { current: number; target: number; percentage: number };
    revenue: { current: number; target: number; percentage: number };
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

/** ======================================================
 *  ERROR & CONTEXT TYPES
 * ====================================================== */

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

/** ======================================================
 *  API REQUEST CONFIG
 * ====================================================== */

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  timeout?: number;
}
