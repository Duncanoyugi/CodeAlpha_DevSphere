import { useParams } from 'react-router-dom'
import { usePostsByTag } from '../hooks/useTechnologies'
import { PostCard } from '../../posts/components/PostCard'
import { LoadingSpinner } from '../../../components/common/LoadingSpinner'
import { EmptyState } from '../../../components/common/EmptyState'

export function TechnologyPage() {
  const { name } = useParams<{ name: string }>()
  const { data: posts, isLoading, error } = usePostsByTag(name!)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">Failed to load posts</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">#{name}</h1>
        <p className="text-muted-foreground">
          {posts?.length || 0} posts about {name}
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No posts yet"
          description={`No posts found for #${name}`}
          className="py-12"
        />
      )}
    </div>
  )
}