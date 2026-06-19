import { Skeleton } from './ui/skeleton'
import { cn } from '../lib/utils'

interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

export function LoadingSkeleton({ lines = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn(index === 0 ? 'h-4 w-2/3' : 'h-3 w-full')} />
      ))}
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-2xl bg-[var(--surface)] p-5 ring-1 ring-[var(--ring)]/10">
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="mb-3 h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DeveloperSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="rounded-2xl bg-[var(--surface)] p-5 ring-1 ring-[var(--ring)]/10">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function NotificationSkeleton() {
  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--ring)]/10">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex items-start gap-3 border-b border-[var(--border)] p-4 last:border-b-0">
          <Skeleton className="mt-1 h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TechnologySkeleton() {
  return (
    <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="rounded-2xl bg-[var(--surface)] p-5 ring-1 ring-[var(--ring)]/10">
          <Skeleton className="mb-4 h-5 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
