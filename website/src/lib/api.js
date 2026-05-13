const API_BASE = 'https://mediavault-website-api.onrender.com/api';

export async function searchMusic(query, platform = 'youtube') {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&platform=${platform}&limit=25`);
  return res.json();
}

export async function getRelatedSongs(title, artist) {
  const query = artist ? `${artist} similar songs` : title;
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=10`);
  return res.json();
}

export async function getVideoFormats(videoId) {
  const res = await fetch(`${API_BASE}/formats/${videoId}`);
  return res.json();
}

export function getDownloadUrl(videoId, format = 'mp3') {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  return `${API_BASE}/download/audio?url=${encodeURIComponent(url)}&format=${format}`;
}

export async function getLatestVersion() {
  const res = await fetch(`${API_BASE}/latest-version`);
  return res.json();
}
