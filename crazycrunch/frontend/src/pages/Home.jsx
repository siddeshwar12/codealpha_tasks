import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import VideoCard from '../components/VideoCard.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Home({ token }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchVideos() {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API_BASE}/api/videos`)
      setVideos(data)
    } catch (e) {
      toast.error('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  async function likeVideo(id) {
    if (!token) return toast.error('Login to like videos')
    try {
      await axios.post(`${API_BASE}/api/videos/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } })
      setVideos(v => v.map(x => x.id===id ? { ...x, likesCount: (x.likesCount||0)+1 } : x))
    } catch {
      // ignore errors; server returns ok if already liked
    }
  }

  useEffect(() => { fetchVideos() }, [])

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map(v => (
            <VideoCard key={v.id} video={v} onLike={likeVideo} />
          ))}
        </div>
      )}
    </div>
  )
}
