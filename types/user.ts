export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  employeeId: string
  department: string
  isActive: boolean
  emailVerified: boolean
  twoFactorEnabled: boolean
  lastLoginAt?: Date
  preferences: UserPreferences
  roles: UserRole[]
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  dashboardLayout?: string
}

export interface UserRole {
  id: string
  role: 'Admin' | 'Supervisor' | 'OfficeUser' | 'DeliveryCenterUser'
  officeId?: string
  officeName?: string
  deliveryCenterId?: string
  permissions: string[]
  isActive: boolean
  assignedAt: Date
  validFrom: Date
  validUntil?: Date
}

export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  phone?: string
  employeeId: string
  department: string
  roles: Array<{
    role: string
    officeId?: string
    deliveryCenterId?: string
    permissions: string[]
  }>
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  phone?: string
  department?: string
  isActive?: boolean
  preferences?: Partial<UserPreferences>
}
