'use client'

import { User } from '@/types/user'
import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { toast } from "sonner"

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

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
        toast.success("Welcome back!", {
          description: `Logged in as ${data.data.user.firstName} ${data.data.user.lastName}`,
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
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.data.user })
        toast.success("Welcome back!", {
          description: "Successfully logged in with Google",
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
      toast("Logged out", {
        description: "You have been successfully logged out",
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
