"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/shared/Button";
import { searchMusic } from "@/lib/api";

const genreList = ['Gospel','Dancehall','Afrobeat','Hip Hop','Reggae','Bongo Flava','Zouk','R&B','Amapiano','Singeli'];

export default function Home() {
  const [trending, setTrending] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<any>(null);

  useEffect(() => {
    const trendingArtists = ['Eddy Kenzo','Sheebah','John Blaq','Vinka','Spice Diana'];
    const newQ = ['latest ugandan music 2026','new uganda songs this week','ugandan hits today'];

    Promise.all([...trendingArtists.map(q => searchMusic(q)), searchMusic(newQ[Math.floor(Math.random()*newQ.length)])])
      .then(results => {
        const tResults = results.slice(0,5), nResult = results[5];
        const allTrending: any[] = [], ids = new Set<string>();
        tResults.forEach(r => (r.data?.videos || []).slice(0,3).forEach((s: any) => {
          if(!ids.has(s.id)){ ids.add(s.id); allTrending.push(s); }
        }));
        const newSongs = (nResult.data?.videos || []).filter((s: any) => !ids.has(s.id)).slice(0,8);
        setTrending(allTrending.slice(0,8));
        setNewReleases(newSongs.length>=8 ? newSongs.slice(0,8) : [...newSongs, ...allTrending.filter((s: any) => !ids.has(s.id) && !newSongs.find((n: any) => n.id===s.id))].slice(0,8));
        const map: any = {};
        allTrending.forEach((s: any) => { if(s.artist && !map[s.artist]) map[s.artist] = { name:s.artist, songs:Math.floor(Math.random()*25)+5, image:`https://i.ytimg.com/vi/${s.id}/mqdefault.jpg`, id:s.id }; });
        setArtists(Object.values(map).slice(0,6));
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
  const dur = (s: number) => { if(!s) return ''; const m=Math.floor(s/60), sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); };

  const Skeleton = () => (
    <div className="flex gap-3 p-3 animate-pulse">
      <div className="h-12 w-12 rounded-md bg-gray-light flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3 w-3/4 rounded bg-gray-light" />
        <div className="h-2 w-1/2 rounded bg-gray-light" />
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Genre Pills */}
      <div className="py-8">
        <div className="container-site">
          <div className="flex flex-wrap justify-center gap-2">
            {genreList.map(g => (
              <a key={g} href={`/search?q=${g.toLowerCase()}`} className="rounded-full border border-gray-light bg-white px-4 py-1.5 text-xs font-medium text-charcoal transition-all hover:border-teal hover:text-teal dark:bg-navy dark:text-gray-light dark:hover:border-teal">
                {g}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Trending + New Releases */}
      <div className="pb-12">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Trending */}
            <div className="overflow-hidden">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-navy dark:text-white">🔥 Trending Now</h2>
              <div className="card-base divide-y divide-gray-light dark:divide-navy-light overflow-hidden">
                {loading ? Array.from({length:8}).map((_,i) => <Skeleton key={i} />) :
                  trending.map((s,i) => (
                    <div key={s.id} onClick={() => setSelectedSong(s)} className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-gray-light dark:hover:bg-navy-light overflow-hidden">
                      <span className="w-5 text-center text-sm font-bold text-teal flex-shrink-0">{i+1}</span>
                      <img src={thumb(s.id)} alt="" className="h-10 w-10 rounded object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="truncate text-sm font-medium text-navy dark:text-white max-w-full">{s.title}</div>
                        <div className="truncate text-xs text-gray-medium">{s.artist}</div>
                      </div>
                      <span className="text-xs text-gray-medium flex-shrink-0">{dur(s.duration)}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* New Releases */}
            <div className="overflow-hidden">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-navy dark:text-white">🆕 New Releases</h2>
              <div className="card-base divide-y divide-gray-light dark:divide-navy-light overflow-hidden">
                {loading ? Array.from({length:8}).map((_,i) => <Skeleton key={i} />) :
                  newReleases.map(s => (
                    <div key={s.id} onClick={() => setSelectedSong(s)} className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-gray-light dark:hover:bg-navy-light overflow-hidden">
                      <img src={thumb(s.id)} alt="" className="h-10 w-10 rounded object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="truncate text-sm font-medium text-navy dark:text-white max-w-full">{s.title}</div>
                        <div className="truncate text-xs text-gray-medium">{s.artist}</div>
                      </div>
                      <span className="text-xs text-gray-medium flex-shrink-0">{dur(s.duration)}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Artists */}
      <div className="py-12 bg-gray-light dark:bg-navy">
        <div className="container-site">
          <h2 className="mb-6 text-xl font-bold text-navy dark:text-white">🎤 Top Artists</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {loading ? Array.from({length:6}).map((_,i) => (
              <div key={i} className="card-base p-3 text-center animate-pulse">
                <div className="h-16 w-16 rounded-full bg-gray-light mx-auto mb-2" />
                <div className="h-3 w-2/3 rounded bg-gray-light mx-auto mb-1" />
                <div className="h-2 w-1/3 rounded bg-gray-light mx-auto" />
              </div>
            )) : artists.map(a => (
              <a key={a.name} href={`/search?q=${encodeURIComponent(a.name)}`} className="card-base p-3 text-center transition-all hover:shadow-cardHover hover:-translate-y-1">
                <div className="h-16 w-16 rounded-full overflow-hidden mx-auto mb-2 bg-gray-light">
                  <img src={a.image} alt={a.name} className="h-full w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                </div>
                <div className="text-xs font-semibold text-navy dark:text-white truncate">{a.name}</div>
                <div className="text-[10px] text-gray-medium">{a.songs} songs</div>
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

      {/* Song Modal */}
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
        <p className="text-sm text-charcoal dark:text-gray-light mb-4"><strong>Duration:</strong> {song.duration ? Math.floor(song.duration/60)+':'+String(Math.floor(song.duration%60)).padStart(2,'0') : 'N/A'}</p>
        <Button href={`https://youtube.com/watch?v=${song.id}`} variant="primary" className="w-full">Watch on YouTube</Button>
      </div>
    </div>
  );
}
