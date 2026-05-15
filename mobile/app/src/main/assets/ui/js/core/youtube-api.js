const YouTubeAPI = {
  currentInvidious: 0,

  // ── Search ──
  async search(query, limit = 25) {
    // Try Invidious first (fast, structured data)
    const invidiousResult = await this.searchInvidious(query, limit);
    if (invidiousResult && invidiousResult.length > 0) {
      return { videos: invidiousResult, nextPageToken: '' };
    }
    // Fallback: YouTube RSS
    const rssResult = await this.searchRSS(query, limit);
    if (rssResult && rssResult.length > 0) {
      return { videos: rssResult, nextPageToken: '' };
    }
    return { videos: [], nextPageToken: '' };
  },

  // Invidious search
  async searchInvidious(query, limit = 25) {
    const instance = CONFIG.INVIDIOUS_INSTANCES[this.currentInvidious];
    this.currentInvidious = (this.currentInvidious + 1) % CONFIG.INVIDIOUS_INSTANCES.length;
    try {
      const res = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&page=1`);
      const data = await res.json();
      return (data || []).slice(0, limit).map(item => ({
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
    } catch (e) {
      return [];
    }
  },

  // RSS search
  async searchRSS(query, limit = 25) {
    try {
      const res = await fetch(`${CONFIG.YOUTUBE_RSS}?q=${encodeURIComponent(query)}`);
      const text = await res.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      const entries = xml.querySelectorAll('entry');
      const videos = [];
      entries.forEach((entry, i) => {
        if (i >= limit) return;
        const id = entry.querySelector('id')?.textContent?.split(':').pop() || '';
        videos.push({
          id: id,
          title: entry.querySelector('title')?.textContent || '',
          artist: entry.querySelector('author name')?.textContent || '',
          channelId: '',
          description: '',
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          publishedAt: entry.querySelector('published')?.textContent || '',
          duration: 0,
          views: 0,
          likes: 0,
        });
      });
      return videos;
    } catch (e) {
      return [];
    }
  },

  // ── Video Details ──
  async getVideoDetails(videoId) {
    try {
      const instance = CONFIG.INVIDIOUS_INSTANCES[0];
      const res = await fetch(`${instance}/api/v1/videos/${videoId}`);
      const data = await res.json();
      return {
        id: videoId,
        title: data.title || '',
        artist: data.author || '',
        channelId: data.authorId || '',
        description: data.description || '',
        thumbnail: data.videoThumbnails?.[data.videoThumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        duration: data.lengthSeconds || 0,
        views: data.viewCount || 0,
        likes: data.likeCount || 0,
        related: (data.recommendedVideos || []).slice(0, 16).map(r => ({
          id: r.videoId || '',
          title: r.title || '',
          artist: r.author || '',
          thumbnail: r.videoThumbnails?.[0]?.url || '',
        })),
        channel: {
          id: data.authorId || '',
          title: data.author || '',
          thumbnail: data.authorThumbnails?.[0]?.url || '',
          subscriberCount: data.subCount || 0,
          videoCount: 0,
          customUrl: data.authorUrl || '',
        },
      };
    } catch (e) {
      return null;
    }
  },

  // ── Channel Details ──
  async getChannelDetails(channelId) {
    try {
      const instance = CONFIG.INVIDIOUS_INSTANCES[0];
      const res = await fetch(`${instance}/api/v1/channels/${channelId}`);
      const data = await res.json();
      return {
        id: channelId,
        title: data.author || '',
        thumbnail: data.authorThumbnails?.[0]?.url || '',
        subscriberCount: data.subCount || 0,
        videoCount: data.totalViews || 0,
        customUrl: data.authorUrl || '',
      };
    } catch (e) {
      return null;
    }
  },

  // ── Trending Channels ──
  async getTrendingChannels() {
    const trending = await this.search('trending music', 30);
    const channelIds = [...new Set(trending.videos.map(v => v.channelId).filter(Boolean))];
    const channels = [];
    for (const id of channelIds.slice(0, 10)) {
      const ch = await this.getChannelDetails(id);
      if (ch) channels.push(ch);
    }
    return channels.sort((a, b) => (b.subscriberCount || 0) - (a.subscriberCount || 0)).slice(0, 8);
  },

  // ── Suggestions ──
  async getSuggestions(query) {
    try {
      const res = await fetch(`${CONFIG.GOOGLE_SUGGEST}?client=youtube&ds=yt&q=${encodeURIComponent(query)}`);
      const text = await res.text();
      const match = text.match(/\["([^"]+)",(\[.*?\])/);
      if (match) {
        return JSON.parse(match[2]);
      }
    } catch (e) {}
    return [];
  },
};
