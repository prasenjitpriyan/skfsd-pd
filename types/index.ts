// ===============================
// API & Error Handling
// ===============================

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string | number;
    message: string;
    details?: unknown;
  };
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  timeout?: number;
  data?: Record<string, unknown> | FormData | Blob | string;
}

export class AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;

  constructor(message: string, code?: string, statusCode?: number, details?: unknown) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ===============================
// User & Auth Types
// ===============================

export type UserRole = 'admin' | 'employee' | 'supervisor' | 'manager';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

// ===============================
// UI Notifications
// ===============================

export const NOTIFICATION_TYPES = [
  'info',
  'success',
  'warning',
  'error',
  'drm_submitted',
  'drm_approved',
  'drm_rejected',
  'metrics_reminder',
  'target_achieved',
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}
