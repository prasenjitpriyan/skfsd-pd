import { User } from './user'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    user: User
    token: string
    expiresAt: string
  }
}

export interface GoogleAuthRequest {
  googleToken: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface VerifyOTPRequest {
  email: string
  otp: string
  newPassword: string
}

export interface AuthSession {
  id: string
  userId: string
  token: string
  refreshToken: string
  expiresAt: Date
  isActive: boolean
  deviceInfo: {
    userAgent: string
    browser: string
    os: string
    deviceType: 'desktop' | 'mobile' | 'tablet'
  }
  locationInfo: {
    ipAddress: string
    country?: string
    city?: string
    timezone: string
  }
}
