"use client";

import { createContext, useContext, useState, useRef, useCallback } from "react";
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
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setTime: (time: number) => void;
}

const SongContext = createContext<SongContextType>({
  currentSong: null, isPlaying: false, currentTime: 0,
  play: () => {}, pause: () => {}, resume: () => {}, stop: () => {}, setTime: () => {},
});

export function SongProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const pathname = usePathname();

  const play = (song: Song) => { setCurrentSong(song); setIsPlaying(true); };
  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);
  const stop = () => { setCurrentSong(null); setIsPlaying(false); setCurrentTime(0); };
  const setTime = (time: number) => setCurrentTime(time);

  const isOnSongPage = pathname.startsWith("/song/");

  return (
    <SongContext.Provider value={{ currentSong, isPlaying, currentTime, play, pause, resume, stop, setTime }}>
      {children}
      {currentSong && !isOnSongPage && (
        <iframe
          key={currentSong.id + "-" + Math.floor(currentTime)}
          src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=1&controls=0&start=${Math.floor(currentTime)}`}
          allow="autoplay"
          style={{ position: "fixed", bottom: 0, right: 0, width: "1px", height: "1px", border: "none", zIndex: -1 }}
        />
      )}
    </SongContext.Provider>
  );
}

export function useSong() { return useContext(SongContext); }
