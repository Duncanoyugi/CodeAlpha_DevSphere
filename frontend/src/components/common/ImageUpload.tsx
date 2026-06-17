import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ImageUploadProps {
  onUpload: (file: File) => void
  className?: string
  accept?: string
  maxSize?: number // in MB
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
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
        <Upload className="h-10 w-10 text-muted-foreground" />
        <div className="text-sm">
          <span className="font-semibold text-primary">Click to upload</span>
          {' or drag and drop'}
        </div>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, GIF up to {maxSize}MB
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  )
}