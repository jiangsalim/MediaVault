const SearchPage = {
  results: [],
  suggestions: [],
  history: [],
  query: '',

  init() {
    this.history = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY) || '[]');
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('search-content');
    container.innerHTML = `
      <div class="search-bar">
        <input type="text" id="search-input" placeholder="Search songs, artists..." autocomplete="off">
        <button class="search-submit" id="search-submit-btn">🔍</button>
      </div>
      <div id="suggestions-container"></div>
      <div id="results-container">
        ${this.query ? '' : this.renderEmptyState()}
      </div>
    `;
    if (this.query) {
      document.getElementById('search-input').value = this.query;
      this.search(this.query);
    }
  },

  bindEvents() {
    const input = document.getElementById('search-input');
    const submitBtn = document.getElementById('search-submit-btn');

    input?.addEventListener('input', () => this.onInput(input.value));
    input?.addEventListener('focus', () => this.showSuggestions());
    submitBtn?.addEventListener('click', () => {
      const q = input.value.trim();
      if (q) this.search(q);
    });
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const q = input.value.trim(); if (q) this.search(q); }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#search-content')) this.hideSuggestions();
    });
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

  hideSuggestions() {
    const container = document.getElementById('suggestions-container');
    if (container) container.style.display = 'none';
  },

  async search(query) {
    this.query = query;
    this.hideSuggestions();

    // Save to history
    this.history = [query, ...this.history.filter(h => h !== query)].slice(0, CONFIG.MAX_SEARCH_HISTORY);
    localStorage.setItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(this.history));

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = this.renderLoading();

    try {
      const res = await System.apiGet('/search', { q: query, limit: 25 });
      this.results = res.data?.videos || [];
      resultsContainer.innerHTML = this.renderResults();
    } catch {
      resultsContainer.innerHTML = '<div class="empty-state"><p>Search failed. Try again.</p></div>';
    }
  },

  renderResults() {
    if (this.results.length === 0) return '<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No results found</div><div class="empty-text">Try different keywords</div></div>';
    return `<h2 style="padding:var(--space-md);font-size:var(--font-size-lg);font-weight:700;">Results for "${this.escapeHtml(this.query)}"</h2>
      <div class="video-grid">${this.results.map(s => this.resultCard(s)).join('')}</div>`;
  },

  resultCard(song) {
    const thumb = `https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`;
    return `
      <div class="video-card" onclick="window.open('https://youtube.com/watch?v=${song.id}','_blank')">
        <div class="card-thumb"><img src="${thumb}" alt="" onerror="this.style.display='none'"><span class="duration-badge">${System.formatDuration(song.duration || 0)}</span></div>
        <div class="card-body">
          <div class="card-title">${this.escapeHtml(song.title || '')}</div>
          <div class="card-meta"><span>${this.escapeHtml(song.artist || '')}</span><span>${System.formatNumber(song.views || 0)} views</span></div>
        </div>
      </div>`;
  },

  renderEmptyState() {
    return `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">Search Music</div><div class="empty-text">Search for songs, artists, or albums</div></div>`;
  },

  renderLoading() {
    return `<div class="video-grid">${Array.from({length:6}).map(() => '<div class="skeleton" style="aspect-ratio:16/9;border-radius:12px;"></div>').join('')}</div>`;
  },

  clearHistory() {
    this.history = [];
    localStorage.removeItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY);
    this.showSuggestions();
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  escapeAttr(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  },
};
