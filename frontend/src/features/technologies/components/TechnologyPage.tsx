import { useParams } from 'react-router-dom'
import { Hash } from 'lucide-react'
import { usePostsByTag } from '../hooks/useTechnologies'
import { PostCard } from '../../../components/PostCard'
import { FeedSkeleton } from '../../../components/LoadingSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { PageHeader } from '../../../components/PageHeader'

export function TechnologyPage() {
  const { name } = useParams<{ name: string }>()
  const { data: posts, isLoading, error } = usePostsByTag(name!)

  if (isLoading) {
    return <FeedSkeleton />
  }

  if (error) {
    return (
      <EmptyState
        title="Posts unavailable"
        description="Failed to load posts for this technology."
        icon={<Hash className="h-12 w-12" />}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Technology"
        title={`#${name}`}
        description={`${posts?.length || 0} posts about ${name}.`}
      />

      {posts && posts.length > 0 ? (
        <div className="mx-auto max-w-2xl space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No posts yet"
          description={`No posts found for #${name}.`}
          icon={<Hash className="h-12 w-12" />}
        />
      )}
    </div>
  )
}
