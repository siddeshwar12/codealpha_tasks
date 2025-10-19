import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Profile() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get(`${API_BASE}/api/users/${id}`)
        setUser(data)
      } catch (e) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  if (!user) return <div className="text-center text-white/60">User not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center text-2xl">{user.username[0].toUpperCase()}</div>
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <div className="text-white/60 text-sm">{user._count?.videos ?? 0} videos</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {user.videos?.map(v => (
          <div key={v.id} className="card overflow-hidden">
            <div className="aspect-video bg-black/50">
              <video src={v.url} controls className="w-full h-full object-cover" preload="metadata" />
            </div>
            <div className="p-3">
              <div className="font-semibold line-clamp-2">{v.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
