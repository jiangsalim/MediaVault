const API_BASE = 'https://mediavault-website-api.onrender.com/api';

export async function searchMusic(query, platform = 'youtube') {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&platform=${platform}&limit=25`);
  return res.json();
}

export async function getSongDetails(videoId) {
  const res = await fetch(`${API_BASE}/video/${videoId}`);
  return res.json();
}

export async function getRelatedSongs(title, artist) {
  const query = artist ? `${artist} similar songs` : title;
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=10`);
  return res.json();
}

export async function downloadAudio(url, format = 'mp3') {
  const res = await fetch(`${API_BASE}/download/audio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, format }),
  });
  if (!res.ok) throw new Error('Download failed');
  return res.blob();
}

export async function getTrending(region = 'UG') {
  const res = await fetch(`${API_BASE}/trending?region=${region}`);
  return res.json();
}

export async function getLatestVersion() {
  const res = await fetch(`${API_BASE}/latest-version`);
  return res.json();
}
