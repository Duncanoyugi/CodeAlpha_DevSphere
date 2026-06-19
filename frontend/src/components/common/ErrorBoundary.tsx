import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button } from '../ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Something went wrong</h2>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button className="rounded-xl" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
