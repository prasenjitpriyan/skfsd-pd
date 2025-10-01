'use client'

import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetTime: Date
}

export function CountdownTimer({ targetTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(targetTime.getTime() - Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = targetTime.getTime() - Date.now()
      setTimeLeft(remaining)

      if (remaining <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetTime])

  if (timeLeft <= 0) {
    return (
      <div className="flex items-center text-red-600">
        <Clock className="mr-2 h-4 w-4" />
        <span className="font-mono text-lg">Time Expired</span>
      </div>
    )
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  const isUrgent = timeLeft < 2 * 60 * 60 * 1000 // Less than 2 hours

  return (
    <div className={`flex items-center ${isUrgent ? 'text-red-600' : 'text-green-600'}`}>
      <Clock className="mr-2 h-4 w-4" />
      <span className="font-mono text-lg">
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}
