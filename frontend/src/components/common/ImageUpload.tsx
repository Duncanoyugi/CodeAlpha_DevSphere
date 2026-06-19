import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ImageUploadProps {
  onUpload: (file: File) => void
  className?: string
  accept?: string
  maxSize?: number
}

export function ImageUpload({ onUpload, className, accept = 'image/*', maxSize = 5 }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError(null)

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    onUpload(file)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
        dragActive ? 'border-[var(--brand)] bg-[var(--accent)]/40' : 'border-[var(--border)] bg-[var(--background)]',
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-10 w-10 text-[var(--muted-foreground)]" />
        <div className="text-sm">
          <span className="font-semibold text-[var(--brand)]">Click to upload</span>
          {' or drag and drop'}
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          PNG, JPG, GIF up to {maxSize}MB
        </p>
        {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
      </div>
    </div>
  )
}
