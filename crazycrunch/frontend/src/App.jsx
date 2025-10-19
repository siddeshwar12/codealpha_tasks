import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Upload from './pages/Upload.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Navbar from './components/Navbar.jsx'

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  return { token, setToken, user, setUser }
}

function ProtectedRoute({ token, children }) {
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const auth = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    auth.setToken(null)
    auth.setUser(null)
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      <Navbar user={auth.user} onLogout={handleLogout} />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home token={auth.token} />} />
          <Route path="/upload" element={
            <ProtectedRoute token={auth.token}>
              <Upload token={auth.token} />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login setToken={auth.setToken} setUser={auth.setUser} />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </div>
      <footer className="text-center text-sm text-white/50 py-10">© 2025 CrazyCrunch. All rights reserved.</footer>
    </div>
  )
}
