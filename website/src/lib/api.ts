
// New YouTube Data API endpoints
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

// New YouTube Data API endpoints
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
