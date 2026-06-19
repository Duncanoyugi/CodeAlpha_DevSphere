import { TagChip } from '../../../components/TagChip'

interface TechnologyBadgeProps {
  tag: string
  count?: number
  size?: 'sm' | 'default'
  onClick?: () => void
}

export function TechnologyBadge({ tag, count, size = 'default', onClick }: TechnologyBadgeProps) {
  return (
    <TagChip
      tag={tag}
      count={count}
      onClick={onClick}
      className={size === 'sm' ? 'px-2 py-0.5 text-[10px]' : undefined}
    />
  )
}
