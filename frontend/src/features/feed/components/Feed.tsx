import { useFeed, useTrendingFeed } from '../hooks/useFeed'
import { useSavedPosts } from '../../../features/bookmarks/hooks/useSavedPosts'
import { useDevelopersFeed } from '../hooks/useDevelopersFeed'
import { FeedPost } from './FeedPost'
import { FeedSkeleton } from './FeedSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { PageHeader } from '../../../components/PageHeader'
import { Button } from '../../../components/ui/button'
import { Plus, Bookmark, Users, Hash } from 'lucide-react'
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
      <EmptyState
        title="Feed unavailable"
        description="Failed to load posts. Please try again."
        icon={<Hash className="h-12 w-12" />}
        action={
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
      />
    )
  }

  const posts = (data?.pages ?? []).flatMap((page: any) => page.posts || []) || []

  const emptyTitle = isSavedFeed ? 'No saved posts' : isDeveloperFeed ? 'No posts from followed developers' : isTrendingFeed ? 'No trending posts yet' : 'No posts yet'
  const emptyDesc = isSavedFeed 
    ? 'Save posts to build your reading list.' 
    : isDeveloperFeed
      ? 'Follow developers to see their posts here.'
      : isTrendingFeed
        ? 'Newest posts will appear here first.'
        : 'Follow developers and technologies to personalize your feed.'

  if (posts.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDesc}
        icon={isSavedFeed ? <Bookmark className="h-12 w-12" /> : isDeveloperFeed ? <Users className="h-12 w-12" /> : <Plus className="h-12 w-12" />}
        action={
          isSavedFeed ? (
            <Button variant="outline" onClick={() => navigate('/technologies')}>
              Browse Technologies
            </Button>
          ) : (
            <Button onClick={() => navigate('/search')}>
              Find Developers to Follow
            </Button>
          )
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker={isTrendingFeed ? 'Trending' : isSavedFeed ? 'Saved' : isDeveloperFeed ? 'Following' : 'Feed'}
        title={isTrendingFeed ? 'Trending now' : isSavedFeed ? 'Saved posts' : isDeveloperFeed ? 'Developer feed' : 'Home feed'}
        description={
          isTrendingFeed
            ? 'Latest discussions from the DevSphere community.'
            : isSavedFeed
              ? 'Posts you saved for later reading.'
              : isDeveloperFeed
                ? 'Recent updates from developers you follow.'
                : 'A focused stream of posts from your network.'
        }
      />
      <div className="mx-auto max-w-2xl space-y-4">
        {posts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
        
        {hasNextPage && (
          <div className="flex justify-center py-4">
            <Button
              variant="outline"
              className="rounded-xl px-6"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
