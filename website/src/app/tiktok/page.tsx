"use client";

import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { getTrendingFeed, searchTikTok } from "@/lib/tiktok-api";

function formatNum(n: number) {
  if (!n) return "0";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return n.toString();
}

export default function TikTokPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [tab, setTab] = useState<"foryou" | "following">("foryou");
  const touchStart = useRef(0);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  useEffect(() => {
    getTrendingFeed(50).then(data => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  const loadMore = async () => {
    const data = await getTrendingFeed(30);
    setVideos(prev => [...prev, ...data]);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setShowSearch(false);
    setLoading(true);
    const data = await searchTikTok(searchInput.trim(), 50);
    setVideos(data);
    setCurrent(0);
    setLoading(false);
  };

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientY;
    if (diff > 60 && current < videos.length - 1) {
      setCurrent(c => c + 1);
      if (current >= videos.length - 5) loadMore();
    }
    if (diff < -60 && current > 0) {
      setCurrent(c => c - 1);
    }
  };

  // Pause/play on tap
  const handleVideoTap = () => {
    const video = videoRefs.current.get(current);
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (videos.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
          <div className="text-center">
            <div className="text-5xl mb-4">🎵</div>
            <p>No videos found</p>
          </div>
        </div>
      </Layout>
    );
  }

  const video = videos[current];

  return (
    <Layout>
      <div className="fixed inset-0 bg-black z-40" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        
        {/* Top Tabs */}
        <div className="absolute top-2 left-0 right-0 z-50 flex justify-center gap-8 pt-4">
          <button
            onClick={() => setTab("following")}
            className={`text-sm font-semibold pb-1 transition-all ${tab === "following" ? "text-white border-b-2 border-white" : "text-white/60"}`}
          >
            Following
          </button>
          <button
            onClick={() => setTab("foryou")}
            className={`text-sm font-semibold pb-1 transition-all ${tab === "foryou" ? "text-white border-b-2 border-white" : "text-white/60"}`}
          >
            For You
          </button>
        </div>

        {/* Search Icon */}
        <button
          onClick={() => setShowSearch(true)}
          className="absolute top-4 right-4 z-50 text-white text-xl"
        >
          🔍
        </button>

        {/* Search Overlay */}
        {showSearch && (
          <div className="absolute inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-6">
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search TikTok"
                className="w-full rounded-full bg-white/20 text-white placeholder-white/50 px-5 py-3 text-base border border-white/30 focus:outline-none focus:border-teal mb-3"
                autoFocus
              />
              <button type="submit" className="w-full rounded-full bg-teal py-3 text-white font-semibold">Search</button>
            </form>
            <button onClick={() => setShowSearch(false)} className="mt-4 text-white/60 text-sm">Cancel</button>
          </div>
        )}

        {/* Video Player */}
        <div className="h-full w-full flex items-center justify-center" onClick={handleVideoTap}>
          <video
            ref={el => { if (el) videoRefs.current.set(current, el); }}
            src={video.playUrl}
            poster={video.cover}
            className="h-full w-full object-cover"
            autoPlay
            loop
            playsInline
            muted={false}
          />

          {/* Pause Indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center opacity-0 transition-opacity" id="pause-indicator">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-3 bottom-28 z-50 flex flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-1">
              <img src={video.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white" />
              <button className="w-6 h-6 rounded-full bg-teal flex items-center justify-center text-white text-xs font-bold">+</button>
            </div>
            <button className="flex flex-col items-center gap-1 text-white">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <span className="text-xs font-semibold">{formatNum(video.likes)}</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-white">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span className="text-xs font-semibold">{formatNum(video.comments)}</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-white">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              <span className="text-xs font-semibold">{formatNum(video.shares)}</span>
            </button>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-16 left-4 right-20 z-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-semibold text-sm">@{video.author}</span>
              <button className="text-white text-xs border border-white/40 rounded-full px-3 py-0.5">Follow</button>
            </div>
            <p className="text-white text-sm mb-2 line-clamp-2">{video.title}</p>
            <div className="flex items-center gap-1 text-white/80 text-xs">
              <span>🎵</span>
              <span className="truncate">Original Sound - {video.author}</span>
            </div>
          </div>

          {/* Download Button */}
          <a
            href={video.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-4 z-50 rounded-full bg-teal/90 px-4 py-2 text-xs font-semibold text-white"
          >
            ⬇ Download
          </a>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30 z-50">
            <div className="h-full bg-white transition-all duration-300" style={{ width: `${((current + 1) / videos.length) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
