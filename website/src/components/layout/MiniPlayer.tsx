"use client";

import { useSong } from "@/lib/song-context";
import { usePathname } from "next/navigation";

export function MiniPlayer() {
  const { currentSong, isPlaying, pause, resume, stop } = useSong();
  const pathname = usePathname();

  // Hide on the song page itself (already has the full player)
  if (!currentSong || pathname.startsWith("/song/")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-navy-dark border-t border-gray-light dark:border-navy-light shadow-lg">
      <div className="container-site flex items-center gap-3 py-2">
        {/* Thumbnail */}
        <img
          src={`https://i.ytimg.com/vi/${currentSong.id}/default.jpg`}
          alt=""
          className="h-10 w-10 rounded object-cover flex-shrink-0"
        />
        {/* Info */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => window.location.href = `/song/${currentSong.id}`}>
          <div className="text-sm font-medium text-navy dark:text-white truncate">{currentSong.title}</div>
          <div className="text-xs text-gray-medium truncate">{currentSong.artist}</div>
        </div>
        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => isPlaying ? pause() : resume()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-light dark:hover:bg-navy transition-colors"
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>
          <button
            onClick={stop}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-light dark:hover:bg-navy transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
