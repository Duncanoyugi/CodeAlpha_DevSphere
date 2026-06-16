import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

function AppRoutes() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/login" element={!user ? <div>Login</div> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <div>Register</div> : <Navigate to="/" />} />
      <Route path="/profile" element={user ? <div>Profile</div> : <Navigate to="/login" />} />
      <Route path="/create-post" element={user ? <div>Create Post</div> : <Navigate to="/login" />} />
    </Routes>
  )
}

export { AppRoutes }