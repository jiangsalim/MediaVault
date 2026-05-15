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
    // Try cache first
    const cached = localStorage.getItem(CONFIG.STORAGE_KEYS.HOME_CACHE);
    if (cached) {
      try { this.data = JSON.parse(cached); } catch {}
    }

    // Fetch fresh data
    try {
      const shuffled = [...this.trendingQueries].sort(() => Math.random() - 0.5);
      const [res1, res2, channelsRes] = await Promise.all([
        System.apiGet('/search', { q: shuffled[0], limit: 25 }),
        System.apiGet('/search', { q: shuffled[1], limit: 25 }),
        System.apiGet('/channels/trending'),
      ]);

      const allSongs = [];
      const ids = new Set();
      (res1.data?.videos || []).forEach(s => { if (!ids.has(s.id)) { ids.add(s.id); allSongs.push(s); } });
      const secondBatch = [];
      (res2.data?.videos || []).forEach(s => { if (!ids.has(s.id)) { ids.add(s.id); secondBatch.push(s); } });

      this.data = {
        trending: allSongs.slice(0, 8),
        newReleases: secondBatch.slice(0, 8),
        channels: (channelsRes.data || []).slice(0, 6),
      };

      localStorage.setItem(CONFIG.STORAGE_KEYS.HOME_CACHE, JSON.stringify(this.data));
    } catch (e) {
      console.error('Home fetch error:', e);
    }
  },

  render(container) {
    const d = this.data || { trending: [], newReleases: [], channels: [] };
    container.innerHTML = `
      <div class="genre-pills">${this.genres.map(g => `<span class="genre-pill" onclick="HomePage.openGenre('${g}')">${g}</span>`).join('')}</div>
      <div class="section-header"><span class="section-title">🔥 Trending Now</span><a href="#" class="section-link" onclick="Router.navigate('search')">See All</a></div>
      <div class="video-grid">${d.trending.length > 0 ? d.trending.map(s => this.videoCard(s)).join('') : '<div class="empty-state"><p>Loading...</p></div>'}</div>
      <div class="section-header"><span class="section-title">🆕 New Releases</span></div>
      <div class="video-grid">${d.newReleases.length > 0 ? d.newReleases.map(s => this.videoCard(s)).join('') : ''}</div>
      <div class="section-header"><span class="section-title">🎤 Trending Channels</span></div>
      <div class="video-grid">${d.channels.length > 0 ? d.channels.map(c => this.channelCard(c)).join('') : ''}</div>
    `;
  },

  videoCard(song) {
    const thumb = `https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`;
    const dur = System.formatDuration(song.duration || 0);
    const views = System.formatNumber(song.views || 0);
    return `
      <div class="video-card" onclick="HomePage.openSong('${song.id}')">
        <div class="card-thumb"><img src="${thumb}" alt="" onerror="this.style.display='none'"><span class="duration-badge">${dur}</span></div>
        <div class="card-body">
          <div class="card-title">${this.escapeHtml(song.title || '')}</div>
          <div class="card-meta"><span>${this.escapeHtml(song.artist || '')}</span><span>${views} views</span></div>
        </div>
      </div>`;
  },

  channelCard(channel) {
    return `
      <div class="video-card" onclick="window.open('https://youtube.com/channel/${channel.id}', '_blank')">
        <div class="card-thumb" style="display:flex;align-items:center;justify-content:center;">
          <img src="${channel.thumbnail || ''}" alt="" style="width:64px;height:64px;border-radius:50%;" onerror="this.style.display='none'">
        </div>
        <div class="card-body" style="text-align:center">
          <div class="card-title">${this.escapeHtml(channel.title || '')}</div>
          <div class="card-meta" style="justify-content:center">${System.formatNumber(channel.subscriberCount || 0)} subscribers</div>
        </div>
      </div>`;
  },

  openSong(id) {
    System.toast('Opening...');
    window.open(`https://youtube.com/watch?v=${id}`, '_blank');
  },

  openGenre(genre) {
    Router.navigate('search');
    setTimeout(() => {
      const input = document.getElementById('search-input');
      if (input) { input.value = genre; SearchPage.search(genre); }
    }, 300);
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  renderSkeleton() {
    return `
      <div class="genre-pills">${this.genres.map(() => '<div class="skeleton" style="width:70px;height:32px;border-radius:20px;"></div>').join('')}</div>
      <div class="video-grid">${Array.from({length:4}).map(() => '<div class="skeleton" style="aspect-ratio:16/9;border-radius:12px;"></div>').join('')}</div>`;
  },
};
