export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} DevSphere. Built with ❤️ for developers</p>
      </div>
    </footer>
  )
}