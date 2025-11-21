import { fetchSongs } from "@/lib/api";
import SongCard from "@/components/SongCard";

export default async function SongsPage() {
  const songs = await fetchSongs();

  return (
    <div className="min-h-screen text-white p-6 md:ml-64">
      <h1 className="text-3xl font-bold mb-6">All Songs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {songs.map((song: any) => (
            <SongCard
            key={song.id}
            id={song.id}
            title={song.title}
            artist={song.artist}
            duration={song.duration}
            audio_url={song.audio_url}
            />
        ))}

      </div>
    </div>
  );
}
