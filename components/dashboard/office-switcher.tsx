'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/context/auth-provider'
import { Building2 } from 'lucide-react'
import { useState } from 'react'

// Sample offices - in real app, this would come from API/context
const offices = [
  { id: '1', name: 'South Kolkata GPO', code: 'SK001' },
  { id: '2', name: 'Ballygunge SO', code: 'BG002' },
  { id: '3', name: 'Gariahat SO', code: 'GH003' },
  { id: '4', name: 'New Market SO', code: 'NM004' },
  { id: '5', name: 'Esplanade SO', code: 'ES005' },
]

export function OfficeSwitcher() {
  const { user } = useAuth()
  const [selectedOffice, setSelectedOffice] = useState('1')

const canSwitchOffices = ['Supervisor', 'Admin'].includes(user?.role ?? '')

  if (!canSwitchOffices) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedOffice} onValueChange={setSelectedOffice}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select office" />
        </SelectTrigger>
        <SelectContent>
          {offices.map((office) => (
            <SelectItem key={office.id} value={office.id}>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{office.name}</span>
                <span className="text-sm text-muted-foreground">({office.code})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
