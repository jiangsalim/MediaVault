"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { searchMusic, searchNextPage, scrapeYouTube } from "@/lib/api";

const FILTERS = ["All", "Songs", "Videos", "Artists"];
const API_BASE = 'https://mediavault-website-api.onrender.com/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [nextPageToken, setNextPageToken] = useState("");
  const loaderRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (searchInput.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/suggest?q=${encodeURIComponent(searchInput)}`);
        const data = await res.json();
        setSuggestions(data.data || []);
        setShowSuggestions(true);
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);
  // Suggestions close when user taps a suggestion or presses Enter

  useEffect(() => {
    if (query && !initialLoadDone.current) {
      initialLoadDone.current = true;
      setLoading(true);
      setShowSuggestions(false);
      searchMusic(query).then(res => { setResults(res.data?.videos || []); setNextPageToken(res.data?.nextPageToken || ""); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [query]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting && !loadingMore) loadMore(); }, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextPageToken, loadingMore, results]);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const existingIds = new Set(results.map((r: any) => r.id));
      let moreVideos: any[] = [];

      if (nextPageToken) {
        const res = await searchNextPage(query, nextPageToken);
        moreVideos = res.data?.videos || [];
        setNextPageToken(res.data?.nextPageToken || "");
      } else {
        const res = await searchMusic(query + " songs");
        moreVideos = (res.data?.videos || []).filter((v: any) => !existingIds.has(v.id));
        if (moreVideos.length === 0) {
          moreVideos = await scrapeYouTube(query);
          moreVideos = moreVideos.filter((v: any) => !existingIds.has(v.id));
        }
      }
      setResults(prev => [...prev, ...moreVideos]);
    } catch {}
    setLoadingMore(false);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setShowSuggestions(false); setSuggestions([]); if (searchInput.trim()) { initialLoadDone.current = false; window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`; } };
  const selectSuggestion = (s: string) => { setSearchInput(s); setShowSuggestions(false); initialLoadDone.current = false; window.location.href = `/search?q=${encodeURIComponent(s)}`; };

  const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const formatNum = (n: number) => { if (!n) return ''; if (n >= 1e9) return (n/1e9).toFixed(1)+'B'; if (n >= 1e6) return (n/1e6).toFixed(1)+'M'; if (n >= 1e3) return (n/1e3).toFixed(0)+'K'; return n.toString(); };

  return (
    <>
      <div className="relative mb-4" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className="flex gap-3">
          <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} onFocus={() => { if (searchInput.trim().length >= 2) setShowSuggestions(true); }} placeholder="Search songs, artists..." className="flex-1 rounded-full border border-gray-light bg-white px-5 py-3 text-sm text-charcoal placeholder:text-gray-medium focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal dark:bg-navy dark:text-white dark:border-navy-light" />
          <button type="submit" className="rounded-full bg-gray-light dark:bg-navy px-6 py-3 text-sm font-medium text-charcoal dark:text-white hover:bg-gray-medium/20 transition-colors">🔍</button>
        </div>
      </form></div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-navy-dark rounded-xl border border-gray-light dark:border-navy-light shadow-2xl z-50 overflow-hidden">
            {suggestions.length > 0 && suggestions.map((s, i) => (
              <button key={i} onClick={() => selectSuggestion(s)} className="flex items-center gap-3 w-full px-5 py-3 text-sm text-charcoal dark:text-gray-light hover:bg-gray-light dark:hover:bg-navy transition-colors text-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-medium flex-shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                {s}
              </button>
            ))}
          </div>
        )}

      {query && (
        <>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {FILTERS.map(f => <button key={f} onClick={() => setActiveFilter(f)} className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${activeFilter===f?'bg-navy text-white dark:bg-white dark:text-navy':'bg-gray-light dark:bg-navy text-charcoal dark:text-gray-light hover:bg-gray-medium/20'}`}>{f}</button>)}
          </div>
          {loading ? <div className="space-y-4">{Array.from({length:8}).map((_,i)=><div key={i} className="flex gap-4 animate-pulse"><div className="h-36 w-64 rounded-xl bg-gray-light flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-5 w-3/4 rounded bg-gray-light" /><div className="h-3 w-1/3 rounded bg-gray-light" /></div></div>)}</div> :
           results.length===0 ? <p className="text-center text-charcoal dark:text-gray-light py-10">No results found.</p> :
           <div className="space-y-0 divide-y divide-gray-light dark:divide-navy-light">
            {results.map((song:any)=>(
              <a key={song.id} href={`/song/${song.id}`} className="flex gap-4 py-4 hover:bg-gray-light/50 dark:hover:bg-navy/50 transition-colors group">
                <div className="relative flex-shrink-0 w-40 md:w-56 aspect-video rounded-xl overflow-hidden bg-navy">
                  <img src={thumb(song.id)} alt="" className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}} />
                  {song.duration>0&&<span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">{Math.floor(song.duration/60)+':'+String(Math.floor(song.duration%60)).padStart(2,'0')}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-navy dark:text-white line-clamp-2 mb-1 group-hover:text-teal transition-colors">{song.title}</h3>
                  <p className="text-xs text-gray-medium mb-1">{formatNum(song.views)}{song.views?' views':''}</p>
                  <p className="text-xs text-gray-medium">{song.artist}</p>
                </div>
              </a>
            ))}
            <div ref={loaderRef} className="py-6 text-center">
              {loadingMore ? <span className="text-sm text-gray-medium animate-pulse">Loading more...</span> : <span className="text-sm text-gray-medium">Scroll for more</span>}
            </div>
          </div>}
        </>
      )}

      {!query && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-navy dark:text-white mb-2">Search Music</h2>
          <p className="text-charcoal dark:text-gray-light">Search for songs, artists, or albums from YouTube.</p>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <Layout>
      <section className="py-6">
        <div className="container-site max-w-4xl mx-auto">
          <Suspense fallback={<div className="space-y-4">{Array.from({length:5}).map((_,i)=><div key={i} className="flex gap-4 animate-pulse"><div className="h-36 w-64 rounded-xl bg-gray-light" /><div className="flex-1 space-y-2"><div className="h-5 w-3/4 rounded bg-gray-light" /></div></div>)}</div>}>
            <SearchContent />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
