const PlayPage = (function () {
  'use strict';
  let playContent, selectionMode = false, selectedItems = [];
  let currentFilter = 'all';

  function init() {
    playContent = document.getElementById('play-content');
    if (!playContent) return;
    render();
    setInterval(refreshDownloads, 3000);
  }

  function render() {
    if (!playContent) return;
    const downloads = getDownloads();
    const activeDownloads = downloads.filter(d => d.status === 'downloading');
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
        html += '<div class="dl-info">';
        html += '<div class="dl-title">' + escapeHtml(d.title) + '</div>';
        html += '<div class="dl-status"><span class="dl-progress-text">' + d.progress + '%</span></div>';
        html += '<div class="dl-progress-bar"><div class="dl-progress-fill" style="width:' + d.progress + '%;"></div></div>';
        html += '</div></div>';
      });
      html += '</div>';
    }

    if (completedDownloads.length > 0) {
      let filtered = completedDownloads;
      if (currentFilter === 'audio') filtered = completedDownloads.filter(d => d.format && d.format.includes('MP3'));
      else if (currentFilter === 'video') filtered = completedDownloads.filter(d => d.format && !d.format.includes('MP3'));

      html += '<div class="play-section">';
      html += '<div class="play-section-title">Downloaded <span class="count-badge">' + filtered.length + '</span></div>';
      html += '<div class="filter-chips">';
      html += '<button class="filter-chip' + (currentFilter === 'all' ? ' active' : '') + '" data-filter="all">All</button>';
      html += '<button class="filter-chip' + (currentFilter === 'audio' ? ' active' : '') + '" data-filter="audio">Audio</button>';
      html += '<button class="filter-chip' + (currentFilter === 'video' ? ' active' : '') + '" data-filter="video">Video</button>';
      html += '</div>';

      filtered.forEach(d => {
        const isAudio = d.format && d.format.includes('MP3');
        const icon = isAudio ? '🎵' : '📅';
        html += '<div class="downloaded-item" data-id="' + d.id + '">';
        if (selectionMode) {
          html += '<div class="selection-checkbox' + (selectedItems.includes(d.id) ? ' checked' : '') + '">' + (selectedItems.includes(d.id) ? '✓' : '') + '</div>';
        }
        html += '<div class="file-icon">' + icon + '</div>';
        html += '<div class="file-info">';
        html += '<div class="file-title">' + escapeHtml(d.title) + '</div>';
        html += '<div class="file-meta">' + (d.duration || '') + (d.size ? ' | ' + d.size : '') + '</div>';
        html += '</div>';
        if (!selectionMode) {
          html += '<div class="file-size">' + (d.size || d.format || '') + '</div>';
        }
        html += '</div>';
      });
      html += '</div>';
    }

    playContent.innerHTML = html;

    if (selectionMode) {
      const toolbar = document.createElement('div');
      toolbar.className = 'selection-toolbar';
      toolbar.innerHTML = '<span class="selection-count">' + selectedItems.length + ' selected</span><button class="btn btn-sm btn-danger" id="btn-delete-selected">Delete</button><button class="btn btn-sm btn-outline" id="btn-share-selected">Share</button><button class="btn btn-sm btn-ghost" id="btn-cancel-selection">Cancel</button>';
      document.body.appendChild(toolbar);
      document.getElementById('btn-cancel-selection').addEventListener('click', exitSelectionMode);
      document.getElementById('btn-delete-selected').addEventListener('click', deleteSelected);
    }

    bindEvents();
  }

  function bindEvents() {
    document.querySelectorAll('.downloading-item').forEach(item => {
      item.addEventListener('click', function () { showDownloadDetail(this.dataset.id); });
    });
    document.querySelectorAll('.downloaded-item').forEach(item => {
      item.addEventListener('click', function () {
        if (selectionMode) { toggleSelection(this.dataset.id, this); }
        else { playFile(this.dataset.id); }
      });
      item.addEventListener('contextmenu', function (e) { e.preventDefault(); enterSelectionMode(this.dataset.id); });
    });
    document.querySelectorAll('.continue-all-btn').forEach(btn => {
      btn.addEventListener('click', function () { resumeAll(); });
    });
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', function () {
        currentFilter = this.dataset.filter;
        render();
      });
    });
  }

  function getDownloads() {
    try { return JSON.parse(localStorage.getItem('mv_downloads') || '[]'); } catch (e) { return []; }
  }

  function saveDownloads(downloads) { localStorage.setItem('mv_downloads', JSON.stringify(downloads)); }

  function showDownloadDetail(id) {
    const downloads = getDownloads();
    const d = downloads.find(dl => dl.id === id);
    if (!d) return;
    playContent.innerHTML = '<div class="download-detail"><h3 class="detail-name">' + escapeHtml(d.title) + '</h3><div class="detail-row"><span class="detail-label">Status</span><span class="detail-value">' + d.status + '</span></div><div class="detail-row"><span class="detail-label">Progress</span><span class="detail-value">' + d.progress + '%</span></div><div class="detail-row"><span class="detail-label">Format</span><span class="detail-value">' + (d.format || 'Unknown') + '</span></div><div class="detail-row"><span class="detail-label">Started</span><span class="detail-value">' + new Date(d.time).toLocaleString() + '</span></div><div class="detail-actions"><button class="btn btn-outline btn-sm" id="btn-back-play">Back to Play</button><button class="btn btn-danger btn-sm" id="btn-cancel-dl">Cancel Download</button></div></div>';
    document.getElementById('btn-back-play').addEventListener('click', render);
    document.getElementById('btn-cancel-dl').addEventListener('click', function () {
      const updated = getDownloads().filter(dl => dl.id !== id);
      saveDownloads(updated);
      render();
    });
  }

  function playFile(id) {
    const downloads = getDownloads();
    const d = downloads.find(dl => dl.id === id);
    if (!d) return;
    const isAudio = d.format && d.format.includes('MP3');
    playContent.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;text-align:center;padding:20px;"><div style="font-size:5rem;margin-bottom:20px;">' + (isAudio ? '🎵' : '▶') + '</div><h3 style="margin-bottom:8px;">' + escapeHtml(d.title) + '</h3><p style="color:var(--color-text-secondary);margin-bottom:20px;">' + (d.format || '') + (d.size ? ' | ' + d.size : '') + '</p><div style="display:flex;gap:16px;align-items:center;margin-bottom:20px;"><button class="btn btn-icon" style="font-size:1.5rem;">⏮</button><button class="btn btn-primary btn-icon" style="width:60px;height:60px;font-size:1.5rem;">▶</button><button class="btn btn-icon" style="font-size:1.5rem;">⏭</button></div><div style="width:100%;max-width:300px;"><div class="dl-progress-bar"><div class="dl-progress-fill" style="width:30%;"></div></div><div style="display:flex;justify-content:space-between;font-size:10px;color:var(--color-text-secondary);margin-top:4px;"><span>1:20</span><span>3:35</span></div></div><div style="display:flex;gap:12px;margin-top:20px;"><button class="btn btn-sm btn-ghost">Speed 1x</button><button class="btn btn-sm btn-ghost">Sleep Timer</button></div><button class="btn btn-ghost btn-sm" style="margin-top:24px;" id="btn-back-player">← Back to Play</button></div>';
    document.getElementById('btn-back-player').addEventListener('click', render);
  }

  function resumeAll() {
    const downloads = getDownloads();
    downloads.forEach(d => { if (d.status === 'paused') d.status = 'downloading'; });
    saveDownloads(downloads);
    render();
  }

  function refreshDownloads() {
    const downloads = getDownloads();
    let changed = false;
    downloads.forEach(d => {
      if (d.status === 'downloading' && d.progress < 100) {
        d.progress = Math.min(100, d.progress + Math.floor(Math.random() * 15));
        if (d.progress >= 100) { d.status = 'completed'; d.progress = 100; }
        changed = true;
      }
    });
    if (changed) {
      saveDownloads(downloads);
      if (Router.getCurrentPage && Router.getCurrentPage() === 'play') render();
    }
  }

  function enterSelectionMode(id) {
    selectionMode = true;
    if (id) selectedItems = [id];
    else selectedItems = [];
    render();
  }

  function exitSelectionMode() {
    selectionMode = false;
    selectedItems = [];
    const toolbar = document.querySelector('.selection-toolbar');
    if (toolbar) toolbar.remove();
    render();
  }

  function toggleSelection(id, element) {
    const idx = selectedItems.indexOf(id);
    if (idx > -1) { selectedItems.splice(idx, 1); }
    else { selectedItems.push(id); }
    render();
  }

  function deleteSelected() {
    if (selectedItems.length === 0) return;
    if (confirm('Delete ' + selectedItems.length + ' file(s)? This cannot be undone.')) {
      const downloads = getDownloads().filter(d => !selectedItems.includes(d.id));
      saveDownloads(downloads);
      exitSelectionMode();
    }
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

  return { init, render };
})();

document.addEventListener('DOMContentLoaded', function () {
  PlayPage.init();
});
