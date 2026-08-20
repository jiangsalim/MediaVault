"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { VideoCard } from "@/components/shared/VideoCard";
import { searchMusic, searchNextPage } from "@/lib/api";

const FILTERS = ["All", "Songs", "Videos", "Artists"];
const API_BASE = 'https://mediavault-o52i.onrender.com/api';
const SITE_URL = 'https://media-vault-website.vercel.app';

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
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('mv_search_history') || '[]'); } catch { return []; }
  });
  const loaderRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  const saveToHistory = (term: string) => {
    const updated = [term, ...searchHistory.filter(h => h !== term)].slice(0, 10);
    setSearchHistory(updated);
    localStorage.setItem('mv_search_history', JSON.stringify(updated));
  };

  // Update SEO metadata when query changes
  useEffect(() => {
    if (query) {
      document.title = `${query} — Search Results | MediaVault`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", `Search results for "${query}". Download free MP3 music, trending songs, and videos from MediaVault.`);
      }
    }
  }, [query]);

  // Fetch suggestions
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

  // Auto-clear when input emptied
  useEffect(() => {
    if (searchInput.trim() === '' && query) {
      window.location.href = '/search';
    }
  }, [searchInput]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Load results
  useEffect(() => {
    if (query && !initialLoadDone.current) {
      setShowSuggestions(false);
      setSuggestions([]);
      initialLoadDone.current = true;
      setLoading(true);
      saveToHistory(query);
      
      let searchQuery = query;
      if (activeFilter === "Songs") searchQuery = query + " song";
      else if (activeFilter === "Videos") searchQuery = query + " video";
      else if (activeFilter === "Artists") searchQuery = query + " artist channel";
      
      searchMusic(searchQuery).then(res => {
        setResults(res.data?.videos || []);
        setNextPageToken(res.data?.nextPageToken || "");
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [query]);

  // Refetch on filter change
  useEffect(() => {
    if (query && initialLoadDone.current) {
      setLoading(true);
      let searchQuery = query;
      if (activeFilter === "Songs") searchQuery = query + " song";
      else if (activeFilter === "Videos") searchQuery = query + " video";
      else if (activeFilter === "Artists") searchQuery = query + " artist channel";
      
      searchMusic(searchQuery).then(res => {
        setResults(res.data?.videos || []);
        setNextPageToken(res.data?.nextPageToken || "");
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [activeFilter]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageToken && !loadingMore) loadMore();
    }, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextPageToken, loadingMore]);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      if (nextPageToken) {
        const res = await searchNextPage(query, nextPageToken);
        setResults(prev => [...prev, ...(res.data?.videos || [])]);
        setNextPageToken(res.data?.nextPageToken || "");
      } else {
        const variations = [`${query} songs`, `${query} music`, `${query} hits`, `${query} trending`];
        const vq = variations[Math.floor(Math.random() * variations.length)];
        const res = await searchMusic(vq);
        const existingIds = new Set(results.map((r: any) => r.id));
        const newVideos = (res.data?.videos || []).filter((v: any) => !existingIds.has(v.id));
        setResults(prev => [...prev, ...newVideos]);
      }
    } catch {}
    setLoadingMore(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    if (searchInput.trim()) {
      initialLoadDone.current = false;
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  const selectSuggestion = (s: string) => {
    setSearchInput(s);
    setShowSuggestions(false);
    setSuggestions([]);
    initialLoadDone.current = false;
    window.location.href = `/search?q=${encodeURIComponent(s)}`;
  };

  const clearSearch = () => {
    setSearchInput("");
    setResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
    initialLoadDone.current = false;
    window.location.href = "/search";
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('mv_search_history');
  };

  // Search results JSON-LD
  const searchResultsLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: query || "Search",
    url: `${SITE_URL}/search?q=${encodeURIComponent(query)}`,
  };

  return (
    <>
      {query && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(searchResultsLd) }}
        />
      )}

      <div className="relative mb-4" ref={searchRef}>
        <form onSubmit={handleSearch}>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              placeholder="Search songs, artists..."
              aria-label="Search music"
              className="flex-1 rounded-full border border-gray-light bg-white px-5 py-3 text-sm text-charcoal placeholder:text-gray-medium focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal dark:bg-navy dark:text-white dark:border-navy-light"
            />
            {query && (
              <button type="button" onClick={clearSearch} className="rounded-full bg-gray-light dark:bg-navy px-4 py-3 text-sm font-medium text-charcoal dark:text-white hover:bg-gray-medium/20 transition-colors">
                Clear
              </button>
            )}
            <button type="submit" aria-label="Search" className="rounded-full bg-gray-light dark:bg-navy px-6 py-3 text-sm font-medium text-charcoal dark:text-white hover:bg-gray-medium/20 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </form>
        
        {showSuggestions && !query && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-navy-dark rounded-xl border border-gray-light dark:border-navy-light shadow-2xl z-50 overflow-hidden">
            {suggestions.length > 0 && suggestions.map((s, i) => (
              <button key={i} onClick={() => selectSuggestion(s)} className="flex items-center gap-3 w-full px-5 py-3 text-sm text-charcoal dark:text-gray-light hover:bg-gray-light dark:hover:bg-navy transition-colors text-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                {s}
              </button>
            ))}
            {searchHistory.length > 0 && (
              <>
                {suggestions.length > 0 && <div className="border-t border-gray-light dark:border-navy-light"></div>}
                <div className="flex items-center justify-between px-5 py-2">
                  <span className="text-xs font-medium text-gray-medium">Recent Searches</span>
                  <button onClick={clearHistory} className="text-xs text-teal hover:underline">Clear</button>
                </div>
                {searchHistory.map((h, i) => (
                  <button key={i} onClick={() => selectSuggestion(h)} className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-charcoal dark:text-gray-light hover:bg-gray-light dark:hover:bg-navy transition-colors text-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {h}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {query && (
        <>
          {/* Filter Tabs */}
          <nav aria-label="Search filters" className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${activeFilter===f ? 'bg-navy text-white dark:bg-white dark:text-navy' : 'bg-gray-light dark:bg-navy text-charcoal dark:text-gray-light hover:bg-gray-medium/20'}`}
              >
                {f}
              </button>
            ))}
          </nav>

          {/* Results */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({length:8}).map((_,i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="h-20 w-36 rounded-xl bg-gray-light flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-gray-light" />
                    <div className="h-3 w-1/3 rounded bg-gray-light" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="text-center text-charcoal dark:text-gray-light py-10">No results found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((song: any) => (
                <VideoCard
                  key={song.id}
                  id={song.id}
                  title={song.title}
                  artist={song.artist}
                  views={song.views || 0}
                  duration={song.duration || 0}
                  publishedAt={song.publishedAt}
                />
              ))}
            </div>
          )}

          {/* Load More Trigger */}
          <div ref={loaderRef} className="py-6 text-center">
            {loadingMore ? (
              <span className="text-sm text-gray-medium animate-pulse">Loading more...</span>
            ) : results.length > 0 ? (
              <span className="text-sm text-gray-medium">Scroll for more</span>
            ) : null}
          </div>
        </>
      )}

      {/* Empty State */}
      {!query && (
        <div className="text-center py-16">
          <div className="mb-4 flex justify-center">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-navy dark:text-white mb-2">Search Music</h1>
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
          <Suspense fallback={
            <div className="space-y-4">
              {Array.from({length:5}).map((_,i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="h-20 w-36 rounded-xl bg-gray-light" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-gray-light" />
                  </div>
                </div>
              ))}
            </div>
          }>
            <SearchContent />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}