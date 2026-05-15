"use client";

import { useState, useRef, useEffect } from "react";

interface VideoCardProps {
  id: string;
  title: string;
  artist: string;
  views: number;
  duration: number;
  publishedAt?: string;
  isLive?: boolean;
  isMusic?: boolean;
}

export function VideoCard({ id, title, artist, views, duration, publishedAt, isLive, isMusic }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<any>(null);

  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const fmt = (n: number) => {
    if (!n) return "0";
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
    return n.toString();
  };
  const dur = (s: number) => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ":" + String(sec).padStart(2, "0");
  };
  const timeAgo = (d: string) => {
    if (!d) return "";
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + "m ago";
    if (hours < 24) return hours + "h ago";
    if (days < 7) return days + "d ago";
    if (weeks < 5) return weeks + "w ago";
    return months + "mo ago";
  };

  // Hover autoplay: show iframe when card is in view and near top
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && entries[0].intersectionRatio > 0.6) {
          timer.current = setTimeout(() => {
            setShowIframe(true);
          }, 1500);
        } else {
          clearTimeout(timer.current);
          setShowIframe(false);
        }
      },
      { threshold: [0, 0.6] }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="video-card group cursor-pointer">
      <a href={`/song/${id}`} className="block">
        {/* Thumbnail */}
        <div className="card-thumb">
          {showIframe ? (
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1&rel=0`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
            />
          ) : (
            <img src={thumb} alt={title} className="w-full h-full object-cover" loading="lazy" />
          )}

          {/* LIVE Badge */}
          {isLive && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              🔴 LIVE
            </span>
          )}

          {/* Music/Audio Badge */}
          {isMusic && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="bg-black/60 rounded-full p-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              </div>
            </div>
          )}

          {/* Duration Badge */}
          {duration > 0 && (
            <span className="card-duration">{dur(duration)}</span>
          )}
        </div>

        {/* Info */}
        <div className="card-body">
          <div className="card-title group-hover:text-teal transition-colors">{title}</div>
          <div className="card-meta">
            <span>{artist}</span>
            <span>·</span>
            <span>{fmt(views)} views</span>
            {publishedAt && <span>· {timeAgo(publishedAt)}</span>}
          </div>
        </div>
      </a>
    </div>
  );
}
