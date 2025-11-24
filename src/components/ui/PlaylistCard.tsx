interface PlaylistCardProps {
  title: string
  subtitle: string
  image: string
  color?: string
}

export function PlaylistCard({ title, subtitle, image }: PlaylistCardProps) {
  return (
    <div className="bg-neutral-900 rounded-xl p-4 hover:bg-neutral-800 transition cursor-pointer">
      <img src={image} alt={title} className="rounded-lg mb-3 w-full h-40 object-cover" />
      <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  )
}

