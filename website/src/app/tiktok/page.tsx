"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [searchInput, setSearchInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTrendingFeed().then(data => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setLoading(true);
    const data = await searchTikTok(searchInput.trim());
    setVideos(data);
    setCurrent(0);
    setLoading(false);
  };

  // Scroll to change video
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY > 50 && current < videos.length - 1) {
        // Load more when near the end
        if (current >= videos.length - 5) {
          getTrendingFeed().then(data => {
            setVideos(prev => [...prev, ...data]);
          });
        }
      setCurrent(c => c + 1);
    } else if (e.deltaY < -50 && current > 0) {
      setCurrent(c => c - 1);
    }
  }, [current, videos.length]);

  // Touch swipe
  let touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientY;
    if (diff > 50 && current < videos.length - 1) {
        setCurrent(c => c + 1);
        // Load more when near the end
        if (current >= videos.length - 5) {
          getTrendingFeed().then(data => {
            setVideos(prev => [...prev, ...data]);
          });
        }
      }
    if (diff < -50 && current > 0) setCurrent(c => c - 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-teal border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  const video = videos[current];

  return (
    <Layout>
      <div className="fixed inset-0 bg-black z-40" onWheel={handleWheel} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {/* Search Bar */}
        <div className="absolute top-4 left-0 right-0 z-50 px-4">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="🔍 Search TikTok..."
              className="flex-1 rounded-full bg-white/20 text-white placeholder-white/60 px-4 py-2 text-sm border border-white/30 focus:outline-none"
            />
            <button type="submit" className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white">Search</button>
          </form>
          <div className="text-center text-white/60 text-xs mt-2">{current + 1} / {videos.length}</div>
        </div>

        {/* Video */}
        {video && (
          <div className="h-full w-full flex items-center justify-center" ref={containerRef}>
            <video
              src={video.playUrl}
              poster={video.cover}
              className="max-h-full max-w-full object-contain"
              autoPlay
              loop
              playsInline
              controls
            />
            
            {/* Info Overlay */}
            <div className="absolute bottom-8 left-4 right-4 z-50">
              <div className="flex items-center gap-3 mb-3">
                <img src={video.avatar} alt="" className="w-10 h-10 rounded-full" />
                <span className="text-white font-semibold">@{video.author}</span>
              </div>
              <p className="text-white text-sm mb-3">{video.title}</p>
              <div className="flex items-center gap-4 text-white text-sm mb-4">
                <span>♥ {formatNum(video.likes)}</span>
                <span>💬 {formatNum(video.comments)}</span>
                <span>↗ {formatNum(video.shares)}</span>
              </div>
              <a
                href={video.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-teal px-5 py-2 text-sm font-semibold text-white"
              >
                ⬇ Download
              </a>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
