import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { AuthGuard } from '../features/auth/components/AuthGuard'
import { RouteSkeleton } from '../components/common/RouteSkeleton'

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })))
const Login = lazy(() => import('../features/auth/components/Login').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('../features/auth/components/Register').then((m) => ({ default: m.Register })))
const Feed = lazy(() => import('../features/feed/components/Feed').then((m) => ({ default: m.Feed })))
const Profile = lazy(() => import('../features/profile/components/Profile').then((m) => ({ default: m.Profile })))
const PostDetail = lazy(() => import('../features/posts/components/PostDetail').then((m) => ({ default: m.PostDetail })))
const CreatePost = lazy(() => import('../features/posts/components/CreatePost').then((m) => ({ default: m.CreatePost })))
const TechnologyPage = lazy(() => import('../features/technologies/components/TechnologyPage').then((m) => ({ default: m.TechnologyPage })))
const TechnologiesPage = lazy(() => import('../pages/TechnologiesPage').then((m) => ({ default: m.TechnologiesPage })))
const Search = lazy(() => import('../features/search/components/Search').then((m) => ({ default: m.Search })))
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const TrendingPage = lazy(() => import('../pages/TrendingPage').then((m) => ({ default: m.TrendingPage })))
const SavedPage = lazy(() => import('../pages/SavedPage').then((m) => ({ default: m.SavedPage })))
const NotificationsPage = lazy(() => import('../pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })))
const DevelopersPage = lazy(() => import('../pages/DevelopersPage').then((m) => ({ default: m.DevelopersPage })))

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<AuthGuard />}>
            <Route path="/feed" element={<Feed feedType="home" />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/technologies" element={<TechnologiesPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile/:username?" element={<Profile />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/technology/:name" element={<TechnologyPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

