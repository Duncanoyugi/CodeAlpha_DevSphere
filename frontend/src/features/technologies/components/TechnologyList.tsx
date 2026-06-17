import { useState } from 'react'
import { TechnologyBadge } from './TechnologyBadge'
import { Input } from '../../../components/ui/input'
import { Badge } from '../../../components/ui/badge'
import { POST_TAGS } from '../../../lib/constants'

interface TechnologyListProps {
  selectedTags?: string[]
  onSelect?: (tag: string) => void
  limit?: number
}

export function TechnologyList({ selectedTags = [], onSelect, limit }: TechnologyListProps) {
  const [search, setSearch] = useState('')

  const filteredTags = POST_TAGS
    .filter(tag => tag.toLowerCase().includes(search.toLowerCase()))
    .filter(tag => !selectedTags.includes(tag))
    .slice(0, limit)

  return (
    <div className="space-y-3">
      {onSelect && (
        <Input
          placeholder="Search technologies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9"
        />
      )}

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="default" className="gap-1">
            #{tag}
            {onSelect && (
              <button
                onClick={() => onSelect(tag)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            )}
          </Badge>
        ))}
        {filteredTags.map((tag) => (
          <TechnologyBadge
            key={tag}
            tag={tag}
            onClick={() => onSelect?.(tag)}
          />
        ))}
      </div>
    </div>
  )
}