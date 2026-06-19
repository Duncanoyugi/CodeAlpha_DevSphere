import { useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, Video, X } from 'lucide-react'
import { useCreatePost } from '../hooks/useCreatePost'
import { postsApi } from '../../../api/posts.api'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { PageHeader } from '../../../components/PageHeader'
import { TagChip } from '../../../components/TagChip'
import { Avatar } from '../../../components/Avatar'
import { postSchema, type PostInput } from '../../../lib/validators'
import { POST_TAGS } from '../../../lib/constants'
import { useAuth } from '../../auth/hooks/useAuth'
import { useToast } from '../../../components/ui/use-toast'

type PostFormInput = PostInput & {
  mediaUrl?: string
  mediaType?: string
  mediaSize?: number
}

const allowedMediaTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
]

export function CreatePost() {
  const { user } = useAuth()
  const { toast } = useToast()
  const createPost = useCreatePost()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [githubRepoUrl, setGithubRepoUrl] = useState('')
  const [liveDemoUrl, setLiveDemoUrl] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [mediaSize, setMediaSize] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      tags: [],
      imageUrl: '',
      githubRepoUrl: '',
      liveDemoUrl: '',
    },
  })

  const onSubmit = (data: PostFormInput) => {
    createPost.mutate({
      ...data,
      tags: selectedTags,
      imageUrl: data.mediaType?.startsWith('image/') ? mediaUrl || undefined : undefined,
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaType || undefined,
      mediaSize: mediaSize || undefined,
      githubRepoUrl: githubRepoUrl.trim() || undefined,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
    })
    reset()
    setSelectedTags([])
    setGithubRepoUrl('')
    setLiveDemoUrl('')
    removeMedia()
  }

  const handleMediaChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!allowedMediaTypes.includes(file.type)) {
      toast({
        title: 'Unsupported file',
        description: 'Upload an image, video, PDF, or supported document.',
        variant: 'destructive',
      })
      event.target.value = ''
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Media files must be 100MB or smaller.',
        variant: 'destructive',
      })
      event.target.value = ''
      return
    }

    setIsUploading(true)
    try {
      const uploaded = await postsApi.uploadImage(file)
      setMediaUrl(uploaded.mediaUrl)
      setMediaType(uploaded.mediaType)
      setMediaSize(uploaded.mediaSize)
      toast({
        title: 'Media uploaded',
        description: `${file.name} is ready to attach to your post.`,
      })
    } catch (error: unknown) {
      toast({
        title: 'Upload failed',
        description: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to upload media.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const removeMedia = () => {
    setMediaUrl('')
    setMediaType('')
    setMediaSize(0)
  }

  const addTag = (tag: string) => {
    const cleanTag = tag.trim().replace(/^#/, '')
    if (cleanTag && !selectedTags.includes(cleanTag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, cleanTag])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((currentTag) => currentTag !== tag))
  }

  const canAddTag = Boolean(tagInput.trim()) && !selectedTags.includes(tagInput.trim().replace(/^#/, '')) && selectedTags.length < 5

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Composer"
        title="Create Post"
        description="Share a focused update with the DevSphere community."
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar name={user?.username || 'User'} src={user?.avatar || null} size="md" />
            <div>
              <CardTitle>What are you building?</CardTitle>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Add up to five tags to help the right developers find this post.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's the topic?"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-[var(--destructive)]">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Share your knowledge..."
                className="min-h-[220px]"
                {...register('content')}
              />
              {errors.content && (
                <p className="text-sm text-[var(--destructive)]">{errors.content.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="githubRepoUrl">GitHub Repo</Label>
                <Input
                  id="githubRepoUrl"
                  type="url"
                  placeholder="https://github.com/you/project"
                  value={githubRepoUrl}
                  onChange={(event) => setGithubRepoUrl(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="liveDemoUrl">Live Demo</Label>
                <Input
                  id="liveDemoUrl"
                  type="url"
                  placeholder="https://your-demo.dev"
                  value={liveDemoUrl}
                  onChange={(event) => setLiveDemoUrl(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="media">Attach image, video, or document</Label>
              <div className="flex flex-wrap items-center gap-4">
                <Input
                  id="media"
                  type="file"
                  accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
                  onChange={handleMediaChange}
                  className="hidden"
                />
                <Label htmlFor="media">
                  <Button type="button" variant="outline" asChild disabled={isUploading}>
                    <span>
                      {isUploading ? 'Uploading...' : 'Upload Media'}
                    </span>
                  </Button>
                </Label>
                {mediaUrl && (
                  <div className="relative flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-2">
                    {mediaType?.startsWith('image/') && (
                      <img src={mediaUrl} alt="Media preview" className="h-16 w-16 rounded-lg object-cover" />
                    )}
                    {mediaType?.startsWith('video/') && (
                      <video src={mediaUrl} controls className="h-16 rounded-lg" />
                    )}
                    {(mediaType === 'application/pdf' || mediaType?.includes('word') || mediaType?.includes('powerpoint') || mediaType === 'text/plain') && (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)]">
                        {mediaType === 'application/pdf' ? <FileText className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">{mediaType || 'Attached media'}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{Math.round((mediaSize || 0) / 1024 / 1024 * 10) / 10} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-[var(--shadow-elevated)]"
                      aria-label="Remove media"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
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
                  <TagChip
                    key={tag}
                    tag={tag}
                    selected
                    onClick={() => removeTag(tag)}
                  />
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => canAddTag && addTag(tagInput)}
                  disabled={!canAddTag}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {POST_TAGS.filter((tag) => !selectedTags.includes(tag)).slice(0, 10).map((tag) => (
                  <TagChip
                    key={tag}
                    tag={tag}
                    onClick={() => addTag(tag)}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full rounded-xl" disabled={createPost.isPending || isUploading}>
              {createPost.isPending ? 'Creating...' : isUploading ? 'Uploading...' : 'Create Post'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
