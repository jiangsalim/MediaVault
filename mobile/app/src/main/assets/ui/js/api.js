/**
 * MediaVault — YouTube API (Invidious)
 * No API keys, no quotas, all on-device
 */

var API = {
  _idx: 0,

  // ── Search ──
  search: async function(query, limit) {
    limit = limit || 25;
    var instance = CONFIG.INVIDIOUS[this._idx];
    this._idx = (this._idx + 1) % CONFIG.INVIDIOUS.length;

    try {
      var res = await fetch(instance + '/api/v1/search?q=' + encodeURIComponent(query) + '&type=video&page=1');
      var data = await res.json();
      var videos = (data || []).slice(0, limit).map(this._format); return { videos: videos, nextPage: "" };
    } catch(e) {
      return [];
    }
  },

  // ── Video Details ──
  video: async function(id) {
    var instance = CONFIG.INVIDIOUS[0];
    try {
      var res = await fetch(instance + '/api/v1/videos/' + id);
      var d = await res.json();
      return {
        id: id,
        title: d.title || '',
        artist: d.author || '',
        channelId: d.authorId || '',
        description: d.description || '',
        thumbnail: (d.videoThumbnails || [])[0]?.url || '',
        duration: d.lengthSeconds || 0,
        views: d.viewCount || 0,
        likes: d.likeCount || 0,
        related: (d.recommendedVideos || []).slice(0, 16).map(function(r) {
          return { id: r.videoId, title: r.title, artist: r.author, thumbnail: (r.videoThumbnails || [])[0]?.url || '' };
        }),
        channel: {
          id: d.authorId || '',
          title: d.author || '',
          thumbnail: (d.authorThumbnails || [])[0]?.url || '',
          subscribers: d.subCount || 0,
        },
      };
    } catch(e) {
      return null;
    }
  },

  // ── Trending Channels ──
  trendingChannels: async function() {
    var results = await this.search('trending music', 30);
    var ids = [...new Set(results.map(function(v) { return v.channelId; }).filter(Boolean))];
    var channels = [];
    var instance = CONFIG.INVIDIOUS[0];
    for (var i = 0; i < Math.min(ids.length, 10); i++) {
      try {
        var res = await fetch(instance + '/api/v1/channels/' + ids[i]);
        var d = await res.json();
        channels.push({
          id: ids[i],
          title: d.author || '',
          thumbnail: (d.authorThumbnails || [])[0]?.url || '',
          subscribers: d.subCount || 0,
          videos: d.totalViews || 0,
        });
      } catch(e) {}
    }
    return channels.sort(function(a, b) { return (b.subscribers || 0) - (a.subscribers || 0); }).slice(0, 8);
  },

  // ── Suggestions ──
  suggest: async function(query) {
    try {
      var res = await fetch(CONFIG.SUGGEST_API + '?client=youtube&ds=yt&q=' + encodeURIComponent(query));
      var text = await res.text();
      var match = text.match(/\["([^"]+)",(\[.*?\])/);
      if (match) return JSON.parse(match[2]).slice(0, CONFIG.MAX_SUGGESTIONS);
    } catch(e) {}
    return [];
  },

  // ── Format helper ──
  _format: function(item) {
    return {
      id: item.videoId || '',
      title: item.title || '',
      artist: item.author || '',
      channelId: item.authorId || '',
      description: (item.description || '').substring(0, 200),
      thumbnail: 'https://i.ytimg.com/vi/' + (item.videoId || '') + '/hqdefault.jpg',
      publishedAt: item.publishedText || '',
      duration: item.lengthSeconds || 0,
      views: item.viewCount || 0,
      likes: 0,
    };
  },
};
