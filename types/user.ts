export enum UserRoleType {
  ADMIN = 'Admin',
  SUPERVISOR = 'Supervisor',
  OFFICE_USER = 'OfficeUser',
  DELIVERY_CENTER_USER = 'DeliveryCenterUser',
}

export type Permission =
  | 'users:create'
  | 'users:read'
  | 'users:update'
  | 'users:delete'
  | 'invoices:read'
  | 'invoices:approve';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  employeeId: string;
  department: string;
  isActive: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  preferences: UserPreferences;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en-US';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboardLayout?: 'compact' | 'spacious';
}

export interface UserRole {
  id: string;
  role: UserRoleType;
  officeId?: string;
  deliveryCenterId?: string;
  permissions: Permission[];
  isActive: boolean;
  assignedAt: Date;
  validFrom: Date;
  validUntil?: Date;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  employeeId: string;
  department: string;
  roles: Array<{
    role: UserRoleType;
    officeId?: string;
    deliveryCenterId?: string;
    permissions: Permission[];
  }>;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  isActive?: boolean;
  preferences?: Partial<UserPreferences>;
}
