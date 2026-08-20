import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";

const siteUrl = "https://media-vault-website.vercel.app";
const apiUrl = "https://mediavault-o52i.onrender.com";

async function getGenreSongs(genre: string) {
  try {
    const res = await fetch(`${apiUrl}/api/search?q=${genre}+music&limit=20`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data?.data?.videos || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const genre = decodeURIComponent(params.slug);
  const title = `${genre} Music Downloads | Free ${genre} MP3 | MediaVault`;
  const description = `Download free ${genre} MP3 music. Stream and download trending ${genre} songs, latest ${genre} hits, and best ${genre} tracks from MediaVault.`;

  return {
    title,
    description,
    openGraph: {
      title: `${genre} Music Downloads`,
      description,
      url: `${siteUrl}/genre/${params.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `${siteUrl}/genre/${params.slug}`,
    },
  };
}

export default async function GenrePage({ params }: { params: { slug: string } }) {
  const genre = decodeURIComponent(params.slug);
  const songs = await getGenreSongs(genre);

  const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  const formatDur = (s: number) => {
    if (!s) return '';
    const m = Math.floor(s/60), sec = Math.floor(s%60);
    return `${m}:${String(sec).padStart(2,'0')}`;
  };

  // Structured Data
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${genre} Music`,
    description: `Download free ${genre} MP3 music from MediaVault`,
    url: `${siteUrl}/genre/${params.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Genres", item: `${siteUrl}/search` },
      { "@type": "ListItem", position: 3, name: genre, item: `${siteUrl}/genre/${params.slug}` },
    ],
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

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

          <h1 className="text-3xl font-bold text-navy dark:text-white mb-2 capitalize">
            {genre} Music Downloads
          </h1>
          <p className="text-gray-medium mb-6 max-w-2xl">
            Download free {genre} MP3 music. Browse trending {genre} songs, latest {genre} hits, and the best {genre} tracks — all free to download from MediaVault.
          </p>

          {songs.length === 0 ? (
            <p className="text-charcoal dark:text-gray-light py-10">No songs found for this genre. Try searching instead.</p>
          ) : (
            <div className="divide-y divide-gray-light dark:divide-navy-light">
              {songs.map((s: any) => (
                <a key={s.id} href={`/song/${s.id}`} className="flex gap-4 py-4 hover:bg-gray-light/50 dark:hover:bg-navy/50 transition-colors group rounded-lg px-2">
                  <div className="relative flex-shrink-0 w-32 sm:w-40 aspect-video rounded-xl overflow-hidden bg-navy">
                    <img src={thumb(s.id)} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-navy dark:text-white line-clamp-2 group-hover:text-teal">{s.title}</h2>
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