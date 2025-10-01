'use client'

import { useAuth } from '@/context/auth-provider'
import { Office } from '@/types/office'
import React, { createContext, useContext, useEffect, useState } from 'react'

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
          setSelectedOffice(data.data.offices)
        } else if (data.data.offices.length > 0) {
          // Try to restore previously selected office from localStorage
          const savedOfficeId = localStorage.getItem('selectedOfficeId')
          const savedOffice = data.data.offices.find((office: Office) => office.id === savedOfficeId)
          setSelectedOffice(savedOffice || data.data.offices)
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
