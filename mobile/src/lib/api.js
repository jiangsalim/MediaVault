const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://mediavault.vercel.app/api';

export async function searchMusic(query, platform = 'youtube') {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&platform=${platform}&type=music&limit=20`);
  return res.json();
}

export async function getSongDetails(videoId) {
  const res = await fetch(`${API_BASE}/video/${videoId}`);
  return res.json();
}

export async function getTrending(region = 'UG') {
  const res = await fetch(`${API_BASE}/trending?region=${region}`);
  return res.json();
}

export async function getArtistTopSongs(artistName) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(artistName)}&platform=youtube&type=music&limit=20`);
  return res.json();
}

export async function getLatestVersion() {
  const res = await fetch(`${API_BASE}/latest-version`);
  return res.json();
}
