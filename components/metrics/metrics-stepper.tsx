'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  title: string
  description: string
  fields: string[]
}

interface MetricsStepperProps {
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function MetricsStepper({ steps, currentStep, onStepClick }: MetricsStepperProps) {
  return (
    <nav className="flex items-center justify-center space-x-4" aria-label="Progress">
      {steps.map((step, index) => (
        <div key={step.title} className="flex items-center">
          <div
            className={cn(
              'flex items-center cursor-pointer transition-colors duration-200',
              index <= currentStep ? 'text-primary' : 'text-muted-foreground'
            )}
            onClick={() => onStepClick(index)}
          >
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium',
                index < currentStep
                  ? 'bg-primary text-primary-foreground border-primary'
                  : index === currentStep
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-muted text-muted-foreground'
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="ml-3 hidden sm:block">
              <div
                className={cn(
                  'text-sm font-medium',
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {step.description}
              </div>
            </div>
          </div>

          {index < steps.length - 1 && (
            <div
              className={cn(
                'ml-4 h-0.5 w-8 hidden sm:block',
                index < currentStep ? 'bg-primary' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </nav>
  )
}
