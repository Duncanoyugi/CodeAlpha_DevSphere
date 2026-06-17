import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  )
}