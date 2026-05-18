"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pathname = usePathname();

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const savedSong = localStorage.getItem("mv_current_song");
      const savedTime = localStorage.getItem("mv_current_time");
      if (savedSong) {
        setCurrentSong(JSON.parse(savedSong));
        if (savedTime) setCurrentTime(parseInt(savedTime) || 0);
        const playing = localStorage.getItem("mv_is_playing") === "true";
        setIsPlaying(playing);
      }
    } catch {}
  }, []);

  // Poll time from iframe
  useEffect(() => {
    if (!isPlaying || !currentSong || pathname.startsWith("/song/")) return;
    
    const interval = setInterval(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "getCurrentTime", args: "" }),
          "*"
        );
      }
    }, 2000);

    const handleMessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.info?.currentTime !== undefined) {
          const t = Math.floor(data.info.currentTime);
          setCurrentTime(t);
          localStorage.setItem("mv_current_time", t.toString());
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("message", handleMessage);
    };
  }, [isPlaying, currentSong?.id, pathname]);

  // Simple postMessage
  const postMsg = (cmd: string, args: any = "") => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: cmd, args: args }),
        "*"
      );
    }
  };

  const play = (song: Song) => {
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
    postMsg("pauseVideo");
  };

  const resume = () => {
    setIsPlaying(true);
    localStorage.setItem("mv_is_playing", "true");
    postMsg("playVideo");
  };

  const stop = () => {
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    localStorage.removeItem("mv_current_song");
    localStorage.removeItem("mv_current_time");
    localStorage.removeItem("mv_is_playing");
  };

  const setTime = (time: number) => setCurrentTime(time);

  const isOnSongPage = pathname.startsWith("/song/");

  return (
    <SongContext.Provider value={{ currentSong, isPlaying, currentTime, play, pause, resume, stop, setTime }}>
      {children}
      {currentSong && !isOnSongPage && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=1&controls=0&enablejsapi=1`}
          allow="autoplay"
          style={{ position: "fixed", bottom: 0, right: 0, width: "1px", height: "1px", border: "none", zIndex: -1 }}
        />
      )}
    </SongContext.Provider>
  );
}

export function useSong() { return useContext(SongContext); }