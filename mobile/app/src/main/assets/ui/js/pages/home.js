const HomePage = {
  genres: ['Gospel', 'Dancehall', 'Afrobeat', 'Hip Hop', 'Reggae', 'Bongo Flava', 'Zouk', 'R&B', 'Amapiano', 'Singeli'],
  data: null,
  results: [],
  suggestions: [],
  history: [],
  isSearching: false,

  async load() {
    this.history = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY) || '[]');
    this.bindSearchEvents();
  checkClipboard() {
    setTimeout(async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && (text.includes("youtube.com") || text.includes("youtu.be") || text.includes("spotify.com") || text.includes("tiktok.com") || text.includes("instagram.com"))) {
          System.toast("📋 URL detected in clipboard");
        }
      } catch {}
    }, 1000);
  },
    
    // Load trending content
    const homeContainer = document.getElementById('home-content');
    if (homeContainer && !this.data) {
      homeContainer.innerHTML = this.renderSkeleton();
      await this.fetchData();
      this.renderHome(homeContainer);
    }
  },

  bindSearchEvents() {
  checkClipboard() {
    setTimeout(async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && (text.includes("youtube.com") || text.includes("youtu.be") || text.includes("spotify.com") || text.includes("tiktok.com") || text.includes("instagram.com"))) {
          System.toast("📋 URL detected in clipboard");
        }
      } catch {}
    }, 1000);
  },
    const input = document.getElementById('search-input-main');
    const voiceBtn = document.getElementById('btn-voice-search');
    const pasteBtn = document.getElementById('btn-paste-url');

    input?.addEventListener('input', () => this.onInput(input.value));
    input?.addEventListener('focus', () => {
      if (!this.isSearching) this.showSuggestions();
    });
      const q = input.value.trim();
      if (q) this.search(q);
    });
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const q = input.value.trim(); if (q) this.search(q); }
    });

    voiceBtn?.addEventListener('click', () => this.voiceSearch());

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar-main') && !e.target.closest('#suggestions-container')) {
        document.getElementById('suggestions-container').style.display = 'none';
      }
    });
  },

  async onInput(value) {
    if (value.length < 2) {
      document.getElementById('suggestions-container').style.display = 'none';
      return;
    }
    this.suggestions = await YouTubeAPI.getSuggestions(value);
    this.showSuggestions();
  },

  showSuggestions() {
    const container = document.getElementById('suggestions-container');
    if (!container) return;
    let html = '';
    if (this.suggestions.length > 0) {
      html += this.suggestions.map(s => `<button class="suggestion-item" onclick="HomePage.search('${this.escapeAttr(s)}')"><span class="suggestion-icon">🔍</span>${this.escapeHtml(s)}</button>`).join('');
    }
    if (!this.isSearching && this.history.length > 0) {
      html += `<div class="history-header"><span>Recent</span><button class="history-clear" onclick="HomePage.clearHistory()">Clear</button></div>`;
      html += this.history.map(h => `<button class="suggestion-item" onclick="HomePage.search('${this.escapeAttr(h)}')"><span class="suggestion-icon">🕐</span>${this.escapeHtml(h)}</button>`).join('');
    }
    container.innerHTML = html;
    container.style.display = html ? 'block' : 'none';
  },

  async search(query) {
    this.isSearching = true;
    document.getElementById('suggestions-container').style.display = 'none';
    this.history = [query, ...this.history.filter(h => h !== query)].slice(0, CONFIG.MAX_SEARCH_HISTORY);
    localStorage.setItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(this.history));
    BadgeSystem.track('search');

    // Hide home content, show results
    document.getElementById('home-content').style.display = 'none';
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = this.renderLoading();

    const res = await YouTubeAPI.search(query);
    this.results = res.videos || [];
    resultsContainer.innerHTML = this.renderResults(query);
  },

  renderResults(query) {
    if (this.results.length === 0) {
      return `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No results</div><div class="empty-text">Try different keywords</div>
        <button onclick="HomePage.backToHome()" style="margin-top:var(--space-md);padding:var(--space-sm) var(--space-xl);background:var(--color-primary);color:white;border:none;border-radius:var(--radius-full);cursor:pointer;">Back to Home</button></div>`;
    }
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-md);">
        <h2 style="font-size:var(--font-size-lg);font-weight:700;">Results for "${this.escapeHtml(query)}"</h2>
        <button onclick="HomePage.backToHome()" style="background:none;border:none;color:var(--color-primary);cursor:pointer;">✕</button>
      </div>
      <div class="video-grid" style="padding:var(--space-md);">
        ${this.results.map(s => this.resultCard(s)).join('')}
      </div>`;
  },

  backToHome() {
    this.isSearching = false;
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('results-container').innerHTML = '';
    document.getElementById('home-content').style.display = 'block';
    document.getElementById('search-input-main').value = '';
    this.results = [];
  },

  resultCard(song) {
    const thumb = `https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`;
    return `
      <div class="video-card" onclick="HomePage.showQualitySheet('${song.id}')">
        <div class="card-thumb"><img src="${thumb}" alt="" onerror="this.style.display='none'"><span class="duration-badge">${System.formatDuration(song.duration || 0)}</span></div>
        <div class="card-body">
          <div class="card-title">${this.escapeHtml(song.title || '')}</div>
          <div class="card-meta"><span>${this.escapeHtml(song.artist || '')}</span><span>${System.formatNumber(song.views || 0)} views</span></div>
        </div>
        <div class="card-actions"><button class="download-card-btn">⬇ Download</button></div>
      </div>`;
  },

  voiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      System.toast('Voice search not supported'); return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US'; rec.interimResults = false;
    System.toast('🎤 Listening...');
    rec.start();
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      document.getElementById('search-input-main').value = text;
      this.search(text);
    };
    rec.onerror = () => System.toast('Voice failed');
  },

    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        document.getElementById('search-input-main').value = text;
        System.toast('URL pasted');
        if (text.includes('youtube.com') || text.includes('youtu.be')) this.search(text);
      }
    } catch { System.toast('Clipboard access denied'); }
  },

  // ── Homepage Content ──
  async fetchData() {
    try {
      const [res1, res2, channels] = await Promise.all([
        YouTubeAPI.search('trending music', 25),
        YouTubeAPI.search('new hits', 25),
        YouTubeAPI.getTrendingChannels(),
      ]);
      const allSongs = []; const ids = new Set();
      (res1.videos || []).forEach(s => { if (!ids.has(s.id)) { ids.add(s.id); allSongs.push(s); } });
      const second = [];
      (res2.videos || []).forEach(s => { if (!ids.has(s.id)) { ids.add(s.id); second.push(s); } });
      this.data = { trending: allSongs.slice(0, 8), newReleases: second.slice(0, 8), channels: channels.slice(0, 6) };
    } catch (e) { console.error('Home fetch error:', e); }
  },

  renderHome(container) {
    const d = this.data || { trending: [], newReleases: [], channels: [] };
    container.innerHTML = `
      <div class="genre-pills">${this.genres.map(g => `<span class="genre-pill" onclick="HomePage.search('${g}')">${g}</span>`).join('')}</div>
      ${d.trending.length > 0 ? `<div class="section-header"><span class="section-title">🔥 Trending Now</span></div><div class="video-grid" style="padding:var(--space-md);">${d.trending.map(s => this.resultCard(s)).join('')}</div>` : ''}
      ${d.newReleases.length > 0 ? `<div class="section-header"><span class="section-title">🆕 New Releases</span></div><div class="video-grid" style="padding:var(--space-md);">${d.newReleases.map(s => this.resultCard(s)).join('')}</div>` : ''}
      ${d.channels.length > 0 ? `<div class="section-header"><span class="section-title">🎤 Channels</span></div><div class="video-grid" style="padding:var(--space-md);">${d.channels.map(c => this.channelCard(c)).join('')}</div>` : ''}
    `;
  },

  channelCard(ch) {
    return `<div class="video-card" onclick="window.open('https://youtube.com/channel/${ch.id}','_blank')" style="text-align:center;padding:var(--space-md);">
      <img src="${ch.thumbnail||''}" style="width:56px;height:56px;border-radius:50%;margin:0 auto var(--space-sm);">
      <div class="card-title">${this.escapeHtml(ch.title||'')}</div>
      <div class="card-meta" style="justify-content:center;">${System.formatNumber(ch.subscriberCount||0)} subs</div>
    </div>`;
  },

  showQualitySheet(id) {
    const song = this.results.find(s => s.id === id) || (this.data?.trending || []).find(s => s.id === id) || (this.data?.newReleases || []).find(s => s.id === id);
    if (!song) return;
    const qualities = [
      { label: 'MP3 Audio', quality: '128kbps', size: '~3MB', format: 'mp3' },
      { label: 'MP3 High', quality: '320kbps', size: '~8MB', format: 'mp3' },
      { label: '360p Video', quality: '360p', size: '~15MB', format: 'mp4' },
      { label: '480p Video', quality: '480p', size: '~28MB', format: 'mp4' },
      { label: '720p Video', quality: '720p', size: '~55MB', format: 'mp4' },
      { label: '1080p Video', quality: '1080p', size: '~120MB', format: 'mp4' },
    ];
    System.showSheet(`
      <h3 style="margin-bottom:8px;">${song.title}</h3>
      <p style="font-size:var(--font-size-sm);color:var(--color-text-tertiary);margin-bottom:12px;">${song.artist}</p>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">
        ${qualities.map(q => `<button onclick="HomePage.downloadNow('${song.id}','${q.quality}','${q.format}')" style="padding:10px;border:1px solid var(--color-border);border-radius:8px;background:var(--color-surface);cursor:pointer;"><div style="font-weight:600;">${q.label}</div><div style="font-size:12px;color:var(--color-text-tertiary);">${q.quality} • ${q.size}</div></button>`).join('')}
      </div>
      <button onclick="System.hideSheet()" style="width:100%;padding:10px;border:none;background:var(--color-background);border-radius:8px;cursor:pointer;">Cancel</button>
    `);
  },

  downloadNow(id, quality, format) {
    System.hideSheet();
    DownloadPage.addDownload({ id, title: 'Downloading...' }, quality);
    System.toast(`Starting ${quality} ${format} download...`);
  },

  renderSkeleton() { return `<div class="video-grid" style="padding:var(--space-md);">${Array.from({length:4}).map(()=>'<div class="skeleton" style="aspect-ratio:16/9;border-radius:12px;"></div>').join('')}</div>`; },
  renderLoading() { return `<div class="video-grid" style="padding:var(--space-md);">${Array.from({length:6}).map(()=>'<div class="skeleton" style="aspect-ratio:16/9;border-radius:12px;"></div>').join('')}</div>`; },
  clearHistory() { this.history = []; localStorage.removeItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY); this.showSuggestions(); },
  escapeHtml(t) { const d=document.createElement('div');d.textContent=t;return d.innerHTML; },
  escapeAttr(t) { return t.replace(/'/g,"\\'").replace(/"/g,'&quot;'); },
};
