"use client";

import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { getTrendingFeed } from "@/lib/tiktok-api";

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
  const touchStartY = useRef(0);

  const loadMore = async () => {
    const data = await getTrendingFeed(30);
    setVideos(prev => {
      const existingIds = new Set(prev.map(v => v.id));
      const newVideos = data.filter(v => !existingIds.has(v.id));
      return [...prev, ...newVideos];
    });
  };

  useEffect(() => {
    if (current >= videos.length - 3 && videos.length > 0) {
      loadMore();
    }
  }, [current]);

  useEffect(() => {
    getTrendingFeed(50).then(data => {
      if (data.length > 0) setVideos(data);
      else setVideos([]);
      setLoading(false);
    });
  }, []);

  const goNext = () => {
    if (current < videos.length - 1) setCurrent(c => c + 1);
  };

  const goPrev = () => {
    if (current > 0) setCurrent(c => c - 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 60) goNext();
    if (diff < -60) goPrev();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="animate-spin h-10 w-10 border-4 border-teal border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (videos.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
          <div className="text-center">
            <p>No videos available</p>
          </div>
        </div>
      </Layout>
    );
  }

  const video = videos[current];

  return (
    <Layout>
      <div className="fixed inset-0 bg-black z-40" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 pt-4 pb-2 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex justify-center gap-8">
            <button className="text-sm font-semibold text-white/60 pb-1">Following</button>
            <button className="text-sm font-semibold text-white border-b-2 border-teal pb-1">For You</button>
          </div>
        </div>

        {/* Video Counter */}
        <div className="absolute top-16 left-0 right-0 text-center z-50">
          <span className="text-white/50 text-xs">{current + 1} / {videos.length}</span>
        </div>

        {/* TikTok Embed Player */}
        {video && (
          <div className="h-full w-full flex items-center justify-center pt-16 pb-16">
            <iframe
              src={`https://www.tiktok.com/embed/v2/${video.id}`}
              className="w-full h-full max-w-[400px]"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        )}

        {/* Navigation Arrows */}
        <button onClick={goPrev} disabled={current === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white disabled:opacity-30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button onClick={goNext} disabled={current >= videos.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white disabled:opacity-30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        {/* Bottom Info */}
        <div className="absolute bottom-6 left-4 right-16 z-50">
          <p className="text-white text-sm font-medium line-clamp-2">{video?.title || "TikTok Video"}</p>
          {video?.author && <p className="text-white/60 text-xs mt-1">@{video.author}</p>}
        </div>

        {/* Download Button */}
        {video?.downloadUrl && (
          <a href={video.downloadUrl} target="_blank" rel="noopener noreferrer"
            className="absolute bottom-6 right-4 z-50 rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="inline mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </a>
        )}
      </div>
    </Layout>
  );
}