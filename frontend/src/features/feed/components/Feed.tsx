import { useFeed, useTrendingFeed } from '../hooks/useFeed'
import { useSavedPosts } from '../../../features/bookmarks/hooks/useSavedPosts'
import { useDevelopersFeed } from '../hooks/useDevelopersFeed'
import { FeedPost } from './FeedPost'
import { FeedSkeleton } from './FeedSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { Button } from '../../../components/ui/button'
import { Plus, Bookmark, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface FeedProps {
  feedType?: 'home' | 'trending' | 'saved' | 'developers'
}

export function Feed({ feedType = 'home' }: FeedProps) {
  const navigate = useNavigate()
  
  const isHomeFeed = feedType === 'home'
  const isTrendingFeed = feedType === 'trending'
  const isSavedFeed = feedType === 'saved'
  const isDeveloperFeed = feedType === 'developers'

  const { data: homeData, fetchNextPage: fetchNextHome, hasNextPage: homeHasNext, isFetchingNextPage: homeFetching, isLoading: homeLoading, error: homeError } = useFeed()
  const { data: trendingData, fetchNextPage: fetchNextTrending, hasNextPage: trendingHasNext, isFetchingNextPage: trendingFetching, isLoading: trendingLoading, error: trendingError } = useTrendingFeed()
  const { data: savedData, fetchNextPage: fetchNextSaved, hasNextPage: savedHasNext, isFetchingNextPage: savedFetching, isLoading: savedLoading, error: savedError } = useSavedPosts()
  const { data: developersData, fetchNextPage: fetchNextDev, hasNextPage: devHasNext, isFetchingNextPage: devFetching, isLoading: devLoading, error: devError } = useDevelopersFeed()

  const data = isHomeFeed ? homeData : isTrendingFeed ? trendingData : isSavedFeed ? savedData : developersData
  const fetchNextPage = isHomeFeed ? fetchNextHome : isTrendingFeed ? fetchNextTrending : isSavedFeed ? fetchNextSaved : fetchNextDev
  const hasNextPage = isHomeFeed ? homeHasNext : isTrendingFeed ? trendingHasNext : isSavedFeed ? savedHasNext : devHasNext
  const isFetchingNextPage = isHomeFeed ? homeFetching : isTrendingFeed ? trendingFetching : isSavedFeed ? savedFetching : devFetching
  const isLoading = isHomeFeed ? homeLoading : isTrendingFeed ? trendingLoading : isSavedFeed ? savedLoading : devLoading
  const error = isHomeFeed ? homeError : isTrendingFeed ? trendingError : isSavedFeed ? savedError : devError

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

  const posts = (data?.pages ?? []).flatMap((page: any) => page.posts || []) || []

  const emptyTitle = isSavedFeed ? 'No saved posts' : isDeveloperFeed ? 'No posts from followed developers' : 'No posts yet'
  const emptyDesc = isSavedFeed 
    ? 'Save posts to read them later.' 
    : isDeveloperFeed
    ? 'Follow developers to see their posts here.'
    : 'Follow developers and technologies to see their posts in your feed.'

  if (posts.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDesc}
        icon={isSavedFeed ? <Bookmark className="h-12 w-12 text-muted-foreground" /> : isDeveloperFeed ? <Users className="h-12 w-12 text-muted-foreground" /> : <Plus className="h-12 w-12 text-muted-foreground" />}
        action={
          isSavedFeed ? undefined : (
            <Button onClick={() => navigate('/search')}>
              Find Developers to Follow
            </Button>
          )
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