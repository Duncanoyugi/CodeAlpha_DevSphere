import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { ArrowRight, Code, Users, Zap, TrendingUp, Bookmark, MessageCircle, Heart } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--background)]/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3" aria-label="DevSphere home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand)] text-sm font-bold text-[var(--brand-foreground)] ring-1 ring-[var(--ring)]/10">
              DS
            </div>
            <span className="text-xl font-semibold text-[var(--foreground)]">DevSphere</span>
          </Link>
          <nav className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <Badge variant="secondary" className="mb-6 w-fit font-mono text-[11px] uppercase tracking-[0.2em]">
                  Developer Community Platform
                </Badge>
                <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                  Connect.{' '}
                  <span className="text-[var(--brand)]">Share.</span>{' '}
                  Grow.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)]">
                  DevSphere is where developers discover trending tech, share projects, and network
                  with peers building the future. A focused stream of high-signal posts, curated by
                  the community.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" className="group" asChild>
                    <Link to="/register">
                      Join DevSphere
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Sign in</Link>
                  </Button>
                </div>
              </div>

              <div className="relative lg:pl-8">
                <div className="relative mx-auto max-w-lg lg:mx-0">
                  <div className="absolute inset-0 translate-y-4 translate-x-4 rounded-2xl bg-[var(--brand)]/10 blur-xl" />
                  <div className="relative rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--border)]/50 shadow-2xl shadow-[var(--shadow-elevated)]">
                    <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-[var(--destructive)]" />
                        <div className="h-3 w-3 rounded-full bg-[var(--accent)]" />
                        <div className="h-3 w-3 rounded-full bg-[var(--muted)]" />
                      </div>
                      <div className="flex-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                        devsphere / feed
                      </div>
                    </div>
                    <div className="p-5">
                      <MockPostCard
                        author="sarah.dev"
                        title="React Server Components are changing how we build"
                        content="After migrating our entire dashboard to RSC, we saw 40% smaller bundles and faster initial loads..."
                        tags={['React', 'Performance', 'Architecture']}
                        likes={127}
                        comments={23}
                      />
                      <MockPostCard
                        author="mikhael.codes"
                        title="Building a type-safe API layer with tRPC"
                        content="tRPC v11 brings end-to-end typesafety without code generation. Here's how we use it at scale..."
                        tags={['TypeScript', 'tRPC', 'Backend']}
                        likes={84}
                        comments={12}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--surface)]/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-6 sm:grid-cols-3">
              <ValueCard
                icon={Zap}
                title="Discover"
                description="Explore trending posts, technologies, and developers in one curated stream."
              />
              <ValueCard
                icon={Code}
                title="Share"
                description="Publish posts, showcase projects, and share knowledge with the community."
              />
              <ValueCard
                icon={Users}
                title="Connect"
                description="Follow developers, bookmark content, and build your network."
              />
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="mb-12 lg:mb-16">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  See what's happening in DevSphere
                </h2>
                <p className="mt-3 text-[var(--muted-foreground)]">
                  A real-time feed of posts from your network and trending discussions.
                </p>
              </div>
              <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                <div className="relative">
                  <div className="absolute inset-0 -translate-y-4 translate-x-4 rounded-2xl bg-[var(--brand)]/10 blur-xl" />
                  <div className="relative rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--border)]/50 shadow-2xl shadow-[var(--shadow-elevated)]">
                    <div className="border-b border-[var(--border)] px-5 py-4">
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                        Trending Posts
                      </h3>
                    </div>
                    <TrendingMockList />
                  </div>
                </div>
                <div className="space-y-8 lg:pl-8">
                  <FeatureHighlight
                    icon={TrendingUp}
                    title="Trending technologies"
                    description="See what's gaining momentum across the ecosystem — from emerging frameworks to established tools."
                  />
                  <FeatureHighlight
                    icon={Users}
                    title="Developer directory"
                    description="Find and follow developers by tech stack, experience level, and contributions."
                  />
                  <FeatureHighlight
                    icon={Bookmark}
                    title="Personalized feed"
                    description="Your feed adapts to your interests and network, surfacing only relevant discussions."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--surface)]/30">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              <StatItem value="2,400+" label="Active developers" />
              <StatItem value="8,900+" label="Posts shared" />
              <StatItem value="150+" label="Technologies tracked" />
            </div>
            <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Placeholder stats — real data coming soon
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--border)]/50 p-8 sm:p-12 lg:p-16">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                  Join the developer network
                </h2>
                <p className="mt-4 text-[var(--muted-foreground)]">
                  Connect with developers building the tools and frameworks shaping tomorrow's
                  software stack.
                </p>
                <Button size="lg" className="mt-8" asChild>
                  <Link to="/register">Get started — it's free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)]/50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <FooterColumn title="Product" links={['Feed', 'Trending', 'Developers']} />
            <FooterColumn title="Community" links={['Guidelines', 'Submit', 'Support']} />
            <FooterColumn title="Legal" links={['Privacy', 'Terms', 'License']} />
          </div>
          <div className="mt-12 flex items-center justify-between border-t border-[var(--border)] pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} DevSphere
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Developer Community Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ValueCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <Card className="group transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] transition-colors group-hover:bg-[var(--brand)] group-hover:text-[var(--brand-foreground)]">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
      </CardContent>
    </Card>
  )
}

function MockPostCard({ author, title, content, tags, likes, comments }: {
  author: string
  title: string
  content: string
  tags: string[]
  likes: number
  comments: number
}) {
  return (
    <div className="mb-4 last:mb-0 rounded-xl border border-[var(--border)] p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--muted)] font-mono text-[10px] font-semibold text-[var(--foreground)]">
          {author.slice(0, 2).toUpperCase()}
        </div>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--brand)]">
          {author}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-[var(--foreground)]">{title}</h4>
      <p className="mt-1 line-clamp-2 text-xs text-[var(--muted-foreground)]">{content}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1 text-[10px]">
            <Heart className="h-3 w-3" />
            <span className="tabular-nums">{likes}</span>
          </span>
          <span className="flex items-center gap-1 text-[10px]">
            <MessageCircle className="h-3 w-3" />
            <span className="tabular-nums">{comments}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function TrendingMockList() {
  const posts = [
    { rank: 1, author: 'devon.codes', title: 'Zod 4.0 type inference overhaul', tags: ['Zod', 'TypeScript'], likes: 56 },
    { rank: 2, author: 'priya.builds', title: 'TurboPack vs Vite: build performance', tags: ['Vite', 'Performance'], likes: 42 },
    { rank: 3, author: 'alex.sys', title: 'Kubernetes controllers in Rust', tags: ['Rust', 'Kubernetes'], likes: 31 },
  ]

  return (
    <div className="px-5 py-4">
      {posts.map((post, i) => (
        <div key={post.title} className={i > 0 ? 'mt-3 border-t border-[var(--border)] pt-3' : ''}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[var(--brand)]">{post.rank}</span>
                <span className="truncate font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground)]">
                  {post.author}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-[var(--muted-foreground)]">{post.title}</p>
              <div className="mt-2 flex gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
              <Heart className="h-3 w-3" />
              <span className="tabular-nums">{post.likes}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function FeatureHighlight({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
      </div>
    </div>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-3xl font-bold tracking-tight text-[var(--brand)] sm:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-sm uppercase tracking-[0.1em] text-[var(--muted-foreground)]">{label}</p>
    </div>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}