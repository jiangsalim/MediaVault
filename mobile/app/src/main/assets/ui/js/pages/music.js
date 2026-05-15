const MusicPage = {
  genres: ['Gospel', 'Dancehall', 'Afrobeat', 'Hip Hop', 'Reggae', 'Bongo Flava', 'Zouk', 'R&B', 'Amapiano', 'Singeli'],
  data: null,

  init() { this.load(); },

  async load() {
    const container = document.getElementById('music-content');
    if (!container) return;
    container.innerHTML = this.renderSkeleton();
    await this.fetchData();
    this.render(container);
  },

  async fetchData() {
    try {
      const [trendingRes, channelsRes] = await Promise.all([
        YouTubeAPI.search', { q: 'trending music', limit: 30 }),
        YouTubeAPI.getTrendingChannels()'),
      ]);
      const videos = trendingRes.data?.videos || [];
      this.data = {
        hero: videos[0] || null,
        trending: videos.slice(1, 11),
        ranked: videos.slice(0, 20).map((v, i) => ({ ...v, rank: i + 1 })),
        channels: (channelsRes.data || []).slice(0, 8),
      };
    } catch (e) { console.error('Music fetch error:', e); }
  },

  render(container) {
    const d = this.data || { hero: null, trending: [], ranked: [], channels: [] };

    let html = '';

    // Hero Section
    if (d.hero) {
      const thumb = `https://i.ytimg.com/vi/${d.hero.id}/hqdefault.jpg`;
      html += `
        <div class="music-hero" style="position:relative;aspect-ratio:16/9;overflow:hidden;" onclick="HomePage.showQualitySheet({id:'${d.hero.id}',title:'${this.escapeAttr(d.hero.title || '')}',artist:'${this.escapeAttr(d.hero.artist || '')}'})">
          <img src="${thumb}" alt="" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">
          <div style="position:absolute;bottom:0;left:0;right:0;padding:var(--space-lg);background:linear-gradient(transparent, rgba(0,0,0,0.8));color:white;">
            <div style="font-size:var(--font-size-xs);opacity:0.8;margin-bottom:4px;">FEATURED</div>
            <div style="font-size:var(--font-size-xl);font-weight:700;margin-bottom:4px;">${this.escapeHtml(d.hero.title || '')}</div>
            <div style="font-size:var(--font-size-sm);opacity:0.9;">${this.escapeHtml(d.hero.artist || '')} • ${System.formatNumber(d.hero.views || 0)} views</div>
          </div>
          <div style="position:absolute;top:12px;right:12px;background:var(--color-primary);color:white;padding:8px 16px;border-radius:var(--radius-full);font-weight:700;font-size:var(--font-size-sm);cursor:pointer;">⬇ Download</div>
        </div>`;
    }

    // Genre Chips
    html += `<div class="genre-pills" style="margin-top:var(--space-md);">${this.genres.map(g => `<span class="genre-pill" onclick="MusicPage.openGenre('${g}')">${g}</span>`).join('')}</div>`;

    // Top Artists Grid
    if (d.channels.length > 0) {
      html += `<div class="section-header"><span class="section-title">🎤 Top Artists</span></div>`;
      html += `<div class="video-grid">${d.channels.map(c => this.artistCard(c)).join('')}</div>`;
    }

    // Top Songs Ranked List
    if (d.ranked.length > 0) {
      html += `<div class="section-header"><span class="section-title">🔥 Trending Songs</span></div>`;
      html += `<div style="padding:0 var(--space-md);">${d.ranked.slice(0, 15).map(s => this.rankedRow(s)).join('')}</div>`;
    }

    // New Releases
    if (d.trending.length > 0) {
      html += `<div class="section-header"><span class="section-title">🆕 New Releases</span></div>`;
      html += `<div class="video-grid">${d.trending.map(s => this.videoCard(s)).join('')}</div>`;
    }

    container.innerHTML = html || '<div class="empty-state"><p>Loading music...</p></div>';
  },

  artistCard(channel) {
    return `
      <div class="video-card" onclick="window.open('https://youtube.com/channel/${channel.id}','_blank')" style="text-align:center;padding:var(--space-md);">
        <img src="${channel.thumbnail || ''}" style="width:64px;height:64px;border-radius:50%;margin:0 auto var(--space-sm);display:block;" onerror="this.style.display='none'">
        <div class="card-title">${this.escapeHtml(channel.title || '')}</div>
        <div class="card-meta" style="justify-content:center;">${System.formatNumber(channel.subscriberCount || 0)} subs</div>
      </div>`;
  },

  rankedRow(song) {
    return `
      <div class="download-card" style="margin-bottom:var(--space-sm);cursor:pointer;" onclick="HomePage.showQualitySheet({id:'${song.id}',title:'${this.escapeAttr(song.title || '')}',artist:'${this.escapeAttr(song.artist || '')}'})">
        <span style="font-size:var(--font-size-lg);font-weight:700;color:var(--color-primary);width:28px;">${song.rank}</span>
        <img src="https://i.ytimg.com/vi/${song.id}/mqdefault.jpg" style="width:48px;height:48px;border-radius:var(--radius-sm);object-fit:cover;" onerror="this.style.display='none'">
        <div class="dl-info">
          <div class="dl-title">${this.escapeHtml(song.title || '')}</div>
          <div class="dl-meta">${this.escapeHtml(song.artist || '')} • ${System.formatNumber(song.views || 0)} views</div>
        </div>
        <span style="color:var(--color-primary);font-size:1.25rem;">⬇</span>
      </div>`;
  },

  videoCard(song) {
    const thumb = `https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`;
    return `
      <div class="video-card" onclick="HomePage.showQualitySheet({id:'${song.id}',title:'${this.escapeAttr(song.title || '')}',artist:'${this.escapeAttr(song.artist || '')}'})">
        <div class="card-thumb"><img src="${thumb}" alt="" onerror="this.style.display='none'"><span class="duration-badge">${System.formatDuration(song.duration || 0)}</span></div>
        <div class="card-body">
          <div class="card-title">${this.escapeHtml(song.title || '')}</div>
          <div class="card-meta"><span>${this.escapeHtml(song.artist || '')}</span></div>
        </div>
      </div>`;
  },

  openGenre(genre) {
    Router.navigate('search');
    setTimeout(() => {
      const input = document.getElementById('search-input-full');
      if (input) { input.value = genre; SearchPage.search(genre); }
    }, 300);
  },

  renderSkeleton() {
    return `<div class="skeleton" style="aspect-ratio:16/9;margin-bottom:var(--space-md);"></div>
      <div class="genre-pills">${this.genres.map(() => '<div class="skeleton" style="width:70px;height:32px;border-radius:20px;"></div>').join('')}</div>
      <div class="video-grid">${Array.from({length:4}).map(() => '<div class="skeleton" style="aspect-ratio:16/9;border-radius:12px;"></div>').join('')}</div>`;
  },

  escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; },
  escapeAttr(text) { return text.replace(/'/g, "\\'").replace(/"/g, '&quot;'); },
};
