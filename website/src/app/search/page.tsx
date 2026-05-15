"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { searchMusic } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const hasLoaded = useRef(false);

  // Fetch suggestions
  useEffect(() => {
    if (searchInput.trim().length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://mediavault-website-api.onrender.com/api/suggest?q=${encodeURIComponent(searchInput)}`);
        const data = await res.json();
        setSuggestions(data.data || []);
        if (!query) setShowSuggestions(true);
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Load results when query changes
  useEffect(() => {
    if (query && !hasLoaded.current) {
      hasLoaded.current = true;
      setLoading(true);
      setShowSuggestions(false);
      setSuggestions([]);
      searchMusic(query).then(res => {
        setResults(res.data?.videos || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [query]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore && results.length > 0) {
        loadMore();
      }
    }, { threshold: 0.1 });
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [loadingMore, results]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const existingIds = new Set(results.map((r: any) => r.id));
      const vq = query + " songs";
      const res = await searchMusic(vq);
      const more = (res.data?.videos || []).filter((v: any) => !existingIds.has(v.id));
      setResults(prev => [...prev, ...more]);
    } catch {}
    setLoadingMore(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    if (searchInput.trim()) {
      hasLoaded.current = false;
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  const selectSuggestion = (s: string) => {
    setSearchInput(s);
    setShowSuggestions(false);
    setSuggestions([]);
    hasLoaded.current = false;
    window.location.href = `/search?q=${encodeURIComponent(s)}`;
  };

  const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const fmt = (n: number) => { if (!n) return ""; if (n>=1e9) return (n/1e9).toFixed(1)+"B"; if (n>=1e6) return (n/1e6).toFixed(1)+"M"; if (n>=1e3) return (n/1e3).toFixed(0)+"K"; return n.toString(); };
  const dur = (s: number) => { const m = Math.floor(s/60), sec = Math.floor(s%60); return m+":"+String(sec).padStart(2,"0"); };

  return (
    <>
      <div className="relative mb-4" ref={searchRef}>
        <form onSubmit={handleSearch}>
          <div className="flex gap-3">
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }} placeholder="Search songs, artists..." className="flex-1 rounded-full border border-gray-light bg-white px-5 py-3 text-sm text-charcoal placeholder:text-gray-medium focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal dark:bg-navy dark:text-white dark:border-navy-light" />
            <button type="submit" className="rounded-full bg-gray-light dark:bg-navy px-6 py-3 text-sm font-medium text-charcoal dark:text-white hover:bg-gray-medium/20 transition-colors">🔍</button>
          </div>
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-navy-dark rounded-xl border border-gray-light dark:border-navy-light shadow-2xl z-50 overflow-hidden">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => selectSuggestion(s)} className="flex items-center gap-3 w-full px-5 py-3 text-sm text-charcoal dark:text-gray-light hover:bg-gray-light dark:hover:bg-navy transition-colors text-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {query && (
        <>
          {loading ? (
            <div className="space-y-4">{Array.from({length:8}).map((_,i)=><div key={i} className="flex gap-4 animate-pulse"><div className="h-36 w-64 rounded-xl bg-gray-light flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-5 w-3/4 rounded bg-gray-light" /></div></div>)}</div>
          ) : results.length === 0 ? (
            <p className="text-center text-charcoal dark:text-gray-light py-10">No results found.</p>
          ) : (
            <div className="divide-y divide-gray-light dark:divide-navy-light">
              {results.map((song:any)=>(
                <a key={song.id} href={`/song/${song.id}`} className="flex gap-4 py-4 hover:bg-gray-light/50 dark:hover:bg-navy/50 transition-colors group">
                  <div className="relative flex-shrink-0 w-40 md:w-56 aspect-video rounded-xl overflow-hidden bg-navy">
                    <img src={thumb(song.id)} alt="" className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
                    {song.duration>0&&<span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">{dur(song.duration)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-navy dark:text-white line-clamp-2 mb-1 group-hover:text-teal transition-colors">{song.title}</h3>
                    <p className="text-xs text-gray-medium mb-1">{fmt(song.views)}{song.views?" views":""}</p>
                    <p className="text-xs text-gray-medium">{song.artist}</p>
                  </div>
                </a>
              ))}
              <div ref={loaderRef} className="py-6 text-center">
                {loadingMore ? <span className="text-sm text-gray-medium animate-pulse">Loading more...</span> : <span className="text-sm text-gray-medium">Scroll for more</span>}
              </div>
            </div>
          )}
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
          <Suspense fallback={<div className="space-y-4">{Array.from({length:5}).map((_,i)=><div key={i} className="flex gap-4 animate-pulse"><div className="h-36 w-64 rounded-xl bg-gray-light" /></div>)}</div>}>
            <SearchContent />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
