import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateComment } from '../hooks/useComments'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { EmojiPicker } from '../../../components/EmojiPicker'
import { commentSchema, type CommentInput } from '../../../lib/validators'

interface CommentFormProps {
  postId: string
  parentId?: string
}

export function CommentForm({ postId, parentId }: CommentFormProps) {

  const createComment = useCreateComment()
  const [isFocused, setIsFocused] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPos, setCursorPos] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
  })

  const contentValue = watch('content', '')

  const insertEmoji = (emoji: string) => {
    const textarea = contentRef.current
    if (!textarea) return
    const start = textarea.selectionStart ?? cursorPos
    const end = textarea.selectionEnd ?? cursorPos
    const current = contentValue
    const next = current.slice(0, start) + emoji + current.slice(end)
    setValue('content', next, { shouldDirty: true })
    const newPos = start + emoji.length
    setTimeout(() => {
      textarea.selectionStart = newPos
      textarea.selectionEnd = newPos
      textarea.focus()
    }, 0)
  }

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
      <div className="relative">
        <Textarea
          placeholder="Write a comment..."
          {...register('content')}
          ref={(el) => {
            contentRef.current = el
            register('content').ref(el)
          }}
          onFocus={() => setIsFocused(true)}
          onSelect={() => {
            if (contentRef.current) setCursorPos(contentRef.current.selectionStart ?? 0)
          }}
          onClick={() => {
            if (contentRef.current) setCursorPos(contentRef.current.selectionStart ?? 0)
          }}
          onKeyUp={() => {
            if (contentRef.current) setCursorPos(contentRef.current.selectionStart ?? 0)
          }}
          className="min-h-[70px] rounded-xl pr-12"
        />
        <div className="absolute right-2 top-2">
          <EmojiPicker onSelect={insertEmoji} />
        </div>
      </div>
      {errors.content && (
        <p className="text-sm text-[var(--destructive)]">{errors.content.message}</p>
      )}

      {isFocused && (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-xl"
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
            className="rounded-xl"
            disabled={createComment.isPending}
          >
            {createComment.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      )}
    </form>
  )
}
