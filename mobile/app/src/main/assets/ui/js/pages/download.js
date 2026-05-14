const DownloadPage = (function () {
  'use strict';
  let searchInput, downloadContent, searchTimeout;
  let currentQuery = '';
  let currentPage = 1;
  let isLoading = false;
  let hasMore = true;
  let selectedFormat = 'm4a-128';
  let activePlatform = 'all';

  const morePlatforms = [
    { id: 'youtube', name: 'YouTube', icon: '▶', status: 'active' },
    { id: 'whatsapp', name: 'WhatsApp Status', icon: '📱', status: 'how-to' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', status: 'how-to' },
    { id: 'instagram', name: 'Instagram', icon: '📷', status: 'how-to' },
    { id: 'facebook', name: 'Facebook', icon: '📘', status: 'how-to' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', status: 'how-to' },
    { id: 'spotify', name: 'Spotify', icon: '🟢', status: 'active' },
    { id: 'snapchat', name: 'SnapChat', icon: '👻', status: 'how-to' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', status: 'how-to' },
    { id: 'kwai', name: 'Kwai', icon: '🎬', status: 'how-to' },
    { id: 'threads', name: 'Threads', icon: '🧵', status: 'how-to' },
    { id: 'dailymotion', name: 'DailyMotion', icon: '📺', status: 'how-to' },
    { id: 'soundcloud', name: 'SoundCloud', icon: '🎧', status: 'how-to' },
    { id: 'bluesky', name: 'BlueSky', icon: '🦋', status: 'how-to' },
    { id: 'okru', name: 'OkRu', icon: '📺', status: 'how-to' },
  ];

  const musicFormats = [
    { id: 'm4a-128', name: 'Fast', desc: 'M4A (128K), best for mobile play', size: '3.5 MB', tag: '' },
    { id: 'mp3-70', name: 'Classic MP3 (70K)', desc: 'Support Bluetooth speaker, mobile phone, car, watch etc.', size: '1.5 MB', tag: 'Low' },
    { id: 'mp3-128', name: 'Classic MP3 (128K)', desc: 'Support Bluetooth speaker, mobile phone, car, watch etc.', size: '3.5 MB', tag: '' },
    { id: 'mp3-160', name: 'Classic MP3', desc: 'MP3 (160K), support Bluetooth speaker, mobile phone, car, watch etc.', size: '3.9 MB', tag: '' },
    { id: 'mp3-320', name: 'Classic MP3 (320K)', desc: 'Support Bluetooth speaker, mobile phone, car, watch etc.', size: '7.8 MB', tag: 'Slow' },
  ];

  const videoFormats = [
    { id: '144p', name: 'Fast (144p)', desc: 'Low', detail: 'Poor video quality', size: '' },
    { id: '240p', name: 'Fast (240p)', desc: 'Low quality for quick play', detail: '', size: '' },
    { id: '360p', name: 'Fast (360p)', desc: 'Normal quality for quick play', detail: '', size: '' },
    { id: '480p', name: 'Fast (480p)', desc: 'Normal quality for quick play', detail: '', size: '14.8 MB' },
    { id: '720p', name: 'High quality (720p)', desc: 'Clear view and quick play', detail: '', size: '23.2 MB' },
    { id: '1080p', name: 'High quality (1080p)', desc: 'High details for full screen play', detail: '', size: '45 MB' },
  ];

  const genres = ['Gospel', 'Dancehall', 'Afrobeat', 'Hip Hop', 'Reggae', 'Bongo Flava', 'Zouk', 'R&B', 'Amapiano', 'Singeli'];
  const topArtists = [
    { name: 'Eddy Kenzo', songs: 24, avatar: '🎤' },
    { name: 'Sheebah', songs: 18, avatar: '🎵' },
    { name: 'John Blaq', songs: 15, avatar: '🎧' },
    { name: 'Vinka', songs: 12, avatar: '🎶' },
    { name: 'Spice Diana', songs: 20, avatar: '🎼' },
    { name: 'David Lutalo', songs: 16, avatar: '🎹' },
  ];
  const topSongs = [
    { rank: 1, title: 'Tweyagale', artist: 'Eddy Kenzo', duration: '3:35', plays: '4.7M' },
    { rank: 2, title: 'Chips Na Ketchup', artist: 'Vinka', duration: '3:14', plays: '3.2M' },
    { rank: 3, title: 'Beera Nange', artist: 'Sheebah', duration: '2:53', plays: '2.8M' },
    { rank: 4, title: 'Sunday', artist: 'Eddy Kenzo ft Martha Mukisa', duration: '3:45', plays: '2.5M' },
    { rank: 5, title: 'Semyekozo', artist: 'Eddy Kenzo', duration: '4:12', plays: '2.1M' },
    { rank: 6, title: 'Jambole', artist: 'John Blaq', duration: '3:05', plays: '1.9M' },
    { rank: 7, title: 'Eroina', artist: 'Alan Walker & Sorana', duration: '3:28', plays: '1.8M' },
    { rank: 8, title: 'Weekend', artist: 'Sheebah ft Runtown', duration: '3:52', plays: '1.6M' },
  ];

  function init() {
    searchInput = document.getElementById('search-input');
    downloadContent = document.getElementById('download-content');
    if (!searchInput || !downloadContent) return;
    searchInput.addEventListener('input', handleInput);
    searchInput.addEventListener('keydown', handleKeydown);
    document.getElementById('btn-voice')?.addEventListener('click', handleVoice);
    setupPlatformTabs();
    showTrending();
    checkClipboard();
  }

  function setupPlatformTabs() {
    document.querySelectorAll('.tab-chip').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.tab-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const tabText = this.textContent.toLowerCase();
        if (tabText === 'more') { showMorePlatforms(); return; }
        if (tabText === 'sub') { showSubTab(); return; }
        if (tabText === 'music') { activePlatform = 'music'; showMusicPage(); return; }
        activePlatform = tabText === 'all' ? 'all' : tabText === 'youtube' ? 'youtube' : 'all';
        if (currentQuery) search(currentQuery); else showTrending();
      });
    });
  }

  function showMusicPage() {
    let html = '<div class="music-page">';
    html += '<div class="music-hero"><h2>Discover Music</h2><p>Download free music from YouTube, Spotify, TikTok & more</p></div>';
    html += '<div class="genre-chips">';
    genres.forEach(g => { html += '<button class="genre-chip">' + g + '</button>'; });
    html += '</div>';
    html += '<div class="music-section-title">Top Artists</div>';
    html += '<div class="artist-grid">';
    topArtists.forEach(a => {
      html += '<div class="artist-card"><div class="artist-avatar">' + a.avatar + '</div><div class="artist-name">' + a.name + '</div><div class="artist-songs">' + a.songs + ' songs</div></div>';
    });
    html += '</div>';
    html += '<div class="music-section-title">Top Songs in Uganda<span class="see-all">See All</span></div>';
    html += '<div class="top-songs-list">';
    topSongs.forEach(s => {
      html += '<div class="top-song-item">';
      html += '<span class="song-rank' + (s.rank <= 3 ? ' top3' : '') + '">' + s.rank + '</span>';
      html += '<div class="song-info"><div class="song-title">' + s.title + '</div><div class="song-artist">' + s.artist + ' · ' + s.plays + ' plays</div></div>';
      html += '<span class="song-duration">' + s.duration + '</span>';
      html += '<button class="song-download-btn">⬇</button>';
      html += '</div>';
    });
    html += '</div></div>';
    downloadContent.innerHTML = html;
    document.querySelectorAll('.genre-chip').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        searchInput.value = this.textContent + ' music';
        search(searchInput.value);
      });
    });
    document.querySelectorAll('.song-download-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const songItem = this.closest('.top-song-item');
        const title = songItem.querySelector('.song-title').textContent;
        showDownloadSheet('song_' + Date.now(), title, '', true);
      });
    });
  }

  function showMorePlatforms() {
    let html = '<div class="more-platforms">';
    morePlatforms.forEach(p => {
      html += '<div class="more-platform-item">';
      html += '<span class="platform-icon">' + p.icon + '</span>';
      html += '<div class="platform-info">';
      html += '<span class="platform-name">' + p.name + '</span>';
      html += '<span class="platform-status">' + (p.status === 'active' ? 'Active' : 'How to start') + '</span>';
      html += '</div>';
      html += '<span class="item-chevron">›</span>';
      html += '</div>';
    });
    html += '</div>';
    downloadContent.innerHTML = html;
  }

  function showSubTab() {
    const isSignedIn = false;
    if (!isSignedIn) {
      downloadContent.innerHTML = '<div class="sub-signin"><div class="sub-signin-icon">📺</div><p class="sub-signin-text">Your sign-in has expired, please sign in again to continue.</p><p class="sub-signin-sub">Sign in to see videos from your YouTube subscriptions</p><button class="btn btn-primary btn-lg" id="btn-sub-signin">Sign in</button></div>';
      document.getElementById('btn-sub-signin')?.addEventListener('click', function () {
        this.textContent = 'Signing in...';
        setTimeout(() => { showSubSignedIn(); }, 1500);
      });
    } else { showSubSignedIn(); }
  }

  function showSubSignedIn() {
    let html = '<div>';
    const subVideos = [
      { channel: 'Firstpost', title: 'JPMorgan Controversy LIVE | JPMorgan Offered $1 Mn Deal to Banker Alleging...', watching: 28, live: true },
      { channel: 'Firstpost', title: 'WHY TRUMP MOVED CLOSER TO PAK? US CONGRESSMAN LIVE: Marc Veasey Urges Trump', watching: 16, live: true },
      { channel: 'Eddy Kenzo', title: 'Tweyagale Official Music Video 2026', watching: 0, live: false },
      { channel: 'NBS Television', title: 'Morning Breeze Live: Today Top Stories', watching: 120, live: true },
    ];
    subVideos.forEach(v => {
      html += '<div class="sub-video-card">';
      html += '<div class="sub-channel-avatar">📺</div>';
      html += '<div class="sub-video-info">';
      html += '<div class="sub-channel-name">' + v.channel + '</div>';
      html += '<div class="sub-video-title">' + v.title + '</div>';
      if (v.live) html += '<span class="sub-live-badge"><span class="sub-live-dot"></span>' + v.watching + ' watching</span>';
      else html += '<span style="font-size:10px;color:var(--color-text-secondary);">2 days ago</span>';
      html += '</div></div>';
    });
    html += '</div>';
    downloadContent.innerHTML = html;
  }

  function handleInput() {
    const query = searchInput.value.trim();
    if (searchTimeout) clearTimeout(searchTimeout);
    if (query.length >= 2) {
      searchTimeout = setTimeout(() => {
        if (isYouTubeUrl(query)) extractFromUrl(query);
        else if (isSpotifyUrl(query)) extractSpotify(query);
      }, 300);
    }
    if (query.length === 0 && activePlatform === 'music') showMusicPage();
    else if (query.length === 0) showTrending();
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (!query) return;
      if (isYouTubeUrl(query)) extractFromUrl(query);
      else if (isSpotifyUrl(query)) extractSpotify(query);
      else if (activePlatform === 'music') { searchInput.value = query; search(query); }
      else search(query);
    }
  }

  function isYouTubeUrl(text) { return text.includes('youtube.com') || text.includes('youtu.be'); }
  function isSpotifyUrl(text) { return text.includes('spotify.com') || text.includes('open.spotify'); }

  function extractSpotify(url) {
    let trackName = 'Spotify Track';
    const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) trackName = 'Spotify Track ' + trackMatch[1].substring(0, 6);
    const toast = document.createElement('div'); toast.className = 'clipboard-toast';
    toast.textContent = 'Spotify detected - searching YouTube: ' + trackName;
    document.body.appendChild(toast); setTimeout(() => toast.remove(), 3000);
    search(trackName);
  }

  function extractFromUrl(url) {
    const videoId = extractVideoId(url);
    if (videoId) { searchInput.value = ''; showDownloadSheet(videoId, 'Video from URL', 'Unknown Channel'); }
  }

  function extractVideoId(url) {
    const patterns = [/youtu\.be\/([a-zA-Z0-9_-]{11})/,/[?&]v=([a-zA-Z0-9_-]{11})/,/\/embed\/([a-zA-Z0-9_-]{11})/,/\/shorts\/([a-zA-Z0-9_-]{11})/];
    for (const p of patterns) { const match = url.match(p); if (match) return match[1]; }
    return null;
  }

  async function search(query) {
    currentQuery = query; currentPage = 1; hasMore = true; showSkeletons();
    try { const results = await mockSearch(query); renderResults(results, true); saveSearchHistory(query); }
    catch (e) { showNoResults(query); }
  }

  async function loadMore() {
    if (isLoading || !hasMore) return; isLoading = true; currentPage++;
    try { const results = await mockSearch(currentQuery, currentPage); if (results.length === 0) hasMore = false; else appendResults(results); }
    catch (e) { hasMore = false; }
    isLoading = false;
  }

  function mockSearch(query, page = 1) {
    return new Promise(resolve => { setTimeout(() => {
      const allVideos = [];
      for (let i = 0; i < 50; i++) { allVideos.push({ id: 'vid' + i + '_' + page, title: query + ' - Result ' + ((page - 1) * 20 + i + 1), channel: 'Channel ' + (i % 5 + 1), views: Math.floor(Math.random() * 5000000), duration: Math.floor(Math.random() * 600) + 30, uploadDate: '2026-05-' + String(Math.floor(Math.random() * 30) + 1).padStart(2, '0'), isMusic: activePlatform === 'music' }); }
      const start = (page - 1) * 20; resolve(allVideos.slice(start, start + 20));
    }, 800); });
  }

  function showSkeletons() {
    let html = '';
    for (let i = 0; i < 6; i++) { html += '<div class="skeleton-card"><div class="skeleton-thumb"></div><div class="skeleton-info"><div class="skeleton-line"></div><div class="skeleton-line short"></div><div class="skeleton-line short"></div></div></div>'; }
    downloadContent.innerHTML = html;
  }

  function renderResults(videos, clear = false) {
    if (clear) downloadContent.innerHTML = '';
    if (videos.length === 0 && clear) { showNoResults(currentQuery); return; }
    let html = '<div class="search-results">';
    videos.forEach(v => {
      const views = v.views >= 1000000 ? (v.views / 1000000).toFixed(1) + 'M' : v.views >= 1000 ? (v.views / 1000).toFixed(1) + 'K' : v.views;
      const dur = formatDuration(v.duration); const icon = v.isMusic ? 'Music' : '▶';
      html += '<div class="video-card"><div class="thumb-wrap"><div style="background:#333;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;">' + icon + '</div><span class="duration">' + dur + '</span></div><div class="video-info"><div class="video-title">' + escapeHtml(v.title) + '</div><div class="video-meta">' + escapeHtml(v.channel) + ' · ' + views + ' views</div></div><button class="download-arrow" data-id="' + v.id + '" data-title="' + escapeHtml(v.title) + '" data-channel="' + escapeHtml(v.channel) + '" data-music="' + (v.isMusic ? '1' : '0') + '">⬇</button></div>';
    });
    html += '</div>';
    if (hasMore && videos.length >= 20) { html += '<div class="load-more" id="load-more"><button class="btn btn-primary btn-sm">Load More</button></div>'; }
    if (clear) { downloadContent.innerHTML = html; }
    else { const loadMoreEl = document.getElementById('load-more'); if (loadMoreEl) loadMoreEl.remove(); downloadContent.insertAdjacentHTML('beforeend', html); }
    bindDownloadArrows();
    const loadBtn = document.getElementById('load-more'); if (loadBtn) loadBtn.addEventListener('click', loadMore);
    setupInfiniteScroll();
  }

  function appendResults(videos) {
    let html = '';
    videos.forEach(v => {
      const views = v.views >= 1000000 ? (v.views / 1000000).toFixed(1) + 'M' : v.views >= 1000 ? (v.views / 1000).toFixed(1) + 'K' : v.views;
      const dur = formatDuration(v.duration); const icon = v.isMusic ? 'Music' : '▶';
      html += '<div class="video-card"><div class="thumb-wrap"><div style="background:#333;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;">' + icon + '</div><span class="duration">' + dur + '</span></div><div class="video-info"><div class="video-title">' + escapeHtml(v.title) + '</div><div class="video-meta">' + escapeHtml(v.channel) + ' · ' + views + ' views</div></div><button class="download-arrow" data-id="' + v.id + '" data-title="' + escapeHtml(v.title) + '" data-channel="' + escapeHtml(v.channel) + '" data-music="' + (v.isMusic ? '1' : '0') + '">⬇</button></div>';
    });
    const loadMoreEl = document.getElementById('load-more'); if (loadMoreEl) loadMoreEl.remove();
    downloadContent.insertAdjacentHTML('beforeend', html);
    if (hasMore && videos.length >= 20) { const newLoadMore = document.createElement('div'); newLoadMore.className = 'load-more'; newLoadMore.id = 'load-more'; newLoadMore.innerHTML = '<button class="btn btn-primary btn-sm">Load More</button>'; downloadContent.appendChild(newLoadMore); newLoadMore.addEventListener('click', loadMore); }
    bindDownloadArrows();
  }

  function bindDownloadArrows() {
    document.querySelectorAll('.download-arrow').forEach(btn => { btn.addEventListener('click', function (e) { e.stopPropagation(); const id = this.dataset.id; const title = this.dataset.title; const channel = this.dataset.channel; const isMusic = this.dataset.music === '1'; showDownloadSheet(id, title, channel, isMusic); }); });
  }

  function setupInfiniteScroll() {
    const mainContent = document.getElementById('main-content'); if (!mainContent) return;
    mainContent.onscroll = function () { if (isLoading || !hasMore) return; const st = mainContent.scrollTop, sh = mainContent.scrollHeight, ch = mainContent.clientHeight; if (sh - st - ch < 200) loadMore(); };
  }

  function showDownloadSheet(videoId, title, channel, isMusic = false) {
    const overlay = document.getElementById('download-sheet-overlay'), sheet = document.getElementById('download-sheet'), body = document.getElementById('download-sheet-body');
    if (!overlay || !sheet || !body) return; selectedFormat = isMusic ? 'm4a-128' : '720p'; body.innerHTML = '';
    body.innerHTML += '<div class="sheet-title">Download video as</div>';
    if (isMusic) { body.innerHTML += '<div class="format-section"><div class="format-section-label">Music</div>'; musicFormats.slice(0, 3).forEach((f, i) => { body.innerHTML += '<div class="format-option' + (i === 0 ? ' selected' : '') + '" data-format="' + f.id + '"><div class="radio-circle"></div><div class="format-info"><div class="format-name">' + f.name + (f.tag ? ' <span style="color:var(--color-warning);font-size:10px;">' + f.tag + '</span>' : '') + '</div><div class="format-size">' + f.size + '</div></div></div>'; }); }
    else { body.innerHTML += '<div class="format-section"><div class="format-section-label">Music</div>'; body.innerHTML += '<div class="format-option selected" data-format="m4a-128"><div class="radio-circle"></div><div class="format-info"><div class="format-name">Fast</div><div class="format-size">2.7 MB</div></div></div>'; body.innerHTML += '<div class="format-option" data-format="mp3-128"><div class="radio-circle"></div><div class="format-info"><div class="format-name">Classic MP3</div><div class="format-size">2.7 MB</div></div></div>'; }
    body.innerHTML += '</div><div class="format-section"><div class="format-section-label">Video</div>';
    videoFormats.slice(3, 5).forEach(f => { body.innerHTML += '<div class="format-option' + (!isMusic && f.id === '720p' ? ' selected' : '') + '" data-format="' + f.id + '"><div class="radio-circle"></div><div class="format-info"><div class="format-name">' + f.name + '</div><div class="format-size">' + f.size + '</div></div></div>'; });
    body.innerHTML += '<div class="format-option" style="justify-content:center;color:var(--color-primary);" data-format="more"><span>More formats</span></div></div>';
    body.innerHTML += '<button class="btn btn-primary btn-block btn-lg" id="btn-download-now">Download</button>';
    overlay.classList.add('active'); sheet.classList.add('active');
    document.querySelectorAll('.format-option').forEach(opt => { opt.addEventListener('click', function () { if (this.dataset.format === 'more') { showFullFormatSheet(videoId, title, channel); return; } document.querySelectorAll('.format-option').forEach(o => o.classList.remove('selected')); this.classList.add('selected'); selectedFormat = this.dataset.format; }); });
    document.getElementById('btn-download-now').addEventListener('click', function () { startDownload(videoId, title, selectedFormat); overlay.classList.remove('active'); sheet.classList.remove('active'); });
    overlay.onclick = function () { overlay.classList.remove('active'); sheet.classList.remove('active'); };
  }

  function showFullFormatSheet(videoId, title, channel) {
    const body = document.getElementById('download-sheet-body'); body.innerHTML = '';
    body.innerHTML += '<div class="sheet-title">More formats</div><div class="format-section"><div class="format-section-label">Music</div>';
    musicFormats.forEach((f, i) => { body.innerHTML += '<div class="format-option' + (i === 0 ? ' selected' : '') + '" data-format="' + f.id + '"><div class="radio-circle"></div><div class="format-info"><div class="format-name">' + f.name + (f.tag ? ' <span style="color:var(--color-warning);font-size:10px;">' + f.tag + '</span>' : '') + '</div><div class="format-size">' + f.desc + '</div><div class="format-size" style="margin-top:2px;">' + f.size + '</div></div></div>'; });
    body.innerHTML += '</div><div class="format-section"><div class="format-section-label">Video</div>';
    videoFormats.forEach(f => { body.innerHTML += '<div class="format-option" data-format="' + f.id + '"><div class="radio-circle"></div><div class="format-info"><div class="format-name">' + f.name + '</div><div class="format-size">' + f.desc + (f.detail ? ', ' + f.detail : '') + '</div>' + (f.size ? '<div class="format-size" style="margin-top:2px;">' + f.size + '</div>' : '') + '</div></div>'; });
    body.innerHTML += '</div><div class="format-section"><div class="format-section-label">Subtitles/CC</div>';
    body.innerHTML += '<div class="format-option" data-format="subtitles"><div class="radio-circle"></div><div class="format-info"><div class="format-name">Download Subtitles</div><div class="format-size">Include available subtitles (SRT)</div></div></div></div>';
    body.innerHTML += '<button class="btn btn-primary btn-block btn-lg" id="btn-download-now">Download</button>';
    document.querySelectorAll('.format-option').forEach(opt => { opt.addEventListener('click', function () { document.querySelectorAll('.format-option').forEach(o => o.classList.remove('selected')); this.classList.add('selected'); selectedFormat = this.dataset.format; }); });
    document.getElementById('btn-download-now').addEventListener('click', function () { startDownload(videoId, title, selectedFormat); document.getElementById('download-sheet-overlay').classList.remove('active'); document.getElementById('download-sheet').classList.remove('active'); });
  }

  function startDownload(videoId, title, format) {
    const formatNames = { 'm4a-128': 'Fast M4A', 'mp3-70': 'MP3 70K', 'mp3-128': 'MP3 128K', 'mp3-160': 'MP3 160K', 'mp3-320': 'MP3 320K', '144p': '144p', '240p': '240p', '360p': '360p', '480p': '480p', '720p': '720p', '1080p': '1080p' };
    const formatName = formatNames[format] || format;
    const toast = document.createElement('div'); toast.className = 'clipboard-toast'; toast.textContent = 'Downloading: ' + title.substring(0, 35) + '... (' + formatName + ')';
    document.body.appendChild(toast); setTimeout(() => toast.remove(), 2500);
    addToPlayTab(videoId, title, formatName);
  }

  function addToPlayTab(videoId, title, format) {
    let downloads = []; try { downloads = JSON.parse(localStorage.getItem('mv_downloads') || '[]'); } catch (e) {}
    downloads.unshift({ id: videoId, title: title, format: format, progress: 0, status: 'downloading', time: new Date().toISOString() });
    localStorage.setItem('mv_downloads', JSON.stringify(downloads));
  }

  function showNoResults(query) { downloadContent.innerHTML = '<div class="no-results"><div class="no-results-icon">Search</div><div class="no-results-title">No results found</div><p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);">Try different keywords for "' + escapeHtml(query) + '"</p></div>'; }

  function showTrending() {
    downloadContent.innerHTML = '<div class="trending-section"><div class="trending-title">Trending in Uganda</div><div class="trending-scroll">';
    const trendingItems = [{ title: 'Tweyagale', artist: 'Eddy Kenzo' },{ title: 'Chips Na Ketchup', artist: 'Vinka' },{ title: 'Beera Nange', artist: 'Sheebah' },{ title: 'Sunday', artist: 'Eddy Kenzo ft Martha' },{ title: 'Semyekozo', artist: 'Eddy Kenzo' },{ title: 'Jambole', artist: 'John Blaq' },{ title: 'Eroina', artist: 'Alan Walker' },{ title: 'Weekend', artist: 'Sheebah ft Runtown' }];
    trendingItems.forEach(t => { downloadContent.innerHTML += '<div class="trending-card" data-query="' + escapeHtml(t.title + ' ' + t.artist) + '"><div class="trending-thumb"><div style="background:#333;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">Music</div></div><div class="trending-name">' + escapeHtml(t.title) + '</div><div class="trending-meta">' + escapeHtml(t.artist) + '</div></div>'; });
    downloadContent.innerHTML += '</div></div>';
    document.querySelectorAll('.trending-card').forEach(card => { card.addEventListener('click', function () { const q = this.dataset.query; searchInput.value = q; search(q); }); });
    showRecentSearches();
  }

  function showRecentSearches() {
    const history = getSearchHistory(); if (history.length === 0) return;
    let html = '<div class="recent-searches"><div class="recent-title">Recent Searches</div>';
    history.slice(0, 5).forEach(q => { html += '<div class="recent-item" data-query="' + escapeHtml(q) + '"><span class="recent-clock">History</span><span>' + escapeHtml(q) + '</span></div>'; });
    html += '</div>'; downloadContent.innerHTML += html;
    document.querySelectorAll('.recent-item').forEach(item => { item.addEventListener('click', function () { const q = this.dataset.query; searchInput.value = q; search(q); }); });
  }

  function saveSearchHistory(query) { let history = getSearchHistory(); history = history.filter(q => q.toLowerCase() !== query.toLowerCase()); history.unshift(query); if (history.length > CONFIG.MAX_SEARCH_HISTORY) history.pop(); localStorage.setItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history)); }
  function getSearchHistory() { try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY)) || []; } catch (e) { return []; } }

  function handleVoice() { const btn = document.getElementById('btn-voice'); btn.classList.add('listening'); setTimeout(() => { btn.classList.remove('listening'); searchInput.value = 'Voice search demo'; search('Voice search demo'); }, 2000); }

  function checkClipboard() { setTimeout(() => { const toast = document.createElement('div'); toast.className = 'clipboard-toast'; toast.textContent = 'YouTube link detected - tap to download'; document.body.appendChild(toast); setTimeout(() => toast.remove(), 3000); }, 1500); }

  function formatDuration(seconds) { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return mins + ':' + String(secs).padStart(2, '0'); }
  function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

  window.DownloadPage = { init, search };
  return { init, search };
})();
document.addEventListener('DOMContentLoaded', function () { DownloadPage.init(); });
