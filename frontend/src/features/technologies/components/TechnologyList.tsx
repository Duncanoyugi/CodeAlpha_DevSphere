import { useState } from 'react'
import { TechnologyBadge } from './TechnologyBadge'
import { Input } from '../../../components/ui/input'
import { TagChip } from '../../../components/TagChip'
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
          onChange={(event) => setSearch(event.target.value)}
          className="h-10 rounded-xl"
        />
      )}

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <TagChip key={tag} tag={tag} selected onClick={() => onSelect?.(tag)} />
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
