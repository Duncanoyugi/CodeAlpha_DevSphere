import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout.tsx'
import { AuthLayout } from '../layouts/AuthLayout.tsx'
import { AuthGuard } from '../features/auth/components/AuthGuard.tsx'
import { RouteSkeleton } from '../components/common/RouteSkeleton.tsx'

const HomePage = lazy(() => import('../pages/HomePage.tsx').then((m) => ({ default: m.HomePage })))
const Login = lazy(() => import('../features/auth/components/Login.tsx').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('../features/auth/components/Register.tsx').then((m) => ({ default: m.Register })))
const Feed = lazy(() => import('../features/feed/components/Feed.tsx').then((m) => ({ default: m.Feed })))
const Profile = lazy(() => import('../features/profile/components/Profile.tsx').then((m) => ({ default: m.Profile })))
const PostDetail = lazy(() => import('../features/posts/components/PostDetail.tsx').then((m) => ({ default: m.PostDetail })))
const CreatePost = lazy(() => import('../features/posts/components/CreatePost.tsx').then((m) => ({ default: m.CreatePost })))
const TechnologyPage = lazy(() => import('../features/technologies/components/TechnologyPage.tsx').then((m) => ({ default: m.TechnologyPage })))
const TechnologiesPage = lazy(() => import('../pages/TechnologiesPage.tsx').then((m) => ({ default: m.TechnologiesPage })))
const Search = lazy(() => import('../features/search/components/Search.tsx').then((m) => ({ default: m.Search })))
const SettingsPage = lazy(() => import('../pages/SettingsPage.tsx').then((m) => ({ default: m.SettingsPage })))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.tsx').then((m) => ({ default: m.NotFoundPage })))
const TrendingPage = lazy(() => import('../pages/TrendingPage.tsx').then((m) => ({ default: m.TrendingPage })))
const SavedPage = lazy(() => import('../pages/SavedPage.tsx').then((m) => ({ default: m.SavedPage })))
const NotificationsPage = lazy(() => import('../pages/NotificationsPage.tsx').then((m) => ({ default: m.NotificationsPage })))
const DevelopersPage = lazy(() => import('../pages/DevelopersPage.tsx').then((m) => ({ default: m.DevelopersPage })))

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

