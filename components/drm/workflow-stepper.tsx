'use client'

import { cn } from '@/lib/utils'
import { DRMEntry } from '@/types/drm'
import { AlertTriangle, Check, Clock, X } from 'lucide-react'

interface WorkflowStepperProps {
  currentStatus: DRMEntry['status']
  workflow: DRMEntry['workflow']
  size?: 'sm' | 'md' | 'lg'
}

const workflowSteps = [
  { key: 'Draft', label: 'Draft', description: 'Entry created' },
  { key: 'Submitted', label: 'Submitted', description: 'Submitted for review' },
  { key: 'Scrutinized', label: 'Scrutinized', description: 'Under review' },
  { key: 'Finalized', label: 'Finalized', description: 'Approved and finalized' },
]

export function WorkflowStepper({ currentStatus, workflow, size = 'md' }: WorkflowStepperProps) {
  const getStepStatus = (stepKey: string) => {
    const stepIndex = workflowSteps.findIndex(step => step.key === stepKey)
    const currentIndex = workflowSteps.findIndex(step => step.key === currentStatus)

    if (currentStatus === 'Rejected') {
      return stepIndex <= 1 ? 'completed' : 'rejected'
    }

    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  const getStepIcon = (stepKey: string, status: string) => {
    if (status === 'completed') return <Check className="h-3 w-3" />
    if (status === 'current') return <Clock className="h-3 w-3" />
    if (status === 'rejected') return <X className="h-3 w-3" />
    return <div className="h-3 w-3 rounded-full border-2 border-current" />
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {workflowSteps.map((step, index) => {
          const status = getStepStatus(step.key)

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'rounded-full border-2 flex items-center justify-center',
                    iconSizes[size],
                    {
                      'bg-green-500 border-green-500 text-white': status === 'completed',
                      'bg-blue-500 border-blue-500 text-white': status === 'current',
                      'bg-red-500 border-red-500 text-white': status === 'rejected',
                      'border-gray-300 text-gray-400': status === 'pending',
                    }
                  )}
                >
                  {getStepIcon(step.key, status)}
                </div>

                {size !== 'sm' && (
                  <div className="mt-2 text-center">
                    <div
                      className={cn(
                        'font-medium',
                        sizeClasses[size],
                        {
                          'text-green-600': status === 'completed',
                          'text-blue-600': status === 'current',
                          'text-red-600': status === 'rejected',
                          'text-gray-400': status === 'pending',
                        }
                      )}
                    >
                      {step.label}
                    </div>
                    {size === 'lg' && (
                      <div className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {index < workflowSteps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {currentStatus === 'Rejected' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm text-red-800">
              Entry was rejected{workflow.rejectionReason && `: ${workflow.rejectionReason}`}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
