"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
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

// Store player references globally so they survive re-renders
let playerInstance: any = null;
let playerReady = false;

export function SongProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pathname = usePathname();

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mv_current_song");
      if (saved) {
        const song = JSON.parse(saved);
        setCurrentSong(song);
        setIsPlaying(true);
      }
    } catch {}
  }, []);

  // YouTube API ready callback
  useEffect(() => {
    if (currentSong && !pathname.startsWith("/song/")) {
      // Load YouTube IFrame API
      if (!(window as any).onYouTubeIframeAPIReady) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        (window as any).onYouTubeIframeAPIReady = () => {
          playerReady = true;
        };
      }
    }
  }, [currentSong, pathname]);

  const postMessage = (command: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: "" }),
        "*"
      );
    }
  };

  const play = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    localStorage.setItem("mv_current_song", JSON.stringify(song));
    localStorage.setItem("mv_is_playing", "true");
  };

  const pause = () => {
    setIsPlaying(false);
    localStorage.setItem("mv_is_playing", "false");
    postMessage("pauseVideo");
  };

  const resume = () => {
    setIsPlaying(true);
    localStorage.setItem("mv_is_playing", "true");
    postMessage("playVideo");
  };

  const stop = () => {
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    localStorage.removeItem("mv_current_song");
    localStorage.removeItem("mv_is_playing");
    postMessage("stopVideo");
  };

  const setTime = (time: number) => setCurrentTime(time);

  const isOnSongPage = pathname.startsWith("/song/");

  return (
    <SongContext.Provider value={{ currentSong, isPlaying, currentTime, play, pause, resume, stop, setTime }}>
      {children}
      {currentSong && !isOnSongPage && (
        <iframe
          ref={iframeRef}
          key={currentSong.id}
          src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=1&controls=0&enablejsapi=1&start=${Math.floor(currentTime)}`}
          allow="autoplay"
          style={{ position: "fixed", bottom: 0, right: 0, width: "1px", height: "1px", border: "none", zIndex: -1 }}
        />
      )}
    </SongContext.Provider>
  );
}

export function useSong() { return useContext(SongContext); }