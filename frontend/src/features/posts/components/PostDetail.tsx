import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { usePost } from '../hooks/usePosts'
import { useDeletePost } from '../hooks/useDeletePost'
import { PostCard } from './PostCard'
import { CommentList } from '../../comments/components/CommentList'
import { CommentForm } from '../../comments/components/CommentForm'
import { Button } from '../../../components/ui/button'
import { LoadingSpinner } from '../../../components/common/LoadingSpinner'
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

export function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: post, isLoading, error } = usePost(id!)
  const deletePost = useDeletePost()

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">Post not found</p>
      </div>
    )
  }

  const author = post.author
  const isAuthor = author && user?.id === author.id

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {isAuthor && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
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
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <PostCard post={post} detailed />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <CommentForm postId={post.id} />
        <CommentList postId={post.id} />
      </div>
    </div>
  )
}