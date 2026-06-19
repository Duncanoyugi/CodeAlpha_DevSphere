import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../lib/utils'
import { Avatar as AvatarRoot, AvatarFallback, AvatarImage } from './ui/avatar'

interface AvatarProps extends ComponentPropsWithoutRef<typeof AvatarRoot> {
  name?: string | null
  src?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const avatarSizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-24 w-24 text-2xl',
}

export function Avatar({ name = '', src, size = 'md', className, children, ...props }: AvatarProps) {
  return (
    <AvatarRoot className={cn(avatarSizes[size], className)} {...props}>
      {children || (
        <>
          <AvatarImage src={src || undefined} />
          <AvatarFallback className="bg-[var(--muted)] font-semibold text-[var(--foreground)]">
            {getInitials(name || 'User')}
          </AvatarFallback>
        </>
      )}
    </AvatarRoot>
  )
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'
}
