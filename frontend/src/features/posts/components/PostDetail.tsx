import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Edit, ExternalLink, Link as LinkIcon, Trash2 } from 'lucide-react'
import { usePost } from '../hooks/usePosts'
import { useDeletePost } from '../hooks/useDeletePost'
import { useUpdatePost } from '../hooks/useUpdatePost'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { PageHeader } from '../../../components/PageHeader'
import { TagChip } from '../../../components/TagChip'
import { POST_TAGS } from '../../../lib/constants'
import { postSchema, type PostInput } from '../../../lib/validators'

export function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: post, isLoading, error } = usePost(id!)
  const deletePost = useDeletePost()
  const updatePost = useUpdatePost()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagsTouched, setTagsTouched] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      tags: post?.tags || [],
      githubRepoUrl: post?.githubRepoUrl || '',
      liveDemoUrl: post?.liveDemoUrl || '',
    },
  })

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
  const canAddTag = Boolean(tagInput.trim()) && !selectedTags.includes(tagInput.trim().replace(/^#/, '')) && selectedTags.length < 5

  const addTag = (tag: string) => {
    const cleanTag = tag.trim().replace(/^#/, '')
    if (cleanTag && !selectedTags.includes(cleanTag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, cleanTag])
      setTagsTouched(true)
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((currentTag) => currentTag !== tag))
    setTagsTouched(true)
  }

  const submitEdit = (data: PostInput) => {
    updatePost.mutate({
      id: post.id,
      ...data,
      tags: tagsTouched ? selectedTags : post.tags,
    }, {
      onSuccess: () => {
        reset(data)
        setSelectedTags([])
        setTagsTouched(false)
      },
    })
  }

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Edit className="h-4 w-4" aria-hidden="true" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                    <DialogDescription>Update your post content, tags, and project links.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(submitEdit)} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input id="edit-title" {...register('title')} />
                      {errors.title && <p className="text-sm text-[var(--destructive)]">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-content">Content</Label>
                      <Textarea id="edit-content" className="min-h-[220px]" {...register('content')} />
                      {errors.content && <p className="text-sm text-[var(--destructive)]">{errors.content.message}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="edit-github">GitHub Repo</Label>
                        <Input id="edit-github" type="url" placeholder="https://github.com/you/project" {...register('githubRepoUrl')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-demo">Live Demo</Label>
                        <Input id="edit-demo" type="url" placeholder="https://your-demo.dev" {...register('liveDemoUrl')} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label>Tags</Label>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] tabular-nums">
                          {selectedTags.length}/5
                        </span>
                      </div>
                      <div className="flex min-h-[42px] flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-2">
                        {selectedTags.length === 0 && (
                          <span className="text-sm text-[var(--muted-foreground)]">No tags selected</span>
                        )}
                        {selectedTags.map((tag) => (
                          <TagChip key={tag} tag={tag} selected onClick={() => removeTag(tag)} />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={tagInput}
                          onChange={(event) => setTagInput(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' && canAddTag) {
                              event.preventDefault()
                              addTag(tagInput)
                            }
                          }}
                        />
                        <Button type="button" variant="outline" onClick={() => canAddTag && addTag(tagInput)} disabled={!canAddTag}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {POST_TAGS.filter((tag) => !selectedTags.includes(tag)).slice(0, 10).map((tag) => (
                          <TagChip key={tag} tag={tag} onClick={() => addTag(tag)} />
                        ))}
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        reset({
                          title: post.title,
                          content: post.content,
                          tags: post.tags,
                          githubRepoUrl: post.githubRepoUrl || '',
                          liveDemoUrl: post.liveDemoUrl || '',
                        })
                        setSelectedTags([])
                        setTagsTouched(false)
                      }}>
                        Reset
                      </Button>
                      <Button type="submit" disabled={updatePost.isPending}>
                        {updatePost.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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

        {(post.githubRepoUrl || post.liveDemoUrl) && (
          <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
            {post.githubRepoUrl && (
              <a
                href={post.githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <LinkIcon className="h-4 w-4" aria-hidden="true" />
                View Repo
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {post.liveDemoUrl && (
              <a
                href={post.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <LinkIcon className="h-4 w-4" aria-hidden="true" />
                Live Demo
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        )}

        <CommentForm postId={post.id} />
        <CommentList postId={post.id} />
      </div>
    </div>
  )
}
