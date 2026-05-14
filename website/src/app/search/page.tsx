"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { searchMusic, searchNextPage } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [nextPageToken, setNextPageToken] = useState("");
  const loaderRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (query && !initialLoadDone.current) {
      initialLoadDone.current = true;
      setLoading(true);
      searchMusic(query).then(res => {
        setResults(res.data?.videos || []);
        setNextPageToken(res.data?.nextPageToken || "");
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [query]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageToken && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextPageToken, loadingMore]);

  const loadMore = async () => {
    if (!nextPageToken) return;
    setLoadingMore(true);
    try {
      const res = await searchNextPage(query, nextPageToken);
      const newVideos = res.data?.videos || [];
      setResults(prev => [...prev, ...newVideos]);
      setNextPageToken(res.data?.nextPageToken || "");
    } catch (e) {
      // ignore
    }
    setLoadingMore(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      initialLoadDone.current = false;
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
  const dur = (s: number) => { if(!s) return ''; const m=Math.floor(s/60), sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); };

  return (
    <>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search songs, artists..."
            className="flex-1 rounded-md border border-gray-light bg-white px-4 py-3 text-sm text-charcoal placeholder:text-gray-medium focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal dark:bg-navy dark:text-white dark:border-navy-light"
          />
          <button type="submit" className="rounded-md bg-teal px-6 py-3 text-sm font-semibold text-white hover:bg-teal-dark transition-colors">Search</button>
        </div>
      </form>

      {query && (
        <>
          <h1 className="text-xl font-bold text-navy dark:text-white mb-6">Results for "{query}"</h1>
          {loading ? (
            <div className="space-y-3">
              {Array.from({length:10}).map((_,i) => (
                <div key={i} className="flex gap-3 p-3 animate-pulse">
                  <div className="h-14 w-14 rounded-md bg-gray-light flex-shrink-0" />
                  <div className="flex-1 space-y-2"><div className="h-4 w-3/4 rounded bg-gray-light" /><div className="h-3 w-1/2 rounded bg-gray-light" /></div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="text-center text-charcoal dark:text-gray-light py-10">No results found.</p>
          ) : (
            <div className="card-base divide-y divide-gray-light dark:divide-navy-light overflow-hidden">
              {results.map((song: any) => (
                <a key={song.id} href={`/song/${song.id}`} className="flex items-center gap-3 p-3 transition-colors hover:bg-gray-light dark:hover:bg-navy-light overflow-hidden">
                  <img src={thumb(song.id)} alt="" className="h-14 w-14 rounded-md object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="truncate text-sm font-medium text-navy dark:text-white">{song.title}</div>
                    <div className="truncate text-xs text-gray-medium">{song.artist}</div>
                  </div>
                  <span className="text-xs text-gray-medium flex-shrink-0">{dur(song.duration)}</span>
                </a>
              ))}

              {/* Infinite scroll trigger */}
              {nextPageToken && (
                <div ref={loaderRef} className="p-4 text-center">
                  {loadingMore ? (
                    <span className="text-sm text-gray-medium animate-pulse">Loading more...</span>
                  ) : (
                    <span className="text-sm text-gray-medium">Scroll for more</span>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!query && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-navy dark:text-white mb-2">Search Music</h2>
          <p className="text-charcoal dark:text-gray-light">Search for songs, artists, or albums from YouTube and more.</p>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <Layout>
      <section className="py-8">
        <div className="container-site max-w-3xl mx-auto">
          <Suspense fallback={<div className="space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="flex gap-3 p-3 animate-pulse"><div className="h-14 w-14 rounded-md bg-gray-light flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-4 w-3/4 rounded bg-gray-light" /><div className="h-3 w-1/2 rounded bg-gray-light" /></div></div>)}</div>}>
            <SearchContent />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
