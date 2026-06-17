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
const Search = lazy(() => import('../features/search/components/Search').then((m) => ({ default: m.Search })))
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

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
            <Route path="/feed" element={<Feed />} />
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

