"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { logPlay } from "@/lib/api";

export default function PlayerBar() {
  const { currentSong, isPlaying, pause, playSong } = usePlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle auto-playing when song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audio_url;
      audioRef.current.play();

      // Log play to backend
      logPlay(1, currentSong.id, currentSong.duration);
    }
  }, [currentSong]);

  // Handle play/pause button
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  if (!currentSong) return null; // hide bar if no song selected

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex items-center justify-between border-t border-gray-700">
      <div>
        <h3 className="text-lg font-bold">{currentSong.title}</h3>
        <p className="text-sm text-gray-400">{currentSong.artist}</p>
      </div>

      <div>
        {isPlaying ? (
          <button
            onClick={pause}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={() => playSong(currentSong)}
            className="bg-green-500 px-4 py-2 rounded-lg"
          >
            Play
          </button>
        )}
      </div>

      {/* The actual audio element */}
      <audio ref={audioRef} />
    </div>
  );
}
