"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { logPlay } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Play, Pause, Fullscreen } from "lucide-react";

interface FullScreenPlayerProps {
  currentSong: any; // Define a proper type for currentSong
  isPlaying: boolean;
  onClose: () => void;
}

const FullScreenPlayer = ({ currentSong, isPlaying, onClose }: FullScreenPlayerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-3xl flex flex-col items-center justify-center z-50 p-4"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">
        &times;
      </button>
      <motion.img
        src="http://localhost:8000/static/cover/kanye.jpg" // Use currentSong.cover_art or similar
        alt={currentSong.title}
        className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full shadow-lg mb-8"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      />
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{currentSong.title}</h2>
      <p className="text-xl md:text-2xl text-gray-300">{currentSong.artist}</p>
    </motion.div>
  );
};


export default function PlayerBar() {
  const { currentSong, isPlaying, pause, playSong } = usePlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerBarRef = useRef<HTMLDivElement | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);


  // GSAP animation for player bar entrance
  useEffect(() => {
    if (playerBarRef.current) {
      gsap.fromTo(playerBarRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    }
  }, [currentSong]); // Animate when currentSong changes

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
    <>
      <motion.div
        ref={playerBarRef}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed bottom-0 left-0 w-full backdrop-blur-xl bg-white/10 border border-white/20 text-white p-4 flex items-center justify-between rounded-t-3xl shadow-lg"
      >
        <div className="flex items-center">
          <motion.img
            src="http://localhost:8000/static/cover/kanye.jpg"
            alt={currentSong.title}
            className="w-12 h-12 object-cover rounded-md mr-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
          <div>
            <h3 className="text-lg font-bold">{currentSong.title}</h3>
            <p className="text-sm text-gray-400">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => (isPlaying ? pause() : playSong(currentSong))}
            className="p-2 rounded-full bg-blue-600 text-white"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFullScreen(true)}
            className="p-2 rounded-full bg-gray-600 text-white"
          >
            <Fullscreen size={24} />
          </motion.button>
        </div>

        {/* The actual audio element */}
        <audio ref={audioRef} />
      </motion.div>

      <AnimatePresence>
        {isFullScreen && (
          <FullScreenPlayer currentSong={currentSong} isPlaying={isPlaying} onClose={() => setIsFullScreen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
