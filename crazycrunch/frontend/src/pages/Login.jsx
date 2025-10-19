import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Login({ setToken, setUser }) {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  function update(field) {
    return (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login'
      const { data } = await axios.post(`${API_BASE}${url}`, form)
      setToken(data.token)
      setUser(data.user)
      toast.success(isRegister ? 'Registered!' : 'Logged in!')
      window.location.href = '/'
    } catch (e) {
      toast.error(e.response?.data?.error || 'Auth failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Create account' : 'Welcome back'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input className="w-full p-2 rounded bg-black/30 border border-white/10" value={form.username} onChange={update('username')} required/>
          </div>
        )}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" className="w-full p-2 rounded bg-black/30 border border-white/10" value={form.email} onChange={update('email')} required/>
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full p-2 rounded bg-black/30 border border-white/10" value={form.password} onChange={update('password')} required/>
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Please wait…' : (isRegister ? 'Register' : 'Login')}</button>
      </form>
      <div className="text-sm text-white/60 mt-3">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setIsRegister(v => !v)} className="text-primary hover:underline">
          {isRegister ? 'Login' : 'Create one'}
        </button>
      </div>
    </div>
  )
}
