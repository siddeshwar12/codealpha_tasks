import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Upload({ token }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return toast.error('Select a video file')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('video', file)

    try {
      setLoading(true)
      setProgress(0)
      await axios.post(`${API_BASE}/api/videos/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (evt) => {
          if (evt.total) setProgress(Math.round((evt.loaded * 100) / evt.total))
        },
      })
      toast.success('Uploaded!')
      window.location.href = '/'
    } catch (e) {
      toast.error(e.response?.data?.error || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 card p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input className="w-full p-2 rounded bg-black/30 border border-white/10" value={title} onChange={e => setTitle(e.target.value)} required/>
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea className="w-full p-2 rounded bg-black/30 border border-white/10" value={description} onChange={e => setDescription(e.target.value)} rows={3}/>
        </div>
        <div>
          <label className="block text-sm mb-1">Video</label>
          <input type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        </div>
        {loading && (
          <div className="w-full bg-black/30 rounded h-2 overflow-hidden">
            <div className="bg-primary h-2 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        <button className="btn-primary w-full">Upload</button>
      </form>
    </div>
  )
}
