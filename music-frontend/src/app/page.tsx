"use client";

import { useEffect, useState } from "react";
import { fetchTopSongs, fetchRecommendations } from "@/lib/api";
import SongCard from "@/components/SongCard";

export default function HomePage() {
  const [top, setTop] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const t = await fetchTopSongs(1); // Assuming user_id 1
      const recsData = await fetchRecommendations(1); // Assuming user_id 1
      setTop(t);
      setRecs(recsData);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen text-white p-6 md:ml-64">
      {/* Top Songs */}
      <h1 className="text-3xl font-bold mb-6">Top Songs This Week</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {top.map((entry: any) => (
          <SongCard
            key={entry.song.id}
            id={entry.song.id}
            title={entry.song.title}
            artist={entry.song.artist}
            duration={entry.song.duration}
            audio_url={entry.song.audio_url}
          />
        ))}
      </div>

      {/* Recommended For You */}
      <h1 className="text-3xl font-bold mt-10 mb-6">Recommended For You</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.isArray(recs) && recs.map((entry: any) => (
          <SongCard
            key={entry.song.id}
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
