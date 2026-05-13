const PlayPage = (function () {
  'use strict';
  let playContent, selectionMode = false, selectedItems = [];
  let currentFilter = 'all';
  let playerState = { playing: false, currentTime: 0, duration: 0, speed: 1, sleepTimer: null, sleepTimerMinutes: 0 };

  function init() {
    playContent = document.getElementById('play-content');
    if (!playContent) return;
    render();
    setInterval(refreshDownloads, 3000);
  }

  function render() {
    if (!playContent) return;
    const downloads = getDownloads();
    const activeDownloads = downloads.filter(d => d.status === 'downloading' || d.status === 'paused');
    const completedDownloads = downloads.filter(d => d.status === 'completed');

    if (activeDownloads.length === 0 && completedDownloads.length === 0) {
      playContent.innerHTML = '<div style="text-align:center;padding:60px 20px;"><div style="font-size:3rem;margin-bottom:12px;">📁</div><p style="font-size:var(--font-size-base);font-weight:600;color:var(--color-text-primary);margin-bottom:4px;">No downloads yet</p><p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);">Search for videos or music to download</p><button class="btn btn-primary btn-lg" style="margin-top:20px;" id="btn-go-download">Find Content to Download</button></div>';
      document.getElementById('btn-go-download')?.addEventListener('click', () => Router.navigate('download'));
      return;
    }

    let html = '';
    html += '<div class="streak-bar">🔥 Download Streak: <span class="streak-count">12 days</span></div>';

    if (activeDownloads.length > 0) {
      html += '<div class="play-section">';
      html += '<div class="play-section-title">Downloading <span class="count-badge">' + activeDownloads.length + '</span></div>';
      html += '<button class="continue-all-btn">Continue all</button>';
      activeDownloads.forEach(d => {
        html += '<div class="downloading-item" data-id="' + d.id + '">';
        html += '<div class="dl-icon">⬇</div>';
        html += '<div class="dl-info"><div class="dl-title">' + escapeHtml(d.title) + '</div>';
        html += '<div class="dl-status"><span class="dl-progress-text">' + (d.status === 'paused' ? 'Paused ' : '') + d.progress + '%</span></div>';
        html += '<div class="dl-progress-bar"><div class="dl-progress-fill" style="width:' + d.progress + '%;"></div></div>';
        html += '</div></div>';
      });
      html += '</div>';
    }

    if (completedDownloads.length > 0) {
      let filtered = completedDownloads;
      if (currentFilter === 'audio') filtered = completedDownloads.filter(d => d.format && (d.format.includes('MP3') || d.format.includes('M4A')));
      else if (currentFilter === 'video') filtered = completedDownloads.filter(d => d.format && !d.format.includes('MP3') && !d.format.includes('M4A'));

      html += '<div class="play-section"><div class="play-section-title">Downloaded <span class="count-badge">' + filtered.length + '</span></div>';
      html += '<div class="filter-chips">';
      html += '<button class="filter-chip' + (currentFilter === 'all' ? ' active' : '') + '" data-filter="all">All</button>';
      html += '<button class="filter-chip' + (currentFilter === 'audio' ? ' active' : '') + '" data-filter="audio">🎵 Audio</button>';
      html += '<button class="filter-chip' + (currentFilter === 'video' ? ' active' : '') + '" data-filter="video">📅 Video</button>';
      html += '</div>';

      filtered.forEach(d => {
        const isAudio = d.format && (d.format.includes('MP3') || d.format.includes('M4A'));
        const icon = isAudio ? '🎵' : '📅';
        html += '<div class="downloaded-item" data-id="' + d.id + '">';
        if (selectionMode) html += '<div class="selection-checkbox' + (selectedItems.includes(d.id) ? ' checked' : '') + '">' + (selectedItems.includes(d.id) ? '✓' : '') + '</div>';
        html += '<div class="file-icon">' + icon + '</div>';
        html += '<div class="file-info"><div class="file-title">' + escapeHtml(d.title) + '</div>';
        html += '<div class="file-meta">' + (d.duration || '') + (d.size ? ' | ' + d.size : '') + '</div></div>';
        if (!selectionMode) html += '<div class="file-size">' + (d.size || d.format || '') + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    playContent.innerHTML = html;
    if (selectionMode) addSelectionToolbar();
    bindEvents();
  }

  function bindEvents() {
    document.querySelectorAll('.downloading-item').forEach(item => {
      item.addEventListener('click', function () { showDownloadDetail(this.dataset.id); });
    });
    document.querySelectorAll('.downloaded-item').forEach(item => {
      item.addEventListener('click', function () {
        if (selectionMode) { toggleSelection(this.dataset.id); }
        else { openPlayer(this.dataset.id); }
      });
      item.addEventListener('contextmenu', function (e) { e.preventDefault(); enterSelectionMode(this.dataset.id); });
    });
    document.querySelectorAll('.continue-all-btn').forEach(btn => {
      btn.addEventListener('click', resumeAll);
    });
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', function () { currentFilter = this.dataset.filter; render(); });
    });
  }

  function openPlayer(id) {
    const downloads = getDownloads();
    const d = downloads.find(dl => dl.id === id);
    if (!d) return;
    const isAudio = d.format && (d.format.includes('MP3') || d.format.includes('M4A'));
    playerState = { playing: true, currentTime: 0, duration: d.durationSeconds || 215, speed: 1, sleepTimer: null, sleepTimerMinutes: 0 };

    if (isAudio) renderAudioPlayer(d);
    else renderVideoPlayer(d);
  }

  function renderVideoPlayer(d) {
    playContent.innerHTML = '';
    const overlay = document.createElement('div');
    overlay.className = 'player-overlay';
    overlay.innerHTML = '<div class="player-header"><button class="player-back-btn" id="btn-close-player">←</button><span class="player-title">' + escapeHtml(d.title) + '</span></div>';
    overlay.innerHTML += '<div class="player-video-area"><div class="video-placeholder">▶</div></div>';
    overlay.innerHTML += '<div class="player-controls"><div class="player-seekbar" id="player-seekbar"><div class="seek-track"><div class="seek-progress" style="width:0%;"></div><div class="seek-thumb" style="left:0%;"></div></div></div>';
    overlay.innerHTML += '<div class="player-buttons"><div class="controls-group"><span class="player-time">0:00</span></div><div class="controls-group">';
    overlay.innerHTML += '<button class="player-btn" id="btn-prev">⏮</button><button class="player-btn play-btn" id="btn-play-pause">⏸</button><button class="player-btn" id="btn-next">⏭</button>';
    overlay.innerHTML += '</div><div class="controls-group"><span class="player-time right" id="player-duration">' + formatDuration(playerState.duration) + '</span><button class="player-btn" id="btn-speed">1x</button><button class="player-btn" id="btn-sleep">⏰</button><button class="player-btn" id="btn-menu">⋮</button></div></div></div>';
    if (playerState.sleepTimerMinutes > 0) overlay.innerHTML += '<div class="sleep-timer-badge">⏰ ' + playerState.sleepTimerMinutes + ' min</div>';
    playContent.appendChild(overlay);
    document.getElementById('btn-close-player').addEventListener('click', render);
    document.getElementById('btn-play-pause').addEventListener('click', togglePlay);
    document.getElementById('btn-speed').addEventListener('click', cycleSpeed);
    document.getElementById('btn-sleep').addEventListener('click', showSleepMenu);
    document.getElementById('btn-menu').addEventListener('click', showPlayerMenu);
    setupSeekbar();
  }

  function renderAudioPlayer(d) {
    playContent.innerHTML = '';
    const overlay = document.createElement('div');
    overlay.className = 'player-overlay';
    overlay.innerHTML = '<div class="player-header"><button class="player-back-btn" id="btn-close-player">←</button><span class="player-title">' + escapeHtml(d.title) + '</span></div>';
    overlay.innerHTML += '<div class="player-audio-area"><div class="player-album-art">🎵</div><div class="player-song-title">' + escapeHtml(d.title) + '</div><div class="player-song-artist">' + (d.channel || 'Unknown Artist') + '</div></div>';
    overlay.innerHTML += '<div class="player-controls"><div class="player-seekbar" id="player-seekbar"><div class="seek-track"><div class="seek-progress" style="width:0%;"></div><div class="seek-thumb" style="left:0%;"></div></div></div>';
    overlay.innerHTML += '<div class="player-buttons"><div class="controls-group"><span class="player-time">0:00</span></div><div class="controls-group">';
    overlay.innerHTML += '<button class="player-btn" id="btn-prev">⏮</button><button class="player-btn play-btn" id="btn-play-pause">▶</button><button class="player-btn" id="btn-next">⏭</button>';
    overlay.innerHTML += '</div><div class="controls-group"><span class="player-time right" id="player-duration">' + formatDuration(playerState.duration) + '</span><button class="player-btn" id="btn-speed">1x</button><button class="player-btn" id="btn-sleep">⏰</button><button class="player-btn" id="btn-menu">⋮</button></div></div></div>';
    if (playerState.sleepTimerMinutes > 0) overlay.innerHTML += '<div class="sleep-timer-badge">⏰ ' + playerState.sleepTimerMinutes + ' min</div>';
    playContent.appendChild(overlay);
    document.getElementById('btn-close-player').addEventListener('click', render);
    document.getElementById('btn-play-pause').addEventListener('click', togglePlay);
    document.getElementById('btn-speed').addEventListener('click', cycleSpeed);
    document.getElementById('btn-sleep').addEventListener('click', showSleepMenu);
    document.getElementById('btn-menu').addEventListener('click', showPlayerMenu);
    setupSeekbar();
  }

  function togglePlay() {
    playerState.playing = !playerState.playing;
    const btn = document.getElementById('btn-play-pause');
    if (btn) btn.textContent = playerState.playing ? '⏸' : '▶';
  }

  function cycleSpeed() {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(playerState.speed);
    playerState.speed = speeds[(idx + 1) % speeds.length];
    const btn = document.getElementById('btn-speed');
    if (btn) { btn.textContent = playerState.speed + 'x'; }
  }

  function showSleepMenu() {
    const existing = document.querySelector('.player-menu');
    if (existing) { existing.remove(); return; }
    const menu = document.createElement('div');
    menu.className = 'player-menu';
    const options = [15, 30, 45, 60, 0];
    options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'player-menu-item';
      item.textContent = opt === 0 ? 'Off' : opt + ' minutes';
      if (playerState.sleepTimerMinutes === opt) item.classList.add('selected');
      item.addEventListener('click', () => { playerState.sleepTimerMinutes = opt; menu.remove(); openPlayer(currentPlayingId()); });
      menu.appendChild(item);
    });
    document.querySelector('.player-overlay').appendChild(menu);
  }

  function showPlayerMenu() {
    const existing = document.querySelector('.player-menu');
    if (existing) { existing.remove(); return; }
    const menu = document.createElement('div');
    menu.className = 'player-menu';
    const items = [
      { label: 'Playback Speed', action: cycleSpeed },
      { label: 'Sleep Timer', action: showSleepMenu },
      { label: 'Picture in Picture', action: () => {} },
      { label: 'File Info', action: () => {} },
    ];
    items.forEach((it, i) => {
      if (i > 0) { const div = document.createElement('div'); div.className = 'player-menu-divider'; menu.appendChild(div); }
      const item = document.createElement('div');
      item.className = 'player-menu-item';
      item.textContent = it.label;
      item.addEventListener('click', () => { it.action(); menu.remove(); });
      menu.appendChild(item);
    });
    document.querySelector('.player-overlay').appendChild(menu);
  }

  function currentPlayingId() {
    return getDownloads().find(d => d.status === 'completed')?.id || '';
  }

  function setupSeekbar() {
    const seekbar = document.getElementById('player-seekbar');
    if (!seekbar) return;
    seekbar.addEventListener('click', function (e) {
      const rect = seekbar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      playerState.currentTime = percent * playerState.duration;
      updateSeekbar();
    });
    const interval = setInterval(() => {
      if (playerState.playing && playerState.currentTime < playerState.duration) {
        playerState.currentTime += playerState.speed;
        updateSeekbar();
      }
      if (!document.getElementById('player-seekbar')) clearInterval(interval);
    }, 1000);
  }

  function updateSeekbar() {
    const percent = (playerState.currentTime / playerState.duration) * 100;
    const progress = document.querySelector('.seek-progress');
    const thumb = document.querySelector('.seek-thumb');
    const timeEl = document.querySelector('.player-time');
    if (progress) progress.style.width = percent + '%';
    if (thumb) thumb.style.left = percent + '%';
    if (timeEl) timeEl.textContent = formatDuration(playerState.currentTime);
  }

  function showDownloadDetail(id) {
    const downloads = getDownloads(); const d = downloads.find(dl => dl.id === id); if (!d) return;
    playContent.innerHTML = '<div class="download-detail"><h3 class="detail-name">' + escapeHtml(d.title) + '</h3><div class="detail-row"><span class="detail-label">Status</span><span class="detail-value">' + d.status + '</span></div><div class="detail-row"><span class="detail-label">Progress</span><span class="detail-value">' + d.progress + '%</span></div><div class="detail-row"><span class="detail-label">Format</span><span class="detail-value">' + (d.format || 'Unknown') + '</span></div><div class="detail-row"><span class="detail-label">Started</span><span class="detail-value">' + new Date(d.time).toLocaleString() + '</span></div><div class="detail-actions"><button class="btn btn-outline btn-sm" id="btn-back-play">Back to Play</button><button class="btn btn-danger btn-sm" id="btn-cancel-dl">Cancel Download</button></div></div>';
    document.getElementById('btn-back-play').addEventListener('click', render);
    document.getElementById('btn-cancel-dl').addEventListener('click', function () { saveDownloads(getDownloads().filter(dl => dl.id !== id)); render(); });
  }

  function resumeAll() { const downloads = getDownloads(); downloads.forEach(d => { if (d.status === 'paused') d.status = 'downloading'; }); saveDownloads(downloads); render(); }
  function refreshDownloads() { const downloads = getDownloads(); let changed = false; downloads.forEach(d => { if (d.status === 'downloading' && d.progress < 100) { d.progress = Math.min(100, d.progress + Math.floor(Math.random() * 15)); if (d.progress >= 100) { d.status = 'completed'; d.progress = 100; } changed = true; } }); if (changed) { saveDownloads(downloads); if (Router.getCurrentPage && Router.getCurrentPage() === 'play') render(); } }
  function getDownloads() { try { return JSON.parse(localStorage.getItem('mv_downloads') || '[]'); } catch (e) { return []; } }
  function saveDownloads(downloads) { localStorage.setItem('mv_downloads', JSON.stringify(downloads)); }
  function enterSelectionMode(id) { selectionMode = true; selectedItems = id ? [id] : []; render(); }
  function exitSelectionMode() { selectionMode = false; selectedItems = []; document.querySelector('.selection-toolbar')?.remove(); render(); }
  function toggleSelection(id) { const idx = selectedItems.indexOf(id); if (idx > -1) selectedItems.splice(idx, 1); else selectedItems.push(id); render(); }
  function deleteSelected() { if (selectedItems.length === 0) return; if (confirm('Delete ' + selectedItems.length + ' file(s)?')) { saveDownloads(getDownloads().filter(d => !selectedItems.includes(d.id))); exitSelectionMode(); } }
  function addSelectionToolbar() { const toolbar = document.createElement('div'); toolbar.className = 'selection-toolbar'; toolbar.innerHTML = '<span class="selection-count">' + selectedItems.length + ' selected</span><button class="btn btn-sm btn-danger" id="btn-delete-sel">Delete</button><button class="btn btn-sm btn-outline" id="btn-share-sel">Share</button><button class="btn btn-sm btn-ghost" id="btn-cancel-sel">Cancel</button>'; document.body.appendChild(toolbar); document.getElementById('btn-cancel-sel').addEventListener('click', exitSelectionMode); document.getElementById('btn-delete-sel').addEventListener('click', deleteSelected); }
  function formatDuration(seconds) { const mins = Math.floor(seconds / 60); const secs = Math.floor(seconds % 60); return mins + ':' + String(secs).padStart(2, '0'); }
  function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

  return { init, render };
})();
document.addEventListener('DOMContentLoaded', function () { PlayPage.init(); });
