// TikTok API — Browser-direct, no backend needed
// Uses tikwm.com public API (free, no key)

const TIKTOK_API = 'https://www.tikwm.com/api';

export interface TikTokVideo {
  id: string;
  title: string;
  author: string;
  authorId: string;
  avatar: string;
  playUrl: string;
  downloadUrl: string;
  cover: string;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
}

// ── Trending Feed ──
export async function getTrendingFeed(): Promise<TikTokVideo[]> {
  try {
    const res = await fetch(`${TIKTOK_API}/feed/list?region=US&count=50`);
    const data = await res.json();
    if (data.code === 0 && data.data) {
      return data.data.map(formatVideo);
    }
  } catch {}
  return [];
}

// ── Search ──
export async function searchTikTok(query: string): Promise<TikTokVideo[]> {
  try {
    const res = await fetch(`${TIKTOK_API}/video/search?q=${encodeURIComponent(query)}&count=50`);
    const data = await res.json();
    if (data.code === 0 && data.data) {
      return (data.data.videos || data.data || []).map(formatVideo);
    }
  } catch {}
  return [];
}

// ── Video Info ──
export async function getTikTokVideo(id: string): Promise<TikTokVideo | null> {
  try {
    const res = await fetch(`${TIKTOK_API}/video/info?id=${id}`);
    const data = await res.json();
    if (data.code === 0 && data.data) {
      return formatVideo(data.data);
    }
  } catch {}
  return null;
}

function formatVideo(item: any): TikTokVideo {
  return {
    id: item.video_id || item.id || '',
    title: item.title || item.desc || '',
    author: item.author?.nickname || item.nickname || '',
    authorId: item.author?.unique_id || item.unique_id || '',
    avatar: item.author?.avatar || item.avatar || '',
    playUrl: item.play || item.video || '',
    downloadUrl: item.download || item.wmplay || item.play || '',
    cover: item.cover || item.origin_cover || '',
    likes: parseInt(item.likes || item.digg_count || '0'),
    comments: parseInt(item.comments || item.comment_count || '0'),
    shares: parseInt(item.shares || item.share_count || '0'),
    duration: parseInt(item.duration || '0'),
  };
}
