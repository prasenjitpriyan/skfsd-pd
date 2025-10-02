export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export class AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

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

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  authorId?: string;
  authorName?: string;
  fileUrl?: string; // URL to the report file (PDF, etc.)
  metadata?: Record<string, unknown>; // Additional optional metadata
}
