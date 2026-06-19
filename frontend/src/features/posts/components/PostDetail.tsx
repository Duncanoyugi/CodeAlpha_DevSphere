import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { usePost } from '../hooks/usePosts'
import { useDeletePost } from '../hooks/useDeletePost'
import { PostCard } from '../../../components/PostCard'
import { CommentList } from '../../comments/components/CommentList'
import { CommentForm } from '../../comments/components/CommentForm'
import { Button } from '../../../components/ui/button'
import { FeedSkeleton } from '../../../components/LoadingSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { useAuth } from '../../auth/hooks/useAuth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog'
import { PageHeader } from '../../../components/PageHeader'

export function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: post, isLoading, error } = usePost(id!)
  const deletePost = useDeletePost()

  if (isLoading) {
    return <FeedSkeleton />
  }

  if (error || !post) {
    return (
      <EmptyState
        title="Post not found"
        description="We couldn't find that post."
        icon={<Edit className="h-12 w-12" />}
      />
    )
  }

  const author = post.author
  const isAuthor = author && user?.id === author.id

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Discussion"
        title={post.title}
        description="Read the full post and join the conversation."
        actions={
          <Button variant="ghost" className="rounded-xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
        }
      />

      <PostCard post={post} detailed />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Comments</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Share your perspective with the community.</p>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Edit className="h-4 w-4" aria-hidden="true" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="rounded-xl">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this post? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deletePost.mutate(post.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        <CommentForm postId={post.id} />
        <CommentList postId={post.id} />
      </div>
    </div>
  )
}
