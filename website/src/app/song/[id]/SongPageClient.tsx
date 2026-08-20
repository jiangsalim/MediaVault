"use client";

import { useState, useEffect } from "react";
import { useSong } from "@/lib/song-context";
import { useParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { getSongDetails } from "@/lib/api";

export default function SongPageClient() {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<any>(null);
  const { play } = useSong();
  const [loading, setLoading] = useState(true);
  const [showDesc, setShowDesc] = useState(false);
  const [copied, setCopied] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mediavault-o52i.onrender.com';
  const siteUrl = "https://media-vault-website.vercel.app";

  useEffect(() => {
    if (id) {
      getSongDetails(id).then(res => {
        setSong(res.data);
        setLoading(false);
        if (res.data?.title) {
          play({ id, title: res.data.title, artist: res.data.artist });

          // Update document title for SEO
          document.title = `${res.data.title} — ${res.data.artist} | MediaVault`;

          // Update meta description
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute("content", `Download ${res.data.title} by ${res.data.artist}. Free MP3 download from MediaVault.`);
          }

          // Update Open Graph tags
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle) ogTitle.setAttribute("content", `${res.data.title} — ${res.data.artist}`);

          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage && res.data.thumbnail) ogImage.setAttribute("content", res.data.thumbnail);
        }
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
    const url = `${backendUrl}/api/download/${type}/${id}`;
    window.open(url, '_blank');
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

  // Structured Data for Music Video
  const musicVideoLd = {
    "@context": "https://schema.org",
    "@type": "MusicVideo",
    name: song.title,
    description: song.description || "",
    byArtist: song.artist,
    thumbnailUrl: song.thumbnail || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    url: `${siteUrl}/song/${id}`,
    genre: song.genre || "Music",
    datePublished: song.publishedAt || "",
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: song.views || 0,
    },
  };

  // Breadcrumb Schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Songs",
        item: `${siteUrl}/search`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: song.title,
        item: `${siteUrl}/song/${id}`,
      },
    ],
  };

  return (
    <Layout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicVideoLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-0">
          <div className="lg:w-[65%] lg:max-h-screen lg:overflow-y-auto">
            <div className="lg:sticky lg:top-16 z-30 bg-black">
              <div className="aspect-video">
                <iframe 
                  src={`https://www.youtube.com/embed/${id}?autoplay=1&controls=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`} 
                  className="w-full h-full" 
                  allowFullScreen 
                  allow="autoplay; encrypted-media" 
                />
              </div>
            </div>

            <div className="p-4 md:p-6">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-3 text-xs text-gray-medium">
                <a href="/" className="hover:text-teal">Home</a>
                <span className="mx-1">/</span>
                <a href="/search" className="hover:text-teal">Songs</a>
                <span className="mx-1">/</span>
                <span className="text-navy dark:text-white truncate">{song.title}</span>
              </nav>

              <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white mb-2">{song.title}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                {song.channel?.thumbnail && <img src={song.channel.thumbnail} alt={song.artist} className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <a href={`https://youtube.com/channel/${song.channel?.id}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy dark:text-white hover:text-teal">{song.artist}</a>
                  {song.channel?.subscriberCount > 0 && <p className="text-xs text-gray-medium">{formatNum(song.channel.subscriberCount)} subscribers</p>}
                </div>
                {song.channel?.id && (
                  <a href={`https://youtube.com/channel/${song.channel.id}`} target="_blank" rel="noopener noreferrer" className="ml-auto rounded-full bg-navy dark:bg-white text-white dark:text-navy px-4 py-2 text-sm font-medium hover:opacity-80 transition-opacity">Subscribe</a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4 p-3 rounded-md bg-gray-light dark:bg-navy">
                {song.views > 0 && (
                  <span className="flex items-center gap-1 text-sm text-charcoal dark:text-gray-light">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    {formatNum(song.views)} views
                  </span>
                )}
                {song.likes > 0 && (
                  <span className="flex items-center gap-1 text-sm text-charcoal dark:text-gray-light">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    {formatNum(song.likes)}
                  </span>
                )}
                {song.duration > 0 && (
                  <span className="flex items-center gap-1 text-sm text-charcoal dark:text-gray-light">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {formatDur(song.duration)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => handleShare('whatsapp')} className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:opacity-80">WhatsApp</button>
                <button onClick={() => handleShare('twitter')} className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-80">Share on X</button>
                <button onClick={() => handleShare('facebook')} className="rounded-full bg-[#1877F2] px-4 py-2 text-sm font-medium text-white hover:opacity-80">Share</button>
                <button onClick={handleCopyLink} className="rounded-full border border-gray-light px-4 py-2 text-sm font-medium text-charcoal dark:text-white hover:bg-gray-light dark:hover:bg-navy">{copied ? 'Copied!' : 'Copy Link'}</button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => handleDownload('mp3')} className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark transition-colors flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                  Download MP3
                </button>
                <button onClick={() => handleDownload('video')} className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark transition-colors flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="14" height="18" rx="2"/><polygon points="22 7 16 12 22 17"/></svg>
                  Download Video
                </button>
                <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-navy dark:border-white px-5 py-2.5 text-sm font-semibold text-navy dark:text-white hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy transition-colors flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Watch on YouTube
                </a>
              </div>

              {song.description && (
                <div className="card-base p-4 mb-4">
                  <div className={`text-sm text-charcoal dark:text-gray-light whitespace-pre-wrap ${!showDesc && 'line-clamp-3'}`}>{song.description}</div>
                  {song.description.length > 150 && (
                    <button onClick={() => setShowDesc(!showDesc)} className="text-sm text-teal mt-1 hover:underline">{showDesc ? 'Show less' : 'Show more'}</button>
                  )}
                </div>
              )}

              <a href={`https://youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-teal hover:underline">View comments on YouTube</a>
            </div>
          </div>

          <div className="lg:w-[35%] lg:max-h-screen lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-light dark:border-navy-light">
            <div className="p-4">
              <h2 className="text-lg font-bold text-navy dark:text-white mb-4">Related Videos</h2>
              <div className="space-y-3">
                {song.related?.map((r: any) => (
                  <a key={r.id} href={`/song/${r.id}`} className="flex gap-3 p-2 rounded-md hover:bg-gray-light dark:hover:bg-navy transition-colors group">
                    <div className="relative flex-shrink-0">
                      <img src={thumb(r.thumbnail)} alt={r.title} className="h-20 w-36 rounded-md object-cover" />
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