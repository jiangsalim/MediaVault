"use client";

import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/shared/Button";
import { searchMusic, getTrendingChannels } from "@/lib/api";

const genreList = ['Gospel','Dancehall','Afrobeat','Hip Hop','Reggae','Bongo Flava','Zouk','R&B','Amapiano','Singeli'];

const trendingSearches = [
  'trending music', 'top hits', 'popular songs', 'best music',
  'viral songs', 'chart hits', 'most played', 'new hits',
];

export default function Home() {
  const [trending, setTrending] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const shuffled = [...trendingSearches].sort(() => Math.random() - 0.5);
    Promise.all([
      searchMusic(shuffled[0]),
      searchMusic(shuffled[1]),
      getTrendingChannels(),
    ]).then(([r1, r2, channelsRes]) => {
      const allSongs: any[] = [];
      const ids = new Set<string>();
      (r1.data?.videos || []).forEach((s: any) => { if (!ids.has(s.id)) { ids.add(s.id); allSongs.push(s); } });
      const secondBatch: any[] = [];
      (r2.data?.videos || []).forEach((s: any) => { if (!ids.has(s.id)) { ids.add(s.id); secondBatch.push(s); } });

      setTrending(allSongs.slice(0, 8));
      setNewReleases(secondBatch.length >= 8 ? secondBatch.slice(0, 8) : [...secondBatch, ...allSongs.filter(s => !secondBatch.find(n => n.id === s.id))].slice(0, 8));
      
      const realChannels = (channelsRes.data || []).map((c: any) => ({
        name: c.title, videoCount: c.videoCount, subscribers: c.subscriberCount,
        image: c.thumbnail, id: c.id, customUrl: c.customUrl,
      }));
      setArtists(realChannels.length > 0 ? realChannels.slice(0, 6) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const formatNum = (n: number) => {
    if (!n) return '';
    if (n >= 1e9) return (n/1e9).toFixed(1)+'B';
    if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
    if (n >= 1e3) return (n/1e3).toFixed(0)+'K';
    return n.toString();
  };
  const formatSubs = (n: number) => {
    if (n >= 1e6) return (n/1e6).toFixed(1)+'M subs';
    if (n >= 1e3) return (n/1e3).toFixed(0)+'K subs';
    return n + ' subs';
  };

  const Skeleton = () => (
    <div className="flex gap-4 py-3 animate-pulse">
      <div className="h-20 w-36 rounded-lg bg-gray-light flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-light" />
        <div className="h-3 w-1/3 rounded bg-gray-light" />
        <div className="h-3 w-1/4 rounded bg-gray-light" />
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Genre Pills */}
      <div className="py-6">
        <div className="container-site">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {genreList.map(g => (
              <a key={g} href={`/search?q=${g.toLowerCase()}`} className="rounded-full bg-gray-light dark:bg-navy px-4 py-1.5 text-xs font-medium text-charcoal dark:text-gray-light whitespace-nowrap hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy transition-colors">
                {g}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Trending + New Releases */}
      <div className="pb-8">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-navy dark:text-white">🔥 Trending Now</h2>
              <div className="divide-y divide-gray-light dark:divide-navy-light">
                {loading ? Array.from({length:8}).map((_,i) => <Skeleton key={i} />) :
                  trending.map((s,i) => (
                    <a key={s.id} href={`/song/${s.id}`} className="flex gap-3 py-3 hover:bg-gray-light/50 dark:hover:bg-navy/50 transition-colors group">
                      <span className="w-5 text-center text-sm font-bold text-teal flex-shrink-0 pt-1">{i+1}</span>
                      <div className="relative flex-shrink-0 w-36 aspect-video rounded-lg overflow-hidden bg-navy">
                        <img src={thumb(s.id)} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-navy dark:text-white line-clamp-2 group-hover:text-teal transition-colors">{s.title}</div>
                        <div className="text-xs text-gray-medium mt-1">{s.artist}</div>
                        <div className="text-xs text-gray-medium">{formatNum(s.views)} views</div>
                      </div>
                    </a>
                  ))
                }
              </div>
            </div>

            <div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-navy dark:text-white">🆕 New Releases</h2>
              <div className="divide-y divide-gray-light dark:divide-navy-light">
                {loading ? Array.from({length:8}).map((_,i) => <Skeleton key={i} />) :
                  newReleases.map(s => (
                    <a key={s.id} href={`/song/${s.id}`} className="flex gap-3 py-3 hover:bg-gray-light/50 dark:hover:bg-navy/50 transition-colors group">
                      <div className="relative flex-shrink-0 w-36 aspect-video rounded-lg overflow-hidden bg-navy">
                        <img src={thumb(s.id)} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-navy dark:text-white line-clamp-2 group-hover:text-teal transition-colors">{s.title}</div>
                        <div className="text-xs text-gray-medium mt-1">{s.artist}</div>
                        <div className="text-xs text-gray-medium">{formatNum(s.views)} views</div>
                      </div>
                    </a>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Channels */}
      <div className="py-10 bg-gray-light dark:bg-navy">
        <div className="container-site">
          <h2 className="mb-6 text-xl font-bold text-navy dark:text-white">🎤 Trending Channels</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading ? Array.from({length:6}).map((_,i) => (
              <div key={i} className="card-base p-4 text-center animate-pulse">
                <div className="h-16 w-16 rounded-full bg-gray-light mx-auto mb-2" />
                <div className="h-3 w-2/3 rounded bg-gray-light mx-auto mb-1" />
                <div className="h-2 w-1/2 rounded bg-gray-light mx-auto" />
              </div>
            )) : artists.map(a => (
              <a key={a.id} href={`https://youtube.com/${a.customUrl || 'channel/'+a.id}`} target="_blank" rel="noopener noreferrer" className="card-base p-4 text-center transition-all hover:shadow-cardHover hover:-translate-y-1">
                <div className="h-16 w-16 rounded-full overflow-hidden mx-auto mb-2 bg-gray-light">
                  <img src={a.image} alt={a.name} className="h-full w-full object-cover" />
                </div>
                <div className="text-sm font-semibold text-navy dark:text-white truncate">{a.name}</div>
                <div className="text-xs text-gray-medium">{formatSubs(a.subscribers)}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* App Banner */}
      <div className="py-12 bg-navy text-white">
        <div className="container-site">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-white text-2xl font-bold mb-3">Get the Full Experience</h2>
              <p className="text-gray-medium mb-4 text-sm">Video downloads in HD, WhatsApp Status Saver, Private Vault, phone cleaner, and offline access.</p>
              <Button href="https://apkpure.com/mediavault" variant="primary">Download on APKPure — Free</Button>
            </div>
            <div className="text-6xl">📱</div>
          </div>
        </div>
      </div>

      {selectedSong && <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />}
    </Layout>
  );
}

function SongModal({ song, onClose }: { song: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="card-base max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy dark:text-white pr-4 line-clamp-2">{song.title}</h3>
          <button onClick={onClose} className="p-1 text-gray-medium hover:text-charcoal flex-shrink-0">✕</button>
        </div>
        <img src={`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`} alt="" className="w-full rounded-md mb-4" />
        <p className="text-sm text-charcoal dark:text-gray-light mb-2"><strong>Artist:</strong> {song.artist}</p>
        <Button href={`/song/${song.id}`} variant="primary" className="w-full">View Details</Button>
      </div>
    </div>
  );
}
