/**
 * MediaVault — Home Page
 * Google-style search + trending + quality sheet + infinite scroll
 */

var Home = {
  results: [],
  suggestions: [],
  history: [],
  isSearching: false,
  nextPage: '',
  loadingMore: false,

  load: function() {
    this.history = JSON.parse(localStorage.getItem(CONFIG.STORAGE.HISTORY) || '[]');
    this.render();
    this.bindEvents();
    this.loadTrending();
  },

  render: function() {
    var page = document.getElementById('page-home');
    page.innerHTML = ''
      + '<div class="search-container">'
      + '<h1>What do you want to download?</h1>'
      + '<div class="search-box">'
      + Icons.search
      + '<input type="text" id="search-input" placeholder="Search or paste URL..." autocomplete="off">'
      + '<button id="btn-voice" title="Voice Search">' + Icons.voice + '</button>'
      + '</div>'
      + '<div id="suggestions"></div>'
      + '</div>'
      + '<div id="results-area"></div>'
      + '<div id="trending-area"></div>'
      + '<div id="scroll-trigger" style="height:20px;"></div>';
  },

  bindEvents: function() {
    var self = this;
    var input = document.getElementById('search-input');
    var voice = document.getElementById('btn-voice');

    input.addEventListener('input', function() { self.onInput(this.value); });
    input.addEventListener('focus', function() { if (!self.isSearching) self.showSuggestions(); });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { var q = this.value.trim(); if (q) self.search(q); }
    });
    voice.addEventListener('click', function() { self.voiceSearch(); });
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-box') && !e.target.closest('#suggestions')) {
        document.getElementById('suggestions').style.display = 'none';
      }
    });

    // Infinite scroll observer
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && self.nextPage && !self.loadingMore) {
        self.loadMore();
      }
    }, { threshold: 0.1 });
    var trigger = document.getElementById('scroll-trigger');
    if (trigger) observer.observe(trigger);
  },

  onInput: async function(value) {
    if (value.length < 2) { document.getElementById('suggestions').style.display = 'none'; return; }
    // Detect YouTube/Spotify URLs
    if (this._isURL(value)) {
      document.getElementById('suggestions').style.display = 'none';
      return;
    }
    this.suggestions = await API.suggest(value);
    this.showSuggestions();
  },

  _isURL: function(text) {
    return /youtube\.com|youtu\.be|spotify\.com|tiktok\.com|instagram\.com/i.test(text);
  },

  showSuggestions: function() {
    var el = document.getElementById('suggestions');
    var html = '';
    var self = this;
    if (this.suggestions.length > 0) {
      html += this.suggestions.map(function(s) {
        return '<button class="suggestion" onclick="Home.search(\'' + Helpers.escape(s) + '\')">' + Icons.search + '<span>' + Helpers.escape(s) + '</span></button>';
      }).join('');
    }
    if (!this.isSearching && this.history.length > 0) {
      html += '<div style="padding:8px 16px;font-size:11px;font-weight:600;color:var(--text-tertiary);display:flex;justify-content:space-between;"><span>RECENT</span><button onclick="Home.clearHistory()" style="background:none;border:none;color:var(--text-tertiary);cursor:pointer;font-size:11px;">Clear</button></div>';
      html += this.history.map(function(h) {
        return '<button class="suggestion" onclick="Home.search(\'' + Helpers.escape(h) + '\')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>' + Helpers.escape(h) + '</span></button>';
      }).join('');
    }
    el.innerHTML = html;
    el.style.display = html ? 'block' : 'none';
  },

  clearHistory: function() { this.history = []; localStorage.removeItem(CONFIG.STORAGE.HISTORY); this.showSuggestions(); },

  search: function(query) {
    this.isSearching = true;
    this.nextPage = '';
    document.getElementById('suggestions').style.display = 'none';
    this.history = [query].concat(this.history.filter(function(h) { return h !== query; })).slice(0, CONFIG.MAX_HISTORY);
    localStorage.setItem(CONFIG.STORAGE.HISTORY, JSON.stringify(this.history));
    if (typeof Badges !== 'undefined') Badges.track('searches');
    document.getElementById('trending-area').style.display = 'none';
    var resultsArea = document.getElementById('results-area');
    resultsArea.style.display = 'block';
    resultsArea.innerHTML = '<div class="video-grid">' + Array(6).fill('<div class="skeleton" style="aspect-ratio:16/9;"></div>').join('') + '</div>';
    var self = this;
    API.search(query, 25).then(function(res) {
      self.results = res.videos || res;
      self.nextPage = res.nextPage || '';
      resultsArea.innerHTML = self.renderResults(query);
    });
  },

  loadMore: function() {
    if (!this.nextPage || this.loadingMore) return;
    this.loadingMore = true;
    var self = this;
    API.search(this.history[0], 25).then(function(res) {
      var more = res.videos || res;
      self.results = self.results.concat(more);
      self.nextPage = res.nextPage || '';
      self.loadingMore = false;
      document.getElementById('results-area').innerHTML = self.renderResults(self.history[0]);
    });
  },

  renderResults: function(query) {
    var self = this;
    if (this.results.length === 0) {
      return '<div class="empty"><div class="empty-icon">🔍</div><div class="empty-title">No results</div><div class="empty-text">Try different keywords</div><button onclick="Home.backToHome()" style="margin-top:16px;padding:10px 24px;background:var(--accent);color:var(--accent-text);border:none;border-radius:99px;cursor:pointer;">Back to Home</button></div>';
    }
    return ''
      + '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px;">'
      + '<h2 style="font-size:18px;font-weight:700;">Results for "' + Helpers.escape(query) + '"</h2>'
      + '<button onclick="Home.backToHome()" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:20px;">' + Icons.close + '</button>'
      + '</div>'
      + '<div class="video-grid">' + this.results.map(function(s) { return self.resultCard(s); }).join('') + '</div>';
  },

  backToHome: function() {
    this.isSearching = false; this.nextPage = '';
    document.getElementById('results-area').style.display = 'none';
    document.getElementById('results-area').innerHTML = '';
    document.getElementById('trending-area').style.display = 'block';
    document.getElementById('search-input').value = '';
    this.results = [];
  },

  resultCard: function(song) {
    var thumb = 'https://i.ytimg.com/vi/' + song.id + '/hqdefault.jpg';
    return ''
      + '<div class="video-card" onclick="Home.showSheet(\'' + song.id + '\')">'
      + '<div class="card-thumb"><img src="' + thumb + '" alt="" onerror="this.style.display=\'none\'"><span class="card-duration">' + Helpers.formatDuration(song.duration) + '</span></div>'
      + '<div class="card-body"><div class="card-title">' + Helpers.escape(song.title) + '</div><div class="card-meta">' + Helpers.escape(song.artist) + ' · ' + Helpers.formatNumber(song.views) + ' views</div></div>'
      + '<button class="card-dl">Download</button></div>';
  },

  voiceSearch: function() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { Toast.show('Voice not supported'); return; }
    var rec = new SpeechRecognition(); rec.lang = 'en-US'; rec.interimResults = false;
    Toast.show('Listening...'); rec.start();
    var self = this;
    rec.onresult = function(e) { var text = e.results[0][0].transcript; document.getElementById('search-input').value = text; self.search(text); };
    rec.onerror = function() { Toast.show('Voice failed'); };
  },

  showSheet: function(id) {
    var song = this.results.find(function(s) { return s.id === id; });
    if (!song) return;
    var html = '<h3 style="font-size:16px;margin-bottom:4px;">' + Helpers.escape(song.title) + '</h3>'
      + '<p style="font-size:13px;color:var(--text-tertiary);margin-bottom:16px;">' + Helpers.escape(song.artist) + '</p>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">';
    CONFIG.QUALITY_PRESETS.forEach(function(q) {
      html += '<button onclick="Home.downloadNow(\'' + id + '\',\'' + q.quality + '\',\'' + q.format + '\')" style="padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--bg);cursor:pointer;text-align:center;"><div style="font-weight:600;font-size:13px;">' + q.label + '</div><div style="font-size:11px;color:var(--text-tertiary);">' + q.quality + '</div></button>';
    });
    html += '</div><button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;font-size:14px;">Cancel</button>';
    Sheet.show(html);
  },

  downloadNow: function(id, quality, format) {
    Sheet.hide();
    if (typeof Downloads !== 'undefined') Downloads.add({ id: id, title: 'Downloading...' }, quality, format);
    Toast.show('Added to downloads');
  },

  loadTrending: function() {
    var self = this;
    var area = document.getElementById('trending-area');
    var html = '<div class="genre-scroll">';
    CONFIG.GENRES.forEach(function(g) { html += '<span class="genre-pill" onclick="Home.search(\'' + g + '\')">' + g + '</span>'; });
    html += '</div>';
    html += '<div class="genre-scroll" style="padding-top:0;">';
    CONFIG.PLATFORMS.forEach(function(p) { html += '<span class="genre-pill" onclick="Home.search(\'' + p.id + '\')" style="display:flex;align-items:center;gap:6px;">' + p.svg + ' ' + p.name + '</span>'; });
    html += '</div>';
    html += '<div id="trending-content"><div class="video-grid">' + Array(4).fill('<div class="skeleton" style="aspect-ratio:16/9;"></div>').join('') + '</div></div>';
    area.innerHTML = html;
    API.search('trending music', 8).then(function(videos) {
      var grid = document.getElementById('trending-content');
      if (grid && videos.length > 0) {
        grid.innerHTML = '<div class="section-head"><h2>Trending Now</h2></div><div class="video-grid">' + videos.map(function(s) { return self.resultCard(s); }).join('') + '</div>';
      }
    });
    API.trendingChannels().then(function(channels) {
      var grid = document.getElementById('trending-content');
      if (grid && channels.length > 0) {
        var chanHtml = '<div class="section-head"><h2>Channels</h2></div><div class="video-grid">';
        channels.forEach(function(c) {
          chanHtml += '<div class="video-card" onclick="window.open(\'https://youtube.com/channel/' + c.id + '\',\'_blank\')" style="text-align:center;padding:16px;"><img src="' + (c.thumbnail||'') + '" style="width:56px;height:56px;border-radius:50%;margin:0 auto 8px;display:block;" onerror="this.style.display=\'none\'"><div class="card-title">' + Helpers.escape(c.title) + '</div><div class="card-meta" style="text-align:center;">' + Helpers.formatNumber(c.subscribers) + ' subs</div></div>';
        });
        chanHtml += '</div>'; grid.innerHTML += chanHtml;
      }
    });
  },
};
