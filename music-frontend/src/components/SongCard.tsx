"use client";
import { usePlayer } from "@/context/PlayerContext";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() =>
        playSong({
          id,
          title,
          artist,
          duration,
          audio_url: audio_url.startsWith("http")
            ? audio_url
            : `http://127.0.0.1:8000${audio_url}`,
        })
      }
      className="backdrop-blur-xl bg-white/10 border border-white/20 p-4 rounded-3xl shadow-md transition cursor-pointer"
    >
      <img
        src="http://localhost:8000/static/cover/kanye.jpg"
        alt={title}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-400">{artist}</p>
      <p className="text-gray-500 text-sm">
        {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
      </p>
    </motion.div>
  );
}
