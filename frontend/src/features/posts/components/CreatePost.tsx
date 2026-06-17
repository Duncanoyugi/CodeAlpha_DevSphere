import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useCreatePost } from '../hooks/useCreatePost'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { postSchema, type PostInput } from '../../../lib/validators'
import { POST_TAGS } from '../../../lib/constants'

export function CreatePost() {
  const createPost = useCreatePost()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      tags: [],
    },
  })

  const onSubmit = (data: PostInput) => {
    createPost.mutate({
      ...data,
      tags: selectedTags,
    })
    reset()
    setSelectedTags([])
  }

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's the topic?"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Share your knowledge..."
                className="min-h-[200px]"
                {...register('content')}
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tags (max 5)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput) {
                      e.preventDefault()
                      addTag(tagInput)
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => tagInput && addTag(tagInput)}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {POST_TAGS.filter(tag => !selectedTags.includes(tag)).slice(0, 10).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => addTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createPost.isPending}>
              {createPost.isPending ? 'Creating...' : 'Create Post'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}