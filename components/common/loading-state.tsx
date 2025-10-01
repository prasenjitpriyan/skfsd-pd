import { Spinner } from '@/components/ui/spinner'

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Spinner className="h-8 w-8 mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
