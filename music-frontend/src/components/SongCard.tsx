"use client";  // important for using hooks
import { usePlayer } from "@/context/PlayerContext";

interface SongCardProps {
  id: number;           
  title: string;
  artist: string;
  duration: number;
  audio_url: string;
}

export default function SongCard({ id, title, artist, duration, audio_url }: SongCardProps) {
  const { playSong } = usePlayer();

  return (
    <div
      onClick={() =>playSong({ id, title, artist, duration, audio_url })}
      className="bg-gray-900 p-4 rounded-lg shadow-md hover:bg-gray-800 transition cursor-pointer"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-400">{artist}</p>
      <p className="text-gray-500 text-sm">
        {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
      </p>
    </div>
  );
}
