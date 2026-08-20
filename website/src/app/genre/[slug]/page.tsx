"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { searchMusic } from "@/lib/api";

export default function GenrePage() {
  const { slug } = useParams<{ slug: string }>();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const genre = decodeURIComponent(slug || "");
  const siteUrl = "https://media-vault-website.vercel.app";

  useEffect(() => {
    if (genre) {
      // Update document title for SEO
      document.title = `${genre} Music Downloads | MediaVault`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", `Download free ${genre} MP3 music. Stream and download ${genre} songs, trending tracks, and latest hits from MediaVault.`);
      }

      searchMusic(genre, "youtube").then(res => {
        setSongs(res.data?.videos || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [genre]);

  const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  const formatDur = (s: number) => {
    if (!s) return '';
    const m = Math.floor(s/60), sec = Math.floor(s%60);
    return `${m}:${String(sec).padStart(2,'0')}`;
  };

  // Breadcrumb Schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Genres", item: `${siteUrl}/search` },
      { "@type": "ListItem", position: 3, name: genre, item: `${siteUrl}/genre/${slug}` },
    ],
  };

  // Genre Collection Schema
  const genreLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${genre} Music`,
    description: `Download free ${genre} MP3 music from MediaVault`,
    url: `${siteUrl}/genre/${slug}`,
  };

  return (
    <Layout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(genreLd) }}
      />

      <section className="py-8">
        <div className="container-site max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-gray-medium">
            <a href="/" className="hover:text-teal">Home</a>
            <span className="mx-1">/</span>
            <a href="/search" className="hover:text-teal">Genres</a>
            <span className="mx-1">/</span>
            <span className="text-navy dark:text-white capitalize">{genre}</span>
          </nav>

          <h1 className="text-2xl font-bold text-navy dark:text-white mb-2 capitalize">
            {genre} Music
          </h1>
          <p className="text-sm text-gray-medium mb-6">
            Download free {genre} MP3 music, trending songs, and latest hits.
          </p>

          {loading ? (
            <div className="space-y-4">
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="h-20 w-36 rounded-xl bg-gray-light flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-gray-light" />
                    <div className="h-3 w-1/3 rounded bg-gray-light" />
                  </div>
                </div>
              ))}
            </div>
          ) : songs.length === 0 ? (
            <p className="text-charcoal dark:text-gray-light py-10">No songs found for this genre.</p>
          ) : (
            <div className="divide-y divide-gray-light dark:divide-navy-light">
              {songs.map((s:any)=>(
                <a key={s.id} href={`/song/${s.id}`} className="flex gap-4 py-4 hover:bg-gray-light/50 dark:hover:bg-navy/50 transition-colors group rounded-lg px-2">
                  <div className="relative flex-shrink-0 w-32 sm:w-40 aspect-video rounded-xl overflow-hidden bg-navy">
                    <img src={thumb(s.id)} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-navy dark:text-white line-clamp-2 group-hover:text-teal">{s.title}</h3>
                    <p className="text-xs text-gray-medium mt-1">{s.artist}</p>
                    {s.duration > 0 && (
                      <p className="flex items-center gap-1 text-xs text-gray-medium mt-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {formatDur(s.duration)}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}