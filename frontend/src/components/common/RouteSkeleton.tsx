import { LoadingSpinner } from './LoadingSpinner'

export function RouteSkeleton() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

