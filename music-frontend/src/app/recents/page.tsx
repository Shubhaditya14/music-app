"use client";

import { useEffect, useState } from "react";
import { fetchRecentPlays } from "@/lib/api";
import SongCard from "@/components/SongCard";

export default function RecentsPage() {
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const r = await fetchRecentPlays(1); // Assuming user_id 1 for now
      setRecent(r);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen text-white p-6 md:ml-64">
      <h1 className="text-3xl font-bold mb-6">Recently Played</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {recent.map((entry: any) => (
          <SongCard
            key={entry.id}
            id={entry.song.id}
            title={entry.song.title}
            artist={entry.song.artist}
            duration={entry.song.duration}
            audio_url={entry.song.audio_url}
          />
        ))}
      </div>
    </div>
  );
}
