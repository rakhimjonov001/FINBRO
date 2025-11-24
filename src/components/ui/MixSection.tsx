import { PlaylistCard } from "../ui/PlaylistCard"

export function MixSection({ title }: { title: string }) {
  const mixes = [
    { title: "Микс дня #1", subtitle: "Jah Khalib, MACAN, Каспийский груз", image: "https://picsum.photos/200?1" },
    { title: "Микс дня #2", subtitle: "Гио Пика, HammAli & Navai", image: "https://picsum.photos/200?2" },
    { title: "Открытия недели", subtitle: "Новые треки и исполнители", image: "https://picsum.photos/200?3" },
    { title: "Радар новинок", subtitle: "Свежая музыка от любимых", image: "https://picsum.photos/200?4" },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <button className="text-sm text-gray-400 hover:text-white">Показать все</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {mixes.map((mix, i) => (
          <PlaylistCard key={i} {...mix} />
        ))}
      </div>
    </section>
  )
}
