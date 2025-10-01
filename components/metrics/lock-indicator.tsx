'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Lock, Unlock } from 'lucide-react'

interface LockIndicatorProps {
  isLocked: boolean
  lockTime?: Date
  className?: string
}

export function LockIndicator({ isLocked, className }: LockIndicatorProps) {
  if (isLocked) {
    return (
      <Badge variant="destructive" className={cn("text-xs", className)}>
        <Lock className="w-3 h-3 mr-1" />
        Locked
      </Badge>
    )
  }

  return (
    <Badge variant="success" className={cn("text-xs", className)}>
      <Unlock className="w-3 h-3 mr-1" />
      Unlocked
    </Badge>
  )
}
