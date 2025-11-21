"use client";

import { useEffect, useState } from "react";
import { fetchRecentPlays, fetchTopSongs, fetchRecommendations } from "@/lib/api";
import SongCard from "@/components/SongCard";

export default function HomePage() {
  const [recent, setRecent] = useState<any[]>([]);
  const [top, setTop] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const r = await fetchRecentPlays(1);
      const t = await fetchTopSongs(1);
      const recsData = await fetchRecommendations(1);
      setRecent(r);
      setTop(t);
      setRecs(recsData);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Recently Played */}
      <h1 className="text-3xl font-bold mb-6">Recently Played</h1>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {recent.map((entry: any) => (
          <div key={entry.id} className="min-w-[200px]">
            <SongCard
              id={entry.song.id}
              title={entry.song.title}
              artist={entry.song.artist}
              duration={entry.song.duration}
              audio_url={entry.song.audio_url}
            />
          </div>
        ))}
      </div>

      {/* Top Songs */}
      <h1 className="text-3xl font-bold mt-10 mb-6">Top Songs This Week</h1>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {top.map((entry: any) => (
          <div key={entry.song.id} className="min-w-[200px]">
            <SongCard
              id={entry.song.id}
              title={entry.song.title}
              artist={entry.song.artist}
              duration={entry.song.duration}
              audio_url={entry.song.audio_url}
            />
          </div>
        ))}
      </div>

      {/* Recommended For You */}
      <h1 className="text-3xl font-bold mt-10 mb-6">Recommended For You</h1>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {recs.map((entry: any) => (
          <div key={entry.song.id} className="min-w-[200px]">
            <SongCard
              id={entry.song.id}
              title={entry.song.title}
              artist={entry.song.artist}
              duration={entry.song.duration}
              audio_url={entry.song.audio_url}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
