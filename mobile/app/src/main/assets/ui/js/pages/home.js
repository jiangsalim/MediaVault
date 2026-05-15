const HomePage = {
  genres: ['Gospel', 'Dancehall', 'Afrobeat', 'Hip Hop', 'Reggae', 'Bongo Flava', 'Zouk', 'R&B', 'Amapiano', 'Singeli'],
  trendingQueries: ['trending music', 'top hits', 'popular songs', 'best music', 'viral songs'],
  data: null,

  async load() {
    const container = document.getElementById('home-content');
    if (!container || this.data) return;
    container.innerHTML = this.renderSkeleton();
    await this.fetchData();
    this.render(container);
  },

  async fetchData() {
    try {
      const shuffled = [...this.trendingQueries].sort(() => Math.random() - 0.5);
      const [res1, res2, channelsRes] = await Promise.all([
        YouTubeAPI.search', { q: shuffled[0], limit: 25 }),
        YouTubeAPI.search', { q: shuffled[1], limit: 25 }),
        YouTubeAPI.getTrendingChannels()'),
      ]);
      const allSongs = []; const ids = new Set();
      (res1.data?.videos || []).forEach(s => { if (!ids.has(s.id)) { ids.add(s.id); allSongs.push(s); } });
      const secondBatch = [];
      (res2.data?.videos || []).forEach(s => { if (!ids.has(s.id)) { ids.add(s.id); secondBatch.push(s); } });
      this.data = {
        trending: allSongs.slice(0, 8),
        newReleases: secondBatch.slice(0, 8),
        channels: (channelsRes.data || []).slice(0, 6),
      };
    } catch (e) { console.error('Home fetch error:', e); }
  },

  render(container) {
    const d = this.data || { trending: [], newReleases: [], channels: [] };
    container.innerHTML = `
      <div class="genre-pills">${this.genres.map(g => `<span class="genre-pill" onclick="HomePage.openGenre('${g}')">${g}</span>`).join('')}</div>
      ${d.trending.length > 0 ? `
        <div class="section-header"><span class="section-title">🔥 Trending Now</span><span class="section-link" onclick="Router.navigate('search')">See All</span></div>
        <div class="video-grid">${d.trending.map(s => this.videoCard(s)).join('')}</div>
      ` : ''}
      ${d.newReleases.length > 0 ? `
        <div class="section-header"><span class="section-title">🆕 New Releases</span></div>
        <div class="video-grid">${d.newReleases.map(s => this.videoCard(s)).join('')}</div>
      ` : ''}
      ${d.channels.length > 0 ? `
        <div class="section-header"><span class="section-title">🎤 Trending Channels</span></div>
        <div class="video-grid">${d.channels.map(c => this.channelCard(c)).join('')}</div>
      ` : ''}
      ${d.trending.length === 0 ? '<div class="empty-state"><p>Loading content...</p></div>' : ''}
    `;
  },

  videoCard(song) {
    const thumb = `https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`;
    return `
      <div class="video-card">
        <div class="card-thumb" onclick="HomePage.showQualitySheet({id:'${song.id}',title:'${this.escapeAttr(song.title || '')}',artist:'${this.escapeAttr(song.artist || '')}'})">
          <img src="${thumb}" alt="" onerror="this.style.display='none'"><span class="duration-badge">${System.formatDuration(song.duration || 0)}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${this.escapeHtml(song.title || '')}</div>
          <div class="card-meta"><span>${this.escapeHtml(song.artist || '')}</span><span>${System.formatNumber(song.views || 0)} views</span></div>
        </div>
        <div class="card-actions"><button class="download-card-btn" onclick="HomePage.showQualitySheet({id:'${song.id}',title:'${this.escapeAttr(song.title || '')}',artist:'${this.escapeAttr(song.artist || '')}'})">⬇ Download</button></div>
      </div>`;
  },

  channelCard(channel) {
    return `
      <div class="video-card" onclick="window.open('https://youtube.com/channel/${channel.id}', '_blank')">
        <div class="card-thumb" style="display:flex;align-items:center;justify-content:center;background:var(--color-primary-surface);">
          <img src="${channel.thumbnail || ''}" alt="" style="width:64px;height:64px;border-radius:50%;" onerror="this.style.display='none'">
        </div>
        <div class="card-body" style="text-align:center">
          <div class="card-title">${this.escapeHtml(channel.title || '')}</div>
          <div class="card-meta" style="justify-content:center">${System.formatNumber(channel.subscriberCount || 0)} subscribers</div>
        </div>
      </div>`;
  },

  showQualitySheet(song) {
    const qualities = [
      { label: 'MP3 Audio', quality: '128kbps', size: '~3MB', format: 'mp3' },
      { label: 'MP3 High', quality: '320kbps', size: '~8MB', format: 'mp3' },
      { label: '360p Video', quality: '360p', size: '~15MB', format: 'mp4' },
      { label: '480p Video', quality: '480p', size: '~28MB', format: 'mp4' },
      { label: '720p Video', quality: '720p', size: '~55MB', format: 'mp4' },
      { label: '1080p Video', quality: '1080p', size: '~120MB', format: 'mp4' },
    ];
    const html = `
      <h3 style="margin-bottom:var(--space-md);font-size:var(--font-size-base);">${song.title || 'Download'}</h3>
      <p style="font-size:var(--font-size-sm);color:var(--color-text-tertiary);margin-bottom:var(--space-md);">${song.artist || ''}</p>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-sm);margin-bottom:var(--space-md);">
        ${qualities.map(q => `<button class="quality-chip" onclick="HomePage.downloadNow('${song.id}','${q.quality}','${q.format}')" style="padding:var(--space-sm);border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-surface);cursor:pointer;text-align:center;"><div style="font-weight:600;font-size:var(--font-size-sm);">${q.label}</div><div style="font-size:var(--font-size-xs);color:var(--color-text-tertiary);">${q.quality} • ${q.size}</div></button>`).join('')}
      </div>
      <button onclick="System.hideSheet()" style="width:100%;padding:var(--space-sm);border:none;background:var(--color-background);border-radius:var(--radius-sm);cursor:pointer;">Cancel</button>`;
    System.showSheet(html);
  },

  downloadNow(videoId, quality, format) {
    System.hideSheet();
    DownloadPage.addDownload({ id: videoId, title: 'Downloading...' }, quality);
    System.toast(`Starting ${quality} ${format} download...`);
  },

  openGenre(genre) {
    Router.navigate('search');
    setTimeout(() => {
      const input = document.getElementById('search-input-full');
      if (input) { input.value = genre; SearchPage.search(genre); }
    }, 300);
  },

  renderSkeleton() {
    return `<div class="genre-pills">${this.genres.map(() => '<div class="skeleton" style="width:70px;height:32px;border-radius:20px;"></div>').join('')}</div>
      <div class="video-grid">${Array.from({length:4}).map(() => '<div class="skeleton" style="aspect-ratio:16/9;border-radius:12px;"></div>').join('')}</div>`;
  },

  escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; },
  escapeAttr(text) { return text.replace(/'/g, "\\'").replace(/"/g, '&quot;'); },
};
