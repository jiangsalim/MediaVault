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

  useEffect(() => {
    if (genre) {
      searchMusic(genre, "youtube").then(res => {
        setSongs(res.data?.videos || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [genre]);

  const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <Layout>
      <section className="py-8">
        <div className="container-site max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-6 capitalize">{genre} Music</h1>
          {loading ? <div className="space-y-4">{Array.from({length:8}).map((_,i)=><div key={i} className="flex gap-4 animate-pulse"><div className="h-36 w-64 rounded-xl bg-gray-light" /><div className="flex-1 space-y-2"><div className="h-5 w-3/4 rounded bg-gray-light" /></div></div>)}</div> :
           songs.length===0 ? <p className="text-charcoal dark:text-gray-light py-10">No songs found for this genre.</p> :
           <div className="divide-y divide-gray-light dark:divide-navy-light">
            {songs.map((s:any)=>(
              <a key={s.id} href={`/song/${s.id}`} className="flex gap-4 py-4 hover:bg-gray-light/50 dark:hover:bg-navy/50 transition-colors group">
                <div className="relative flex-shrink-0 w-40 aspect-video rounded-xl overflow-hidden bg-navy"><img src={thumb(s.id)} alt="" className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-navy dark:text-white line-clamp-2 group-hover:text-teal">{s.title}</h3>
                  <p className="text-xs text-gray-medium mt-1">{s.artist}</p>
                  {s.duration>0&&<p className="text-xs text-gray-medium">{Math.floor(s.duration/60)}:{String(Math.floor(s.duration%60)).padStart(2,'0')}</p>}
                </div>
              </a>
            ))}
          </div>}
        </div>
      </section>
    </Layout>
  );
}
