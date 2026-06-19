import { useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image as ImageIcon, X } from 'lucide-react'
import { useCreatePost } from '../hooks/useCreatePost'
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

export function CreatePost() {
  const { user } = useAuth()
  const createPost = useCreatePost()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      tags: [],
      imageUrl: '',
    },
  })

  const onSubmit = (data: PostInput) => {
    createPost.mutate({
      ...data,
      tags: selectedTags,
      imageUrl: imageUrl || undefined,
    })
    reset()
    setSelectedTags([])
    setImageUrl('')
    setImagePreview(null)
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string
        setImagePreview(result)
        setImageUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageUrl('')
    setImagePreview(null)
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

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex flex-wrap items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label htmlFor="image">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <ImageIcon className="h-4 w-4" aria-hidden="true" />
                      Upload Image
                    </span>
                  </Button>
                </Label>
                {imagePreview && (
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-[var(--border)]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-[var(--shadow-elevated)]"
                      aria-label="Remove image"
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

            <Button type="submit" className="w-full rounded-xl" disabled={createPost.isPending}>
              {createPost.isPending ? 'Creating...' : 'Create Post'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
