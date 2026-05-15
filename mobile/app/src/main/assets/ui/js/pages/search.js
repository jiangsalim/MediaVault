const SearchPage = {
  results: [],
  suggestions: [],
  history: [],
  query: '',
  nextPageToken: '',
  loadingMore: false,

  init() {
    this.history = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY) || '[]');
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('search-content');
    container.innerHTML = `
      <div class="search-bar search-bar-full">
        <span class="search-icon">🔍</span>
        <input type="text" id="search-input-full" placeholder="Search songs, artists..." autocomplete="off">
        <button class="voice-btn" id="btn-voice-search-full" title="Voice Search">🎤</button>
        <button class="search-submit" id="search-submit-full">Search</button>
      </div>
      <div id="suggestions-container"></div>
      <div id="results-container">
        ${this.query ? '' : this.renderEmptyState()}
      </div>
      <div id="infinite-scroll-trigger"></div>
    `;
    if (this.query) {
      const input = document.getElementById('search-input-full');
      if (input) { input.value = this.query; this.search(this.query); }
    }
    this.initInfiniteScroll();
  },

  initInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.nextPageToken && !this.loadingMore) {
        this.loadMore();
      }
    }, { threshold: 0.1 });
    const trigger = document.getElementById('infinite-scroll-trigger');
    if (trigger) observer.observe(trigger);
  },

  bindEvents() {
    const input = document.getElementById('search-input-full');
    const submitBtn = document.getElementById('search-submit-full');
    const voiceBtn = document.getElementById('btn-voice-search-full');

    input?.addEventListener('input', () => this.onInput(input.value));
    input?.addEventListener('focus', () => this.showSuggestions());
    submitBtn?.addEventListener('click', () => { const q = input.value.trim(); if (q) this.search(q); });
    input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const q = input.value.trim(); if (q) this.search(q); } });
    voiceBtn?.addEventListener('click', () => this.voiceSearch());

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#search-content')) this.hideSuggestions();
    });
  },

  voiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      System.toast('Voice search not supported'); return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; recognition.interimResults = false;
    System.toast('🎤 Listening...');
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById('search-input-full');
      if (input) { input.value = transcript; }
      this.search(transcript);
    };
    recognition.onerror = () => System.toast('Voice recognition failed');
  },

  async onInput(value) {
    if (value.length < 2) { this.hideSuggestions(); return; }
    try {
      const res = await System.apiGet('/suggest', { q: value });
      this.suggestions = res.data || [];
      this.showSuggestions();
    } catch {}
  },

  showSuggestions() {
    const container = document.getElementById('suggestions-container');
    if (!container) return;
    let html = '';
    if (this.suggestions.length > 0) {
      html += this.suggestions.map(s => `<button class="suggestion-item" onclick="SearchPage.search('${this.escapeAttr(s)}')"><span class="suggestion-icon">🔍</span>${this.escapeHtml(s)}</button>`).join('');
    }
    if (!this.query && this.history.length > 0) {
      html += `<div class="history-header"><span>Recent Searches</span><button class="history-clear" onclick="SearchPage.clearHistory()">Clear</button></div>`;
      html += this.history.map(h => `<button class="suggestion-item" onclick="SearchPage.search('${this.escapeAttr(h)}')"><span class="suggestion-icon">🕐</span>${this.escapeHtml(h)}</button>`).join('');
    }
    container.innerHTML = html;
    container.style.display = html ? 'block' : 'none';
  },

  hideSuggestions() { const c = document.getElementById('suggestions-container'); if (c) c.style.display = 'none'; },

  async search(query) {
    this.query = query;
    this.results = [];
    this.nextPageToken = '';
    this.hideSuggestions();
    this.history = [query, ...this.history.filter(h => h !== query)].slice(0, CONFIG.MAX_SEARCH_HISTORY);
    localStorage.setItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(this.history));

    const container = document.getElementById('results-container');
    container.innerHTML = this.renderLoading();

    try {
      const res = await System.apiGet('/search', { q: query, limit: 25 });
      this.results = res.data?.videos || [];
      this.nextPageToken = res.data?.nextPageToken || '';
      container.innerHTML = this.renderResults();
    } catch {
      container.innerHTML = '<div class="empty-state"><p>Search failed. Try again.</p></div>';
    }
  },

  async loadMore() {
    if (!this.nextPageToken || this.loadingMore) return;
    this.loadingMore = true;
    const trigger = document.getElementById('infinite-scroll-trigger');
    if (trigger) trigger.innerHTML = '<div style="text-align:center;padding:var(--space-md);"><span class="skeleton" style="display:inline-block;width:120px;height:20px;"></span></div>';

    try {
      const res = await System.apiGet('/search/next', { q: this.query, page_token: this.nextPageToken, limit: 25 });
      const newVideos = res.data?.videos || [];
      this.results = [...this.results, ...newVideos];
      this.nextPageToken = res.data?.nextPageToken || '';
      const container = document.getElementById('results-container');
      container.innerHTML = this.renderResults();
    } catch {}
    this.loadingMore = false;
  },

  renderResults() {
    if (this.results.length === 0) return '<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No results found</div><div class="empty-text">Try different keywords</div></div>';
    let html = `<h2 style="padding:var(--space-md);font-size:var(--font-size-lg);font-weight:700;">Results for "${this.escapeHtml(this.query)}"</h2><div class="video-grid">`;
    html += this.results.map(s => this.resultCard(s)).join('');
    html += '</div>';
    return html;
  },

  resultCard(song) {
    const thumb = `https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`;
    return `
      <div class="video-card" onclick="SearchPage.showQualitySheet('${song.id}')">
        <div class="card-thumb"><img src="${thumb}" alt="" onerror="this.style.display='none'"><span class="duration-badge">${System.formatDuration(song.duration || 0)}</span></div>
        <div class="card-body">
          <div class="card-title">${this.escapeHtml(song.title || '')}</div>
          <div class="card-meta"><span>${this.escapeHtml(song.artist || '')}</span><span>${System.formatNumber(song.views || 0)} views</span></div>
        </div>
        <div class="card-actions"><button class="quality-chip" style="width:100%;padding:8px;border:none;background:var(--color-primary);color:white;border-radius:var(--radius-sm);cursor:pointer;font-weight:600;">⬇ Download</button></div>
      </div>`;
  },

  showQualitySheet(id) {
    const song = this.results.find(s => s.id === id);
    if (song && typeof HomePage !== 'undefined') HomePage.showQualitySheet(song);
  },

  renderEmptyState() {
    return `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">Search Music</div><div class="empty-text">Search for songs, artists, or albums</div></div>`;
  },

  renderLoading() {
    return `<h2 style="padding:var(--space-md);"><div class="skeleton" style="width:200px;height:24px;"></div></h2><div class="video-grid">${Array.from({length:6}).map(() => '<div class="skeleton" style="aspect-ratio:16/9;border-radius:12px;"></div>').join('')}</div>`;
  },

  clearHistory() { this.history = []; localStorage.removeItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY); this.showSuggestions(); },
  escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; },
  escapeAttr(text) { return text.replace(/'/g, "\\'").replace(/"/g, '&quot;'); },
};
