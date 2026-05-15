// MediaVault API — Browser Direct (No Backend)
// All requests go directly from user's browser to YouTube

const INVIDIOUS = ['https://inv.nadeko.net', 'https://yewtu.be', 'https://iv.ggtyler.dev'];

// ── Search (scrape YouTube directly) ──
export async function searchMusic(query: string, platform = 'youtube') {
  // Try Invidious first (faster, structured data)
  const invidiousResult = await searchInvidious(query);
  if (invidiousResult.length > 0) {
    return { success: true, data: { videos: invidiousResult, nextPageToken: '' } };
  }
  // Fallback: scrape YouTube HTML
  const scraped = await scrapeYouTube(query);
  return { success: true, data: { videos: scraped, nextPageToken: '' } };
}

export async function searchNextPage(query: string, pageToken: string) {
  // Search with variation for infinite scroll
  const variations = [`${query} songs`, `${query} music`, `${query} hits`];
  const vq = variations[Math.floor(Math.random() * variations.length)];
  return searchMusic(vq);
}

// ── Invidious search ──
async function searchInvidious(query: string): Promise<any[]> {
  const instance = INVIDIOUS[Math.floor(Math.random() * INVIDIOUS.length)];
  try {
    const res = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&page=1`);
    const data = await res.json();
    return (data || []).slice(0, 25).map((item: any) => ({
      id: item.videoId || '',
      title: item.title || '',
      artist: item.author || '',
      channelId: item.authorId || '',
      description: (item.description || '').substring(0, 200),
      thumbnail: `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
      publishedAt: item.publishedText || '',
      duration: item.lengthSeconds || 0,
      views: item.viewCount || 0,
      likes: 0,
    }));
  } catch { return []; }
}

// ── YouTube HTML scraping ──
export async function scrapeYouTube(query: string): Promise<any[]> {
  try {
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    const html = await res.text();
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
  } catch { return []; }
}

// ── Song Details (YouTube oEmbed) ──
export async function getSongDetails(videoId: string) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    const data = await res.json();
    const title = data.title || '';
    const artist = data.author_name || '';

    // Get related via Invidious
    let related: any[] = [];
    try {
      const instance = INVIDIOUS[0];
      const rRes = await fetch(`${instance}/api/v1/videos/${videoId}`);
      const rData = await rRes.json();
      related = (rData.recommendedVideos || []).slice(0, 16).map((r: any) => ({
        id: r.videoId || '',
        title: r.title || '',
        artist: r.author || '',
        thumbnail: r.videoThumbnails?.[0]?.url || '',
      }));
    } catch {}

    return {
      success: true,
      data: {
        id: videoId,
        title,
        artist,
        channelId: '',
        description: '',
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        publishedAt: '',
        duration: 0,
        views: 0,
        likes: 0,
        channel: { id: '', title: artist, subscriberCount: 0, thumbnail: '' },
        related,
      },
    };
  } catch {
    return { success: false, data: null };
  }
}

// ── Trending Channels ──
export async function getTrendingChannels() {
  // Search trending and extract channels
  const videos = await scrapeYouTube('trending music');
  const channelMap: any = {};
  videos.forEach((v: any) => {
    if (v.channelId && !channelMap[v.channelId]) {
      channelMap[v.channelId] = {
        id: v.channelId,
        title: v.artist || v.channelId,
        thumbnail: v.thumbnail || '',
        subscriberCount: 0,
        videoCount: 0,
        customUrl: '',
      };
    }
  });
  return { success: true, data: Object.values(channelMap).slice(0, 8) };
}
