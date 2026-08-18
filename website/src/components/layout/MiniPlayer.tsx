"use client";

import { useSong } from "@/lib/song-context";
import { useState, useRef } from "react";

export function MiniPlayer() {
  const { currentSong, isPlaying, currentTime, duration, pause, resume, stop, seekTo, isMiniPlayerActive } = useSong();
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const dragRef = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggable, setDraggable] = useState(true);

  if (!currentSong || !isMiniPlayerActive) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      offsetX: position.x,
      offsetY: position.y,
    };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !dragRef.current) return;
    const newX = dragRef.current.offsetX + (dragRef.current.startX - clientX);
    const newY = dragRef.current.offsetY + (dragRef.current.startY - clientY);

    const playerWidth = 320;
    const playerHeight = 250;
    const maxX = window.innerWidth - playerWidth - 16;
    const maxY = window.innerHeight - playerHeight - 16;

    setPosition({
      x: Math.max(16, Math.min(newX, maxX)),
      y: Math.max(16, Math.min(newY, maxY)),
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragRef.current = null;
  };

  return (
    <div
      style={{
        position: "fixed",
        right: position.x,
        bottom: position.y,
        zIndex: 9998,
        touchAction: "none",
      }}
      className="w-[280px] sm:w-[320px] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 select-none"
    >
      {/* Video area */}
      <div className="relative aspect-video bg-black">
        <iframe
          key={currentSong.id}
          src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=${isPlaying ? 1 : 0}&controls=0&enablejsapi=1&playsinline=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
        />

        {/* DRAG OVERLAY - captures all drag events */}
        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          onMouseDown={(e) => {
            e.preventDefault();
            setDraggable(true);
            handleDragStart(e.clientX, e.clientY);
          }}
          onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            setDraggable(true);
            handleDragStart(touch.clientX, touch.clientY);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handleDragMove(touch.clientX, touch.clientY);
          }}
          onTouchEnd={handleDragEnd}
        />

        {/* Drag handle indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-1 opacity-60 pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <circle cx="8" cy="12" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="16" cy="12" r="1.5"/>
          </svg>
        </div>

        {/* Close button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            stop();
          }} 
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 transition-colors z-20"
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Controls area */}
      <div className="p-2.5">
        {/* Progress bar */}
        <div 
          className="w-full h-1 bg-gray-800 rounded-full cursor-pointer mb-2"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            seekTo(Math.floor(pct * duration));
          }}
        >
          <div className="h-full bg-red-600 rounded-full" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center gap-2">
          {/* Title / Artist */}
          <a href={`/song/${currentSong.id}`} className="flex-1 min-w-0 cursor-pointer">
            <div className="text-xs font-semibold text-white truncate">{currentSong.title}</div>
            <div className="text-[10px] text-gray-400 truncate">{currentSong.artist}</div>
          </a>

          {/* Time */}
          <span className="hidden sm:flex text-[10px] text-gray-400 flex-shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Play/Pause */}
          <button 
            onClick={() => isPlaying ? pause() : resume()} 
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors flex-shrink-0 z-20"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}