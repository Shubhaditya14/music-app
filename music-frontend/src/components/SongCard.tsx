
interface SongCardProps {
  title: string;
  artist: string;
  duration: number;
  audio_url: string;  // ← NEW
}

export default function SongCard({ title, artist, duration, audio_url }: SongCardProps) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md hover:bg-gray-800 transition">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-400">{artist}</p>

      <audio controls className="mt-3 w-full">
        <source src={audio_url} type="audio/mpeg" />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}
