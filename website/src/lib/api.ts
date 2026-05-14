const API_BASE = 'https://mediavault-website-api.onrender.com/api';

export async function searchMusic(query: string, platform = 'youtube') {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&platform=${platform}&limit=25`);
  return res.json();
}

export async function getSongDetails(videoId: string) {
  const res = await fetch(`${API_BASE}/song/${videoId}`);
  return res.json();
}

export async function getTrendingChannels() {
  const res = await fetch(`${API_BASE}/channels/trending`);
  return res.json();
}

export async function searchNextPage(query: string, pageToken: string) {
  const res = await fetch(`${API_BASE}/search/next?q=${encodeURIComponent(query)}&page_token=${pageToken}`);
  return res.json();
}
