import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/badge'

interface TechnologyBadgeProps {
  tag: string
  count?: number
  size?: 'sm' | 'default'
  onClick?: () => void
}

export function TechnologyBadge({ tag, count, size = 'default', onClick }: TechnologyBadgeProps) {
  return (
    <Link to={`/technology/${tag}`} onClick={onClick}>
      <Badge
        variant="secondary"
        className={`
          hover:bg-secondary/80 cursor-pointer transition-colors
          ${size === 'sm' ? 'text-xs px-2 py-0.5' : ''}
        `}
      >
        #{tag}
        {count !== undefined && (
          <span className="ml-1 text-muted-foreground">({count})</span>
        )}
      </Badge>
    </Link>
  )
}