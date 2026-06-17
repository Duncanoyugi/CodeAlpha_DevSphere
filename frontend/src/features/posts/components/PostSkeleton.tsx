import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'

export function PostSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex gap-4">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
      </CardFooter>
    </Card>
  )
}