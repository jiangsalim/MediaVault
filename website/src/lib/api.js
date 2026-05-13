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

export async function getSongDetails(videoId) {
  return cachedFetch(`${API_BASE}/video/${videoId}`, 600000);
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

export async function downloadAudio(videoId, format = 'mp3') {
  const url = `https://youtube.com/watch?v=${videoId}`;
  window.open(`${API_BASE}/download/audio?url=${encodeURIComponent(url)}&format=${format}`, '_blank');
}

export async function getTrending(region = 'UG') {
  return cachedFetch(`${API_BASE}/trending?region=${region}`, 120000);
}

export async function getLatestVersion() {
  return cachedFetch(`${API_BASE}/latest-version`, 3600000);
}
