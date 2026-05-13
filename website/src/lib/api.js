const API_BASE = 'https://mediavault-website-api.onrender.com/api';
const cache = {};

async function cachedFetch(url, ttl = 300000) {
  const now = Date.now();
  if (cache[url] && cache[url].time > now - ttl) {
    return cache[url].data;
  }
  const res = await fetch(url);
  const data = await res.json();
  cache[url] = { data, time: now };
  return data;
}

export async function searchMusic(query, platform = 'youtube') {
  return cachedFetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&platform=${platform}&limit=25`);
}

export async function getRelatedSongs(title, artist) {
  const query = artist ? `${artist} similar songs` : title;
  return cachedFetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=10`);
}

export async function getAudioStreamUrl(videoId) {
  const res = await fetch(`${API_BASE}/stream/${videoId}`);
  const data = await res.json();
  return data.url;
}

export function getDownloadUrl(videoId, format = 'mp3') {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  return `${API_BASE}/download/audio?url=${encodeURIComponent(url)}&format=${format}`;
}

export async function getLatestVersion() {
  return cachedFetch(`${API_BASE}/latest-version`, 3600000);
}
