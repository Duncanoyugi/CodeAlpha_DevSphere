import { useFeed } from '../hooks/useFeed'
import { FeedPost } from './FeedPost'
import { FeedSkeleton } from './FeedSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { Button } from '../../../components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Feed() {
  const navigate = useNavigate()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useFeed()

  if (isLoading) {
    return <FeedSkeleton />
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">Failed to load feed. Please try again.</p>
      </div>
    )
  }

  const posts = data?.pages.flatMap((page) => page.posts) || []

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description="Follow developers and technologies to see their posts in your feed."
        icon={<Plus className="h-12 w-12 text-muted-foreground" />}
        action={
          <Button onClick={() => navigate('/search')}>
            Find Developers to Follow
          </Button>
        }
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {posts.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}
      
      {hasNextPage && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}