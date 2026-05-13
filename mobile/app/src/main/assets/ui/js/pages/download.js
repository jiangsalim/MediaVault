const DownloadPage = (function () {
  'use strict';
  let searchInput, downloadContent, searchTimeout;
  let currentQuery = '';
  let currentPage = 1;
  let isLoading = false;
  let hasMore = true;

  function init() {
    searchInput = document.getElementById('search-input');
    downloadContent = document.getElementById('download-content');
    if (!searchInput || !downloadContent) return;
    searchInput.addEventListener('input', handleInput);
    searchInput.addEventListener('keydown', handleKeydown);
    document.getElementById('btn-voice')?.addEventListener('click', handleVoice);
    document.querySelectorAll('.tab-chip').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.tab-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        if (currentQuery) search(currentQuery);
      });
    });
    document.querySelectorAll('.tab-chip').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.tab-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      });
    });
    showTrending();
    checkClipboard();
  }

  function handleInput() {
    const query = searchInput.value.trim();
    if (searchTimeout) clearTimeout(searchTimeout);
    if (query.length >= 2) {
      searchTimeout = setTimeout(() => {
        if (isYouTubeUrl(query)) {
          extractFromUrl(query);
        }
      }, 300);
    }
    if (query.length === 0) {
      showTrending();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (!query) return;
      if (isYouTubeUrl(query)) {
        extractFromUrl(query);
      } else {
        search(query);
      }
    }
  }

  function isYouTubeUrl(text) {
    return text.includes('youtube.com') || text.includes('youtu.be');
  }

  function extractFromUrl(url) {
    const videoId = extractVideoId(url);
    if (videoId) {
      showDownloadSheet(videoId, 'Sample Video from URL', 'Unknown Channel');
    }
  }

  function extractVideoId(url) {
    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /[?&]v=([a-zA-Z0-9_-]{11})/,
      /\/embed\/([a-zA-Z0-9_-]{11})/,
      /\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const match = url.match(p);
      if (match) return match[1];
    }
    return null;
  }

  async function search(query) {
    currentQuery = query;
    currentPage = 1;
    hasMore = true;
    showSkeletons();
    try {
      const results = await mockSearch(query);
      renderResults(results, true);
      saveSearchHistory(query);
    } catch (e) {
      showNoResults(query);
    }
  }

  async function loadMore() {
    if (isLoading || !hasMore) return;
    isLoading = true;
    currentPage++;
    try {
      const results = await mockSearch(currentQuery, currentPage);
      if (results.length === 0) { hasMore = false; }
      else { appendResults(results); }
    } catch (e) { hasMore = false; }
    isLoading = false;
  }

  function mockSearch(query, page = 1) {
    return new Promise(resolve => {
      setTimeout(() => {
        const allVideos = [];
        for (let i = 0; i < 30; i++) {
          allVideos.push({
            id: 'vid' + i + '_' + page,
            title: query + ' - Result ' + ((page - 1) * 20 + i + 1),
            channel: 'Channel ' + (i % 5 + 1),
            views: Math.floor(Math.random() * 5000000),
            duration: Math.floor(Math.random() * 600) + 30,
            uploadDate: '2026-05-' + String(Math.floor(Math.random() * 30) + 1).padStart(2, '0'),
            thumbnail: '',
          });
        }
        const start = (page - 1) * 20;
        resolve(allVideos.slice(start, start + 20));
      }, 800);
    });
  }

  function showSkeletons() {
    let html = '';
    for (let i = 0; i < 6; i++) {
      html += '<div class="skeleton-card"><div class="skeleton-thumb"></div><div class="skeleton-info"><div class="skeleton-line"></div><div class="skeleton-line short"></div><div class="skeleton-line short"></div></div></div>';
    }
    downloadContent.innerHTML = html;
  }

  function renderResults(videos, clear = false) {
    if (clear) downloadContent.innerHTML = '';
    if (videos.length === 0 && clear) {
      showNoResults(currentQuery);
      return;
    }
    let html = '<div class="search-results">';
    videos.forEach(v => {
      const views = v.views >= 1000000 ? (v.views / 1000000).toFixed(1) + 'M' : v.views >= 1000 ? (v.views / 1000).toFixed(1) + 'K' : v.views;
      const dur = formatDuration(v.duration);
      html += '<div class="video-card">';
      html += '<div class="thumb-wrap"><div style="background:#333;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;">▶</div><span class="duration">' + dur + '</span></div>';
      html += '<div class="video-info">';
      html += '<div class="video-title">' + escapeHtml(v.title) + '</div>';
      html += '<div class="video-meta">' + escapeHtml(v.channel) + ' · ' + views + ' views</div>';
      html += '</div>';
      html += '<button class="download-arrow" data-id="' + v.id + '" data-title="' + escapeHtml(v.title) + '" data-channel="' + escapeHtml(v.channel) + '">⬇</button>';
      html += '</div>';
    });
    html += '</div>';
    if (hasMore && videos.length >= 20) {
      html += '<div class="load-more" id="load-more"><button class="btn btn-primary btn-sm">Load More</button></div>';
    }
    if (clear) {
      downloadContent.innerHTML = html;
    } else {
      const loadMoreEl = document.getElementById('load-more');
      if (loadMoreEl) loadMoreEl.remove();
      downloadContent.insertAdjacentHTML('beforeend', html);
    }
    bindDownloadArrows();
    const loadBtn = document.getElementById('load-more');
    if (loadBtn) loadBtn.addEventListener('click', loadMore);
    setupInfiniteScroll();
  }

  function appendResults(videos) {
    let html = '';
    videos.forEach(v => {
      const views = v.views >= 1000000 ? (v.views / 1000000).toFixed(1) + 'M' : v.views >= 1000 ? (v.views / 1000).toFixed(1) + 'K' : v.views;
      const dur = formatDuration(v.duration);
      html += '<div class="video-card">';
      html += '<div class="thumb-wrap"><div style="background:#333;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;">▶</div><span class="duration">' + dur + '</span></div>';
      html += '<div class="video-info">';
      html += '<div class="video-title">' + escapeHtml(v.title) + '</div>';
      html += '<div class="video-meta">' + escapeHtml(v.channel) + ' · ' + views + ' views</div>';
      html += '</div>';
      html += '<button class="download-arrow" data-id="' + v.id + '" data-title="' + escapeHtml(v.title) + '" data-channel="' + escapeHtml(v.channel) + '">⬇</button>';
      html += '</div>';
    });
    const loadMoreEl = document.getElementById('load-more');
    if (loadMoreEl) loadMoreEl.remove();
    downloadContent.insertAdjacentHTML('beforeend', html);
    if (hasMore && videos.length >= 20) {
      const newLoadMore = document.createElement('div');
      newLoadMore.className = 'load-more';
      newLoadMore.id = 'load-more';
      newLoadMore.innerHTML = '<button class="btn btn-primary btn-sm">Load More</button>';
      downloadContent.appendChild(newLoadMore);
      newLoadMore.addEventListener('click', loadMore);
    }
    bindDownloadArrows();
  }

  function bindDownloadArrows() {
    document.querySelectorAll('.download-arrow').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const id = this.dataset.id;
        const title = this.dataset.title;
        const channel = this.dataset.channel;
        showDownloadSheet(id, title, channel);
      });
    });
  }

  function setupInfiniteScroll() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.onscroll = function () {
      if (isLoading || !hasMore) return;
      const scrollTop = mainContent.scrollTop;
      const scrollHeight = mainContent.scrollHeight;
      const clientHeight = mainContent.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        loadMore();
      }
    };
  }

  function showDownloadSheet(videoId, title, channel) {
    const overlay = document.getElementById('download-sheet-overlay');
    const sheet = document.getElementById('download-sheet');
    const body = document.getElementById('download-sheet-body');
    if (!overlay || !sheet || !body) return;
    body.innerHTML = '';
    body.innerHTML += '<div class="sheet-title">Download video as</div>';
    body.innerHTML += '<div class="format-section"><div class="format-section-label">🎵 Music</div>';
    body.innerHTML += '<div class="format-option selected" data-format="m4a-128"><div class="radio-circle"></div><div class="format-info"><div class="format-name">Fast</div><div class="format-size">2.7 MB</div></div></div>';
    body.innerHTML += '<div class="format-option" data-format="mp3-128"><div class="radio-circle"></div><div class="format-info"><div class="format-name">Classic MP3</div><div class="format-size">2.7 MB</div></div></div>';
    body.innerHTML += '</div>';
    body.innerHTML += '<div class="format-section"><div class="format-section-label">🎬 Video</div>';
    body.innerHTML += '<div class="format-option" data-format="480p"><div class="radio-circle"></div><div class="format-info"><div class="format-name">Fast (480p)</div><div class="format-size">14.8 MB</div></div></div>';
    body.innerHTML += '<div class="format-option" data-format="720p"><div class="radio-circle"></div><div class="format-info"><div class="format-name">High quality (720p)</div><div class="format-size">23.2 MB</div></div></div>';
    body.innerHTML += '<div class="format-option" style="justify-content:center;color:var(--color-primary);" data-format="more"><span>More formats ›</span></div>';
    body.innerHTML += '</div>';
    body.innerHTML += '<button class="btn btn-primary btn-block btn-lg" id="btn-download-now">Download</button>';
    overlay.classList.add('active');
    sheet.classList.add('active');
    document.querySelectorAll('.format-option').forEach(opt => {
      opt.addEventListener('click', function () {
        if (this.dataset.format === 'more') {
          showFullFormatSheet(videoId, title, channel);
          return;
        }
        document.querySelectorAll('.format-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
      });
    });
    document.getElementById('btn-download-now').addEventListener('click', function () {
      const selected = document.querySelector('.format-option.selected');
      const format = selected ? selected.dataset.format : 'm4a-128';
      startDownload(videoId, title, format);
      overlay.classList.remove('active');
      sheet.classList.remove('active');
    });
    overlay.onclick = function () {
      overlay.classList.remove('active');
      sheet.classList.remove('active');
    };
  }

  function showFullFormatSheet(videoId, title, channel) {
    const body = document.getElementById('download-sheet-body');
    body.innerHTML = '';
    body.innerHTML += '<div class="sheet-title">More formats</div>';
    body.innerHTML += '<div class="format-section"><div class="format-section-label">🎵 Music</div>';
    const musicFormats = [
      { id: 'm4a-128', name: 'Fast', desc: 'M4A (128K), best for mobile play', size: '3.5 MB' },
      { id: 'mp3-70', name: 'Classic MP3 (70K) Low', desc: 'Support Bluetooth speaker, mobile phone, car, watch etc.', size: '1.5 MB' },
      { id: 'mp3-128', name: 'Classic MP3 (128K)', desc: 'Support Bluetooth speaker, mobile phone, car, watch etc.', size: '3.5 MB' },
      { id: 'mp3-160', name: 'Classic MP3 (160K)', desc: 'Support Bluetooth speaker, mobile phone, car, watch etc.', size: '3.9 MB' },
      { id: 'mp3-320', name: 'Classic MP3 (320K) Slow', desc: 'Support Bluetooth speaker, mobile phone, car, watch etc.', size: '7.8 MB' },
    ];
    musicFormats.forEach((f, i) => {
      body.innerHTML += '<div class="format-option' + (i === 0 ? ' selected' : '') + '" data-format="' + f.id + '"><div class="radio-circle"></div><div class="format-info"><div class="format-name">' + f.name + '</div><div class="format-size">' + f.desc + '</div><div class="format-size" style="margin-top:2px;">' + f.size + '</div></div></div>';
    });
    body.innerHTML += '</div>';
    body.innerHTML += '<div class="format-section"><div class="format-section-label">🎬 Video</div>';
    const videoFormats = [
      { id: '144p', name: 'Fast (144p)', desc: 'Low, Poor video quality', size: '' },
      { id: '240p', name: 'Fast (240p)', desc: 'Low quality for quick play', size: '' },
      { id: '360p', name: 'Fast (360p)', desc: 'Normal quality for quick play', size: '' },
      { id: '480p', name: 'Fast (480p)', desc: 'Normal quality for quick play', size: '14.8 MB' },
      { id: '720p', name: 'High quality (720p)', desc: 'Clear view and quick play', size: '23.2 MB' },
      { id: '1080p', name: 'High quality (1080p)', desc: 'High details for full screen play', size: '45 MB' },
    ];
    videoFormats.forEach(f => {
      body.innerHTML += '<div class="format-option" data-format="' + f.id + '"><div class="radio-circle"></div><div class="format-info"><div class="format-name">' + f.name + '</div><div class="format-size">' + f.desc + '</div>' + (f.size ? '<div class="format-size" style="margin-top:2px;">' + f.size + '</div>' : '') + '</div></div>';
    });
    body.innerHTML += '</div>';
    body.innerHTML += '<button class="btn btn-primary btn-block btn-lg" id="btn-download-now">Download</button>';
    document.querySelectorAll('.format-option').forEach(opt => {
      opt.addEventListener('click', function () {
        document.querySelectorAll('.format-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
      });
    });
    document.getElementById('btn-download-now').addEventListener('click', function () {
      const selected = document.querySelector('.format-option.selected');
      const format = selected ? selected.dataset.format : 'm4a-128';
      startDownload(videoId, title, format);
      document.getElementById('download-sheet-overlay').classList.remove('active');
      document.getElementById('download-sheet').classList.remove('active');
    });
  }

  function startDownload(videoId, title, format) {
    console.log('Download started:', title, format);
    const toast = document.createElement('div');
    toast.className = 'clipboard-toast';
    toast.textContent = '⬇ Download started: ' + title.substring(0, 30) + '...';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  function showNoResults(query) {
    downloadContent.innerHTML = '<div class="no-results"><div class="no-results-icon">🔍</div><div class="no-results-title">No results found</div><p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);">Try different keywords for "' + escapeHtml(query) + '"</p></div>';
  }

  function showTrending() {
    downloadContent.innerHTML = '';
    downloadContent.innerHTML += '<div class="trending-section"><div class="trending-title">🔥 Trending in Uganda</div><div class="trending-scroll">';
    for (let i = 1; i <= 8; i++) {
      downloadContent.innerHTML += '<div class="trending-card"><div class="trending-thumb"><div style="background:#333;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🎵</div></div><div class="trending-name">Trending Song ' + i + '</div><div class="trending-meta">Artist ' + i + '</div></div>';
    }
    downloadContent.innerHTML += '</div></div>';
    showRecentSearches();
  }

  function showRecentSearches() {
    const history = getSearchHistory();
    if (history.length === 0) return;
    downloadContent.innerHTML += '<div class="recent-searches"><div class="recent-title">Recent Searches</div>';
    history.slice(0, 5).forEach(q => {
      downloadContent.innerHTML += '<div class="recent-item" data-query="' + escapeHtml(q) + '"><span class="recent-clock">🕐</span><span>' + escapeHtml(q) + '</span></div>';
    });
    downloadContent.innerHTML += '</div>';
    document.querySelectorAll('.recent-item').forEach(item => {
      item.addEventListener('click', function () {
        const q = this.dataset.query;
        searchInput.value = q;
        search(q);
      });
    });
  }

  function saveSearchHistory(query) {
    let history = getSearchHistory();
    history = history.filter(q => q.toLowerCase() !== query.toLowerCase());
    history.unshift(query);
    if (history.length > CONFIG.MAX_SEARCH_HISTORY) history.pop();
    localStorage.setItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
  }

  function getSearchHistory() {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY)) || []; }
    catch (e) { return []; }
  }

  function handleVoice() {
    const btn = document.getElementById('btn-voice');
    btn.classList.add('listening');
    setTimeout(() => {
      btn.classList.remove('listening');
      searchInput.value = 'Voice search demo';
      search('Voice search demo');
    }, 2000);
  }

  function checkClipboard() {
    setTimeout(() => {
      const toast = document.createElement('div');
      toast.className = 'clipboard-toast';
      toast.textContent = '📋 YouTube link detected — tap to download';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }, 1500);
  }

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + String(secs).padStart(2, '0');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  return { init, search };
})();

document.addEventListener('DOMContentLoaded', function () {
  DownloadPage.init();
});
