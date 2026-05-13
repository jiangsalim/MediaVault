import yt_dlp

async def search_music(query: str, platform: str = "youtube", limit: int = 25):
    search_query = f"ytsearch{limit}:{query}"
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(search_query, download=False)
        entries = info.get('entries', []) if info else []
        results = []
        for entry in entries:
            if entry:
                results.append({
                    'id': entry.get('id', ''),
                    'title': entry.get('title', 'Unknown'),
                    'artist': entry.get('uploader', entry.get('channel', 'Unknown')),
                    'duration': entry.get('duration', 0),
                    'views': entry.get('view_count', 0),
                    'url': f"https://youtube.com/watch?v={entry.get('id', '')}",
                })
        return {'query': query, 'platform': platform, 'totalResults': len(results), 'videos': results}

async def get_trending(region: str = "UG"):
    queries = ["Eddy Kenzo","Sheebah","John Blaq","Vinka","Spice Diana"]
    all_results = []
    for q in queries:
        result = await search_music(q, limit=2)
        if result.get('videos'):
            all_results.extend(result['videos'][:2])
    return {'region': region, 'trending': all_results[:10]}
