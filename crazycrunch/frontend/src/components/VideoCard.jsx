export default function VideoCard({ video, onLike }) {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-video bg-black/50">
        <video src={video.url} controls className="w-full h-full object-cover" preload="metadata" />
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
        <div className="text-xs text-white/60 flex items-center gap-3">
          <span>@{video.user?.username ?? 'user'}</span>
          <span>•</span>
          <span>{new Date(video.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm pt-1">
          <div className="flex items-center gap-4">
            <button onClick={() => onLike?.(video.id)} className="hover:text-primary">❤ {video.likesCount ?? 0}</button>
            <span>💬 {video.commentsCount ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
