"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface Song {
  id: string;
  title: string;
  artist: string;
}

interface SongContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  isMiniPlayerActive: boolean;
}

const SongContext = createContext<SongContextType>({
  currentSong: null, isPlaying: false, currentTime: 0, duration: 0,
  play: () => {}, pause: () => {}, resume: () => {}, stop: () => {}, seekTo: () => {},
  isMiniPlayerActive: false,
});

export function SongProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const pathname = usePathname();

  const currentSongId = currentSong?.id;
  const isOnSongPage = pathname.startsWith(`/song/${currentSongId}`);
  const isMiniPlayerActive = !!currentSong && !isOnSongPage;

  // Restore from localStorage
  useEffect(() => {
    try {
      const savedSong = localStorage.getItem("mv_current_song");
      if (savedSong) setCurrentSong(JSON.parse(savedSong));
      const savedTime = localStorage.getItem("mv_current_time");
      if (savedTime) setCurrentTime(parseInt(savedTime) || 0);
      const playing = localStorage.getItem("mv_is_playing");
      setIsPlaying(playing === "true");
    } catch {}
  }, []);

  // Track time progression every second while playing
  useEffect(() => {
    if (!isPlaying || !currentSong) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        localStorage.setItem("mv_current_time", newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSong?.id]);

  const play = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(true);
      localStorage.setItem("mv_is_playing", "true");
      return;
    }
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
    localStorage.setItem("mv_current_song", JSON.stringify(song));
    localStorage.setItem("mv_current_time", "0");
    localStorage.setItem("mv_is_playing", "true");
  };

  const pause = () => {
    setIsPlaying(false);
    localStorage.setItem("mv_is_playing", "false");
  };

  const resume = () => {
    setIsPlaying(true);
    localStorage.setItem("mv_is_playing", "true");
  };

  const stop = () => {
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    localStorage.removeItem("mv_current_song");
    localStorage.removeItem("mv_current_time");
    localStorage.removeItem("mv_is_playing");
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
    localStorage.setItem("mv_current_time", time.toString());
  };

  return (
    <SongContext.Provider value={{ 
      currentSong, isPlaying, currentTime, duration, 
      play, pause, resume, stop, seekTo, isMiniPlayerActive 
    }}>
      {children}
    </SongContext.Provider>
  );
}

export function useSong() { return useContext(SongContext); }