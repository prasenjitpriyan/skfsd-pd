# Context Providers and Hooks

## src/context/auth-context.tsx
```tsx
'use client'

import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { User, LoginCredentials } from '@/types'
import { toast } from '@/components/ui/toast'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user })
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      dispatch({ type: 'LOGOUT' })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.data.user })
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${data.data.user.firstName} ${data.data.user.lastName}`,
          variant: 'success',
        })
      } else {
        throw new Error(data.error?.message || 'Login failed')
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // In a real implementation, this would integrate with Google OAuth
      // For now, we'll simulate the flow
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.data.user })
        toast({
          title: 'Welcome back!',
          description: 'Successfully logged in with Google',
          variant: 'success',
        })
      } else {
        throw new Error(data.error?.message || 'Google login failed')
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      })
    }
  }

  const updateUser = (updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates })
  }

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.data.user })
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      dispatch({ type: 'LOGOUT' })
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    loginWithGoogle,
    logout,
    updateUser,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

## src/context/theme-context.tsx
```tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'skfsd-ui-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage?.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system' && enableSystem) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme, enableSystem])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage?.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
```

## src/context/office-context.tsx
```tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Office } from '@/types'
import { useAuth } from './auth-context'

interface OfficeContextType {
  selectedOffice: Office | null
  availableOffices: Office[]
  setSelectedOffice: (office: Office) => void
  isLoading: boolean
  canSwitchOffices: boolean
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined)

export function OfficeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null)
  const [availableOffices, setAvailableOffices] = useState<Office[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const canSwitchOffices = user?.roles.some(role => 
    ['Supervisor', 'Admin'].includes(role.role)
  ) ?? false

  useEffect(() => {
    if (user) {
      fetchAvailableOffices()
    }
  }, [user])

  const fetchAvailableOffices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/offices', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableOffices(data.data.offices)
        
        // Auto-select first office if user can only access one
        if (data.data.offices.length === 1) {
          setSelectedOffice(data.data.offices[0])
        } else if (data.data.offices.length > 0) {
          // Try to restore previously selected office from localStorage
          const savedOfficeId = localStorage.getItem('selectedOfficeId')
          const savedOffice = data.data.offices.find((office: Office) => office.id === savedOfficeId)
          setSelectedOffice(savedOffice || data.data.offices[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch offices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetSelectedOffice = (office: Office) => {
    setSelectedOffice(office)
    localStorage.setItem('selectedOfficeId', office.id)
  }

  const value: OfficeContextType = {
    selectedOffice,
    availableOffices,
    setSelectedOffice: handleSetSelectedOffice,
    isLoading,
    canSwitchOffices,
  }

  return (
    <OfficeContext.Provider value={value}>
      {children}
    </OfficeContext.Provider>
  )
}

export const useOffice = () => {
  const context = useContext(OfficeContext)
  if (context === undefined) {
    throw new Error('useOffice must be used within an OfficeProvider')
  }
  return context
}
```

## src/hooks/use-auth.ts
```typescript
import { useContext } from 'react'
import { AuthContext } from '@/context/auth-context'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

## src/hooks/use-api.ts
```typescript
'use client'

import { useState, useCallback } from 'react'
import { ApiResponse, ApiError } from '@/types'
import { useAuth } from './use-auth'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
  showToast?: boolean
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const { refreshToken } = useAuth()

  const request = useCallback(async <T = any>(
    url: string,
    options: RequestInit = {},
    apiOptions: UseApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      // Handle token refresh if needed
      if (response.status === 401) {
        try {
          await refreshToken()
          // Retry the request
          const retryResponse = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
          })
          
          if (!retryResponse.ok) {
            throw new Error('Request failed after token refresh')
          }
          
          const retryData = await retryResponse.json()
          apiOptions.onSuccess?.(retryData.data)
          return retryData
        } catch (refreshError) {
          // Refresh failed, redirect to login
          window.location.href = '/login'
          throw refreshError
        }
      }

      const data: ApiResponse<T> = await response.json()

      if (!response.ok) {
        const apiError: ApiError = {
          code: data.error?.code || 'UNKNOWN_ERROR',
          message: data.error?.message || 'An error occurred',
          statusCode: response.status,
          details: data.error?.details,
        }
        
        setError(apiError)
        apiOptions.onError?.(apiError)
        throw apiError
      }

      apiOptions.onSuccess?.(data.data)
      return data
    } catch (err) {
      const apiError: ApiError = err instanceof Error 
        ? {
            code: 'NETWORK_ERROR',
            message: err.message,
            statusCode: 0,
          }
        : {
            code: 'UNKNOWN_ERROR',
            message: 'An unknown error occurred',
            statusCode: 0,
          }

      setError(apiError)
      apiOptions.onError?.(apiError)
      throw apiError
    } finally {
      setIsLoading(false)
    }
  }, [refreshToken])

  const get = useCallback(<T = any>(url: string, options?: UseApiOptions) => 
    request<T>(url, { method: 'GET' }, options), [request])

  const post = useCallback(<T = any>(url: string, data?: any, options?: UseApiOptions) => 
    request<T>(url, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }, options), [request])

  const put = useCallback(<T = any>(url: string, data?: any, options?: UseApiOptions) => 
    request<T>(url, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }, options), [request])

  const del = useCallback(<T = any>(url: string, options?: UseApiOptions) => 
    request<T>(url, { method: 'DELETE' }, options), [request])

  return {
    request,
    get,
    post,
    put,
    delete: del,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
```

## src/hooks/use-debounce.ts
```typescript
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

## src/hooks/use-local-storage.ts
```typescript
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}
```

## src/hooks/use-pagination.ts
```typescript
import { useState, useMemo } from 'react'

interface UsePaginationProps {
  totalItems: number
  itemsPerPage?: number
  initialPage?: number
}

export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginationInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      startIndex,
      endIndex,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
    }
  }, [currentPage, totalPages, totalItems, itemsPerPage])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => {
    if (paginationInfo.hasNext) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (paginationInfo.hasPrev) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const reset = () => {
    setCurrentPage(1)
  }

  return {
    ...paginationInfo,
    goToPage,
    nextPage,
    prevPage,
    reset,
  }
}
```

## src/hooks/use-permissions.ts
```typescript
import { useMemo } from 'react'
import { useAuth } from './use-auth'

export function usePermissions() {
  const { user } = useAuth()

  const permissions = useMemo(() => {
    if (!user) return []
    
    return user.roles.flatMap(role => role.permissions)
  }, [user])

  const roles = useMemo(() => {
    if (!user) return []
    
    return user.roles.map(role => role.role)
  }, [user])

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission) || permissions.includes('*')
  }

  const hasRole = (role: string): boolean => {
    return roles.includes(role)
  }

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.some(role => hasRole(role))
  }

  const hasAllRoles = (requiredRoles: string[]): boolean => {
    return requiredRoles.every(role => hasRole(role))
  }

  const canAccessOffice = (officeId: string): boolean => {
    if (hasRole('Admin')) return true
    
    return user?.roles.some(role => 
      role.officeId === officeId || 
      (role.role === 'Supervisor' && role.officeId === officeId)
    ) ?? false
  }

  return {
    permissions,
    roles,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccessOffice,
    isAdmin: hasRole('Admin'),
    isSupervisor: hasRole('Supervisor'),
    isOfficeUser: hasRole('OfficeUser'),
    isDeliveryCenterUser: hasRole('DeliveryCenterUser'),
  }
}
```