import { Outlet } from 'react-router-dom'
import { Footer } from '../layouts/components/Footer.tsx'
import { Navbar } from '../layouts/components/Navbar.tsx'
import { Sidebar } from '../layouts/components/Sidebar.tsx'

export function AppShell() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1600px]">
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
