import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { useDebounce } from '../../../hooks/useDebounce'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`)
    }
  }, [debouncedQuery, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search developers, posts, technologies..."
          className="pl-9 w-[300px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => setQuery('')}
          >
            <span className="sr-only">Clear</span>
            <span className="text-muted-foreground">×</span>
          </Button>
        )}
      </div>
    </form>
  )
}