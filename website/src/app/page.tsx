"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/shared/Button";
import { VideoCard } from "@/components/shared/VideoCard";
import { searchMusic, getTrendingChannels } from "@/lib/api";
import { HeroSearch } from "@/components/home/HeroSearch";

const genreList = ['Gospel','Dancehall','Afrobeat','Hip Hop','Reggae','Bongo Flava','Zouk','R&B','Amapiano','Singeli'];

const trendingSearches = ["trending music 2026", "top hits this week", "popular songs now", "viral songs today", "chart hits", "new music releases", "best songs right now", "hot tracks", "trending afrobeat", "trending bongo flava", "trending dancehall", "trending gospel", "trending hip hop", "new ugandan music"];

export default function Home() {
  const [trending, setTrending] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const shuffled = [...trendingSearches].sort(() => Math.random() - 0.5);
    setLoading(true);
    Promise.all([searchMusic(shuffled[0]), searchMusic(shuffled[1]), getTrendingChannels()])
      .then(([r1, r2, channelsRes]) => {
        const allSongs: any[] = []; const ids = new Set<string>();
        (r1.data?.videos || []).forEach((s: any) => { if (!ids.has(s.id)) { ids.add(s.id); allSongs.push(s); } });
        const secondBatch: any[] = [];
        (r2.data?.videos || []).forEach((s: any) => { if (!ids.has(s.id)) { ids.add(s.id); secondBatch.push(s); } });
        const t = allSongs.slice(0, 8);
        const n = secondBatch.length >= 8 ? secondBatch.slice(0, 8) : [...secondBatch, ...allSongs.filter(s => !secondBatch.find(nn => nn.id === s.id))].slice(0, 8);
        const ch = (channelsRes.data || []).map((c: any) => ({ name: c.title, videoCount: c.videoCount, subscribers: c.subscriberCount, image: c.thumbnail, id: c.id, customUrl: c.customUrl })).slice(0, 6);
        setTrending(t); setNewReleases(n); setArtists(ch);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load. Pull down to refresh."); setLoading(false); });
  }, []);

  const fmtSubs = (n: number) => { if (n>=1e6) return (n/1e6).toFixed(1)+'M subs'; if (n>=1e3) return (n/1e3).toFixed(0)+'K subs'; return n+' subs'; };

  const Skeleton = () => (
    <div className="flex gap-4 py-3 animate-pulse">
      <div className="h-20 w-36 rounded-lg bg-gray-light flex-shrink-0" />
      <div className="flex-1 space-y-2"><div className="h-4 w-3/4 rounded bg-gray-light" /><div className="h-3 w-1/3 rounded bg-gray-light" /></div>
    </div>
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "MediaVault — Free Music Downloads",
    description: "Download free MP3 music, videos, and trending songs from YouTube, TikTok, and more.",
    url: "https://media-vault-website.vercel.app",
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSearch />

      {/* Genre Pills */}
      <div className="py-6">
        <div className="container-site">
          <nav aria-label="Music genres" className="flex gap-2 overflow-x-auto pb-2">
            {genreList.map(g => (
              <a key={g} href={`/search?q=${g.toLowerCase()}`} className="rounded-full bg-gray-light dark:bg-navy px-4 py-1.5 text-xs font-medium text-charcoal dark:text-gray-light whitespace-nowrap hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy transition-colors">{g}</a>
            ))}
          </nav>
        </div>
      </div>

      {error && <div className="container-site pb-4"><div className="card-base p-4 text-center text-error text-sm">{error}</div></div>}
      
      {/* Trending Now + New Releases */}
      <div className="pb-8">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-2">
            <section aria-label="Trending Now">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-navy dark:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                Trending Now
              </h2>
              {trending.length === 0 && loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({length:4}).map((_,i) => <Skeleton key={i} />)}
                </div>
              ) : trending.length === 0 ? (
                <p className="py-4 text-sm text-gray-medium">No trending songs. Pull to refresh.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {trending.map((s, i) => (
                    <VideoCard
                      key={s.id}
                      id={s.id}
                      title={s.title}
                      artist={s.artist}
                      views={s.views || 0}
                      duration={s.duration || 0}
                      publishedAt={s.publishedAt}
                    />
                  ))}
                </div>
              )}
            </section>
            
            <section aria-label="New Releases">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-navy dark:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                New Releases
              </h2>
              {newReleases.length === 0 && loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({length:4}).map((_,i) => <Skeleton key={i} />)}
                </div>
              ) : newReleases.length === 0 ? (
                <p className="py-4 text-sm text-gray-medium">No new releases. Pull to refresh.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {newReleases.map(s => (
                    <VideoCard
                      key={s.id}
                      id={s.id}
                      title={s.title}
                      artist={s.artist}
                      views={s.views || 0}
                      duration={s.duration || 0}
                      publishedAt={s.publishedAt}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      
      {/* Trending Channels */}
      <div className="py-10 bg-gray-light dark:bg-navy">
        <div className="container-site">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-navy dark:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Trending Channels
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {artists.length === 0 && loading ? Array.from({length:6}).map((_,i) => (<div key={i} className="card-base p-4 text-center animate-pulse"><div className="h-16 w-16 rounded-full bg-gray-light mx-auto mb-2" /><div className="h-3 w-2/3 rounded bg-gray-light mx-auto mb-1" /></div>)) :
              artists.length === 0 ? <p className="col-span-full text-center text-sm text-gray-medium">No channels found.</p> :
              artists.map(a => (
                <a key={a.id} href={`https://youtube.com/${a.customUrl || 'channel/'+a.id}`} target="_blank" rel="noopener noreferrer" className="card-base p-4 text-center transition-all hover:shadow-cardHover hover:-translate-y-1">
                  <div className="h-16 w-16 rounded-full overflow-hidden mx-auto mb-2 bg-gray-light"><img src={a.image} alt={a.name} className="h-full w-full object-cover" /></div>
                  <div className="text-sm font-semibold text-navy dark:text-white truncate">{a.name}</div>
                  <div className="text-xs text-gray-medium">{fmtSubs(a.subscribers)}</div>
                </a>
              ))
            }
          </div>
        </div>
      </div>
      
      {/* APK Banner */}
      <div className="py-12 bg-navy text-white">
        <div className="container-site">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,marginBottom:12}}>
                <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,background:"#00C2BA",color:"#fff",padding:"12px 24px",borderRadius:8,textDecoration:"none",fontWeight:600,fontSize:15}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download APK — Free
                </a>
                <div style={{background:"#fff",padding:8,borderRadius:8,display:"inline-block"}}><canvas id="qr-code" width="100" height="100"></canvas></div>
                <p style={{fontSize:12,color:"#8B9DB5"}}>Scan to download v3.0.0</p>
              </div>
              <h2 className="text-white text-2xl font-bold mb-3">Get the Full Experience</h2>
              <p className="text-gray-medium mb-4 text-sm">Video downloads in HD, WhatsApp Status Saver, Private Vault, phone cleaner, and offline access.</p>
              <Button href="https://apkpure.com/mediavault" variant="primary">Download on APKPure — Free</Button>
            </div>
            <div className="text-6xl" aria-hidden="true">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}