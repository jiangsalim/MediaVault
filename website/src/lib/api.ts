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

// YouTube HTML scraping — no API, no backend, works from browser
export async function scrapeYouTube(query: string): Promise<any[]> {
  try {
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    const html = await res.text();
    
    // Extract video IDs from YouTube's initial data
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/);
    if (!match) return [];
    
    const data = JSON.parse(match[1]);
    const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
    
    return contents
      .filter((item: any) => item.videoRenderer)
      .map((item: any) => {
        const v = item.videoRenderer;
        return {
          id: v.videoId,
          title: v.title?.runs?.[0]?.text || '',
          artist: v.ownerText?.runs?.[0]?.text || '',
          channelId: v.ownerText?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId || '',
          description: '',
          thumbnail: v.thumbnail?.thumbnails?.[0]?.url || '',
          publishedAt: '',
          duration: 0,
          views: parseInt(v.viewCountText?.simpleText?.replace(/[^0-9]/g, '') || '0') || 0,
          likes: 0,
        };
      });
  } catch (e) {
    console.error('YouTube scrape error:', e);
    return [];
  }
}
