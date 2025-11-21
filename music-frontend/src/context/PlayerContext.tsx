"use client";

import { createContext, useContext, useState } from "react";

interface PlayerContextType {
  currentSong: any;
  isPlaying: boolean;
  playSong: (song: any) => void;
  pause: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function playSong(song: any) {
    console.log("PLAYING:", song);
    setCurrentSong({
      ...song,
      audio_url: song.audio_url.startsWith("http")
      ? song.audio_url
      : `http://127.0.0.1:8000${song.audio_url}`,
    });

    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        pause,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be inside PlayerProvider");
  return context;
}
