"use client";

import { useState, useEffect, useRef } from "react";

export function HeroSearch() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input.trim().length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://mediavault-website-api.onrender.com/api/suggest?q=${encodeURIComponent(input)}`);
        const data = await res.json();
        setSuggestions(data.data || []);
        setShow(true);
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const search = (q: string) => {
    setShow(false);
    setSuggestions([]);
    if (q.trim()) window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
  };

  return (
    <div className="py-8">
      <div className="container-site">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-navy dark:text-white mb-6">
          What do you want to download?
        </h1>
        <div className="max-w-xl mx-auto relative" ref={ref}>
          <form onSubmit={(e) => { e.preventDefault(); search(input); }}>
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShow(true); }}
                placeholder="Search or paste URL..."
                className="flex-1 rounded-full border border-gray-light bg-white px-5 py-3 text-sm text-charcoal placeholder:text-gray-medium focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal dark:bg-navy dark:text-white dark:border-navy-light"
              />
              <button type="submit" className="rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white hover:bg-teal-dark transition-colors">Search</button>
            </div>
          </form>
          {show && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-navy-dark rounded-xl border border-gray-light dark:border-navy-light shadow-2xl z-50 overflow-hidden">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => { setInput(s); search(s); }} className="flex items-center gap-3 w-full px-5 py-3 text-sm text-charcoal dark:text-gray-light hover:bg-gray-light dark:hover:bg-navy transition-colors text-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
