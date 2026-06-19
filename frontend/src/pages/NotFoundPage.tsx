import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { APP_NAME } from '../lib/constants'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand)]">404</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl">Page not found</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
        The page you're looking for doesn't exist or has been moved in {APP_NAME}.
      </p>
      <Button asChild className="mt-6 rounded-xl">
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  )
}
