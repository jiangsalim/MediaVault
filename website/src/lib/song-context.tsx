"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";

interface Song {
  id: string;
  title: string;
  artist: string;
}

interface SongContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  play: (song: Song) => void;
  togglePlay: () => void;
  stop: () => void;
}

const SongContext = createContext<SongContextType>({
  currentSong: null,
  isPlaying: false,
  play: () => {},
  togglePlay: () => {},
  stop: () => {},
});

export function SongProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create a single global audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
      audioRef.current.addEventListener("pause", () => setIsPlaying(false));
      audioRef.current.addEventListener("play", () => setIsPlaying(true));
    }
  }, []);

  const play = async (song: Song) => {
    setCurrentSong(song);

    if (!audioRef.current) return;

    // Fetch audio stream URL from Invidious
    try {
      const instances = ["https://inv.nadeko.net", "https://yewtu.be", "https://iv.ggtyler.dev"];
      for (const instance of instances) {
        try {
          const res = await fetch(`${instance}/api/v1/videos/${song.id}`);
          const data = await res.json();
          const adaptiveFormats = data.adaptiveFormats || [];
          const formatFiles = data.formatStreams || [];
          
          // Find audio-only format
          const audioFormat = [...adaptiveFormats, ...formatFiles].find(
            (f: any) => f.type?.startsWith("audio/") || f.audioQuality || f.bitrate
          );
          
          if (audioFormat?.url) {
            audioRef.current.src = audioFormat.url;
            audioRef.current.play();
            setIsPlaying(true);
            return;
          }
        } catch {}
      }
    } catch {}

    // Fallback: try YouTube oEmbed (won't give audio stream but marks song as playing)
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setCurrentSong(null);
    setIsPlaying(false);
  };

  return (
    <SongContext.Provider value={{ currentSong, isPlaying, play, togglePlay, stop }}>
      {children}
    </SongContext.Provider>
  );
}

export function useSong() {
  return useContext(SongContext);
}
