"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/shared/Button";
import { getSongDetails } from "@/lib/api";

export default function SongPage() {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getSongDetails(id).then(res => {
        setSong(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container-site max-w-4xl mx-auto py-10 animate-pulse">
          <div className="h-64 bg-gray-light rounded-md mb-6" />
          <div className="h-8 w-3/4 bg-gray-light rounded mb-3" />
          <div className="h-4 w-1/2 bg-gray-light rounded mb-6" />
          <div className="space-y-2">
            {Array.from({length:5}).map((_,i)=><div key={i} className="h-16 bg-gray-light rounded" />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (!song) {
    return <Layout><div className="text-center py-20">Song not found.</div></Layout>;
  }

  const formatNum = (n: number) => {
    if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
    if (n >= 1e3) return (n/1e3).toFixed(0)+'K';
    return n.toString();
  };
  const formatDur = (s: number) => {
    const m = Math.floor(s/60), sec = Math.floor(s%60);
    return m+':'+String(sec).padStart(2,'0');
  };

  return (
    <Layout>
      <section className="py-8">
        <div className="container-site max-w-4xl mx-auto">
          {/* Video Player */}
          <div className="aspect-video rounded-md overflow-hidden mb-6 bg-navy">
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          <h1 className="text-2xl font-bold text-navy dark:text-white mb-2">{song.title}</h1>
          <p className="text-body text-charcoal dark:text-gray-light mb-4">{song.artist}</p>

          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            {song.views > 0 && <span className="bg-gray-light dark:bg-navy px-3 py-1 rounded-full text-charcoal dark:text-gray-light">👁 {formatNum(song.views)} views</span>}
            {song.likes > 0 && <span className="bg-gray-light dark:bg-navy px-3 py-1 rounded-full text-charcoal dark:text-gray-light">👍 {formatNum(song.likes)} likes</span>}
            {song.duration > 0 && <span className="bg-gray-light dark:bg-navy px-3 py-1 rounded-full text-charcoal dark:text-gray-light">⏱ {formatDur(song.duration)}</span>}
          </div>

          {/* Channel Info */}
          {song.channel?.title && (
            <div className="card-base p-4 mb-8 flex items-center gap-4">
              <img src={song.channel.thumbnail} alt="" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <a href={`https://youtube.com/channel/${song.channel.id}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy dark:text-white hover:text-teal">{song.channel.title}</a>
                <p className="text-xs text-gray-medium">{formatNum(song.channel.subscriberCount)} subscribers • {song.channel.videoCount} videos</p>
              </div>
            </div>
          )}

          {/* Related Videos */}
          {song.related?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-4">Related Videos</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {song.related.slice(0, 8).map((r: any) => (
                  <a key={r.id} href={`/song/${r.id}`} className="card-base flex items-center gap-3 p-3 transition-colors hover:bg-gray-light dark:hover:bg-navy-light overflow-hidden">
                    <img src={r.thumbnail} alt="" className="h-14 w-14 rounded object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-medium text-navy dark:text-white">{r.title}</div>
                      <div className="text-xs text-gray-medium">{r.artist}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
