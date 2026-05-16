"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

interface Song {
  id: string;
  title: string;
  artist: string;
}

interface SongContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

const SongContext = createContext<SongContextType>({
  currentSong: null, isPlaying: false,
  play: () => {}, pause: () => {}, resume: () => {}, stop: () => {},
});

export function SongProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const pathname = usePathname();

  const play = (song: Song) => { setCurrentSong(song); setIsPlaying(true); };
  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);
  const stop = () => { setCurrentSong(null); setIsPlaying(false); };

  // Hide background iframe when on the song page (the song page has its own player)
  const isOnSongPage = pathname.startsWith("/song/");

  return (
    <SongContext.Provider value={{ currentSong, isPlaying, play, pause, resume, stop }}>
      {children}
      {currentSong && !isOnSongPage && (
        <iframe
          key={currentSong.id}
          src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=1&controls=0`}
          allow="autoplay"
          style={{ position: "fixed", bottom: 0, right: 0, width: "1px", height: "1px", border: "none", zIndex: -1 }}
        />
      )}
    </SongContext.Provider>
  );
}

export function useSong() { return useContext(SongContext); }
