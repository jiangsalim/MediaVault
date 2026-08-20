import type { Metadata } from "next";
import SongPageClient from "./SongPageClient";

const siteUrl = "https://media-vault-website.vercel.app";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const apiUrl = "https://mediavault-o52i.onrender.com";
    const res = await fetch(`${apiUrl}/api/song/${params.id}`);
    const data = await res.json();
    const song = data?.data;

    if (!song?.title) {
      return { title: "Song Not Found | MediaVault" };
    }

    return {
      title: `${song.title} — ${song.artist} | MediaVault`,
      description: `Download ${song.title} by ${song.artist}. Free MP3 download from MediaVault.`,
      openGraph: {
        title: `${song.title} — ${song.artist}`,
        description: `Download ${song.title} by ${song.artist}.`,
        images: [song.thumbnail || `https://i.ytimg.com/vi/${params.id}/mqdefault.jpg`],
      },
    };
  } catch {
    return { title: "Song | MediaVault" };
  }
}

export default function SongPage({ params }: { params: { id: string } }) {
  return <SongPageClient />;
}