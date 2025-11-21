import { fetchSongs } from "@/lib/api";
import SongCard from "@/components/SongCard";

export default async function SongsPage() {
  const songs = await fetchSongs();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Songs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((song: any) => (
            <SongCard
            key={song.id}
            title={song.title}
            artist={song.artist}
            duration={song.duration}
            audio_url={song.audio_url}   // ← NEW
            />
        ))}

      </div>
    </div>
  );
}
