"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

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
  currentSong: null,
  isPlaying: false,
  play: () => {},
  pause: () => {},
  resume: () => {},
  stop: () => {},
});

export function SongProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const play = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);
  const stop = () => {
    setCurrentSong(null);
    setIsPlaying(false);
  };

  return (
    <SongContext.Provider value={{ currentSong, isPlaying, play, pause, resume, stop }}>
      {children}
      {/* Hidden iframe kept alive across pages for background play */}
      {currentSong && (
        <div style={{ position: "fixed", top: -9999, left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}>
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=1&controls=0&modestbranding=1`}
            allow="autoplay"
          />
        </div>
      )}
    </SongContext.Provider>
  );
}

export function useSong() {
  return useContext(SongContext);
}
