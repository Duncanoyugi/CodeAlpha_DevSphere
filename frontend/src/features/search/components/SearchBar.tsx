import { useState, useEffect, type FormEvent } from 'react'
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search developers..."
          className="h-10 w-[300px] rounded-xl pl-9"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-lg p-0"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <span className="sr-only">Clear</span>
            <span className="text-[var(--muted-foreground)]">×</span>
          </Button>
        )}
      </div>
    </form>
  )
}
