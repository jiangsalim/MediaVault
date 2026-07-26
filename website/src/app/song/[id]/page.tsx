"use client";

import { useState, useEffect } from "react";
import { useSong } from "@/lib/song-context";
import { useParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/shared/Button";
import { getSongDetails } from "@/lib/api";

export default function SongPage() {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<any>(null);
  const { play, setTime } = useSong();
  const [loading, setLoading] = useState(true);
  const [showDesc, setShowDesc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<'mp3' | 'video' | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mediavault-website-api.onrender.com';

  useEffect(() => {
    // Save playback position before leaving
    return () => {
      try {
        const iframe = document.querySelector('iframe[src*="youtube.com/embed"]') as HTMLIFrameElement;
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage('{"event":"command","func":"getCurrentTime","args":""}', '*');
        }
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (id) {
      getSongDetails(id).then(res => {
        setSong(res.data);
        setLoading(false);
        if (res.data?.title) { const songData = { id, title: res.data.title, artist: res.data.artist }; play(songData); }
      }).catch(() => setLoading(false));
    }
  }, [id]);

  const formatNum = (n: number) => {
    if (!n) return '0';
    if (n >= 1e9) return (n/1e9).toFixed(1)+'B';
    if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
    if (n >= 1e3) return (n/1e3).toFixed(0)+'K';
    return n.toString();
  };
  const formatDur = (s: number) => {
    if (!s) return '0:00';
    const m = Math.floor(s/60), sec = Math.floor(s%60);
    return m+':'+String(sec).padStart(2,'0');
  };
  const thumb = (url: string) => url || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = song?.title || '';
    const links: any = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    if (links[platform]) window.open(links[platform], '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (type: 'mp3' | 'video') => {
    setDownloading(type);
    
    const url = type === 'mp3'
      ? `${backendUrl}/api/download/mp3/${id}`
      : `${backendUrl}/api/download/video/${id}`;

    // Create an anchor and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset button after a moment
    setTimeout(() => setDownloading(null), 2000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-site max-w-5xl mx-auto py-8 animate-pulse">
          <div className="aspect-video bg-gray-light rounded-md mb-4" />
          <div className="h-6 w-3/4 bg-gray-light rounded mb-2" />
          <div className="h-4 w-1/3 bg-gray-light rounded" />
        </div>
      </Layout>
    );
  }

  if (!song) {
    return <Layout><div className="text-center py-20">Song not found.</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-0">
          <div className="lg:w-[65%] lg:max-h-screen lg:overflow-y-auto">
            <div className="lg:sticky lg:top-16 z-30 bg-black">
              <div className="aspect-video">
                <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1`} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
              </div>
            </div>

            <div className="p-4 md:p-6">
              <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white mb-2">{song.title}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                {song.channel?.thumbnail && <img src={song.channel.thumbnail} alt="" className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <a href={`https://youtube.com/channel/${song.channel?.id}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy dark:text-white hover:text-teal">{song.artist}</a>
                  {song.channel?.subscriberCount > 0 && <p className="text-xs text-gray-medium">{formatNum(song.channel.subscriberCount)} subscribers</p>}
                </div>
                {song.channel?.id && (
                  <a href={`https://youtube.com/channel/${song.channel.id}`} target="_blank" rel="noopener noreferrer" className="ml-auto rounded-full bg-navy dark:bg-white text-white dark:text-navy px-4 py-2 text-sm font-medium hover:opacity-80 transition-opacity">Subscribe</a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4 p-3 rounded-md bg-gray-light dark:bg-navy">
                {song.views > 0 && <span className="text-sm text-charcoal dark:text-gray-light">👁 {formatNum(song.views)} views</span>}
                {song.likes > 0 && <span className="text-sm text-charcoal dark:text-gray-light">👍 {formatNum(song.likes)}</span>}
                {song.duration > 0 && <span className="text-sm text-charcoal dark:text-gray-light">⏱ {formatDur(song.duration)}</span>}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => handleShare('whatsapp')} className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:opacity-80">📱 WhatsApp</button>
                <button onClick={() => handleShare('twitter')} className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-80">𝕏 Share</button>
                <button onClick={() => handleShare('facebook')} className="rounded-full bg-[#1877F2] px-4 py-2 text-sm font-medium text-white hover:opacity-80">📘 Share</button>
                <button onClick={handleCopyLink} className="rounded-full border border-gray-light px-4 py-2 text-sm font-medium text-charcoal dark:text-white hover:bg-gray-light dark:hover:bg-navy">{copied ? '✅ Copied!' : '🔗 Copy Link'}</button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  onClick={() => handleDownload('mp3')} 
                  disabled={downloading === 'mp3'}
                  className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark transition-colors disabled:opacity-50"
                >
                  {downloading === 'mp3' ? '⏳ Preparing MP3...' : '🎵 Download MP3'}
                </button>
                <button 
                  onClick={() => handleDownload('video')} 
                  disabled={downloading === 'video'}
                  className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark transition-colors disabled:opacity-50"
                >
                  {downloading === 'video' ? '⏳ Preparing Video...' : '🎬 Download Video'}
                </button>
                <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-navy dark:border-white px-5 py-2.5 text-sm font-semibold text-navy dark:text-white hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy transition-colors">▶ Watch on YouTube</a>
              </div>

              {song.description && (
                <div className="card-base p-4 mb-4">
                  <div className={`text-sm text-charcoal dark:text-gray-light whitespace-pre-wrap ${!showDesc && 'line-clamp-3'}`}>{song.description}</div>
                  {song.description.length > 150 && (
                    <button onClick={() => setShowDesc(!showDesc)} className="text-sm text-teal mt-1 hover:underline">{showDesc ? 'Show less' : 'Show more'}</button>
                  )}
                </div>
              )}

              <a href={`https://youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-teal hover:underline">💬 View comments on YouTube →</a>
            </div>
          </div>

          <div className="lg:w-[35%] lg:max-h-screen lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-light dark:border-navy-light">
            <div className="p-4">
              <h2 className="text-lg font-bold text-navy dark:text-white mb-4">Related Videos</h2>
              <div className="space-y-3">
                {song.related?.map((r: any) => (
                  <a key={r.id} href={`/song/${r.id}`} className="flex gap-3 p-2 rounded-md hover:bg-gray-light dark:hover:bg-navy transition-colors group">
                    <div className="relative flex-shrink-0">
                      <img src={thumb(r.thumbnail)} alt="" className="h-20 w-36 rounded-md object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-navy dark:text-white line-clamp-2 group-hover:text-teal transition-colors">{r.title}</div>
                      <div className="text-xs text-gray-medium mt-1">{r.artist}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}