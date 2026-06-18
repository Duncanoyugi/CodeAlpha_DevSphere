import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateComment } from '../hooks/useComments'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { commentSchema, type CommentInput } from '../../../lib/validators'

interface CommentFormProps {
  postId: string
  parentId?: string
}

export function CommentForm({ postId, parentId }: CommentFormProps) {

  const createComment = useCreateComment()
  const [isFocused, setIsFocused] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
  })

  const onSubmit = (data: CommentInput) => {
    createComment.mutate(
      { postId, content: data.content, parentId },

      {
        onSuccess: () => {
          reset()
          setIsFocused(false)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Textarea
        placeholder="Write a comment..."
        {...register('content')}
        onFocus={() => setIsFocused(true)}
        className="min-h-[60px]"
      />
      {errors.content && (
        <p className="text-sm text-destructive">{errors.content.message}</p>
      )}

      {isFocused && (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              reset()
              setIsFocused(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={createComment.isPending}
          >
            {createComment.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      )}
    </form>
  )
}