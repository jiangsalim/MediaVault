const DownloadPage = {
  queue: [],
  filter: 'all',
  selectMode: false,
  selected: new Set(),

  load() {
    this.queue = System.getDownloadQueue();
    this.render();
  },

  render() {
    const container = document.getElementById('downloads-content');
    const active = this.queue.filter(d => d.status === 'downloading' || d.status === 'pending');
    const completed = this.queue.filter(d => d.status === 'completed');

    // Apply filter
    let filteredActive = active;
    let filteredCompleted = completed;
    if (this.filter === 'audio') {
      filteredActive = active.filter(d => d.format === 'mp3');
      filteredCompleted = completed.filter(d => d.format === 'mp3');
    } else if (this.filter === 'video') {
      filteredActive = active.filter(d => d.format !== 'mp3');
      filteredCompleted = completed.filter(d => d.format !== 'mp3');
    }

    container.innerHTML = `
      <!-- Filter Chips -->
      <div class="filter-chips" style="display:flex;gap:var(--space-sm);padding:var(--space-md);overflow-x:auto;">
        <button class="filter-chip ${this.filter==='all'?'active':''}" onclick="DownloadPage.setFilter('all')">All</button>
        <button class="filter-chip ${this.filter==='audio'?'active':''}" onclick="DownloadPage.setFilter('audio')">🎵 Audio</button>
        <button class="filter-chip ${this.filter==='video'?'active':''}" onclick="DownloadPage.setFilter('video')">🎬 Video</button>
        ${completed.length > 0 ? `<button class="filter-chip ${this.selectMode?'active':''}" onclick="DownloadPage.toggleSelectMode()">${this.selectMode ? '✅ Done' : '☐ Select'}</button>` : ''}
        ${this.selectMode ? `<button class="filter-chip" onclick="DownloadPage.deleteSelected()">🗑 Delete</button>` : ''}
      </div>

      <!-- Active Downloads -->
      ${filteredActive.length > 0 ? `
        <div class="section-header"><span class="section-title">Active (${filteredActive.length})</span></div>
        ${filteredActive.map(d => this.downloadCard(d)).join('')}
      ` : ''}

      <!-- Completed Downloads -->
      ${filteredCompleted.length > 0 ? `
        <div class="section-header">
          <span class="section-title">Completed (${filteredCompleted.length})</span>
          ${!this.selectMode ? `<button class="section-link" onclick="DownloadPage.clearCompleted()">Clear</button>` : ''}
        </div>
        ${filteredCompleted.map(d => this.downloadCard(d)).join('')}
      ` : ''}

      <!-- Empty State -->
      ${filteredActive.length === 0 && filteredCompleted.length === 0 ? this.emptyState() : ''}
    `;

    System.updateDownloadBadge();
  },

  downloadCard(dl) {
    const progress = dl.status === 'completed' ? 100 : dl.progress || 0;
    const isActive = dl.status === 'downloading';
    const checked = this.selected.has(dl.id);

    return `
      <div class="download-card" style="${this.selectMode ? 'cursor:pointer' : ''}" onclick="${this.selectMode ? `DownloadPage.toggleSelect('${dl.id}')` : ''}">
        ${this.selectMode ? `<div style="width:24px;height:24px;border:2px solid ${checked ? 'var(--color-primary)' : 'var(--color-border)'};border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${checked ? 'var(--color-primary)' : 'transparent'};color:white;font-size:14px;">${checked ? '✓' : ''}</div>` : ''}
        <div class="dl-thumb">${dl.format === 'mp3' ? '🎵' : '🎬'}</div>
        <div class="dl-info">
          <div class="dl-title">${this.escapeHtml(dl.title || 'Unknown')}</div>
          <div class="dl-meta">${dl.quality || ''} • ${System.formatFileSize(dl.size || 0)}</div>
          ${isActive ? `
            <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
            <div class="dl-meta">${System.formatFileSize(dl.downloaded || 0)} / ${System.formatFileSize(dl.size || 0)} • ${dl.speed || ''}</div>
          ` : ''}
        </div>
        ${!this.selectMode ? `
          <div class="dl-actions">
            ${isActive ? `<button class="dl-btn" onclick="event.stopPropagation();DownloadPage.pauseDownload('${dl.id}')">⏸</button>` : ''}
            ${dl.status === 'pending' ? `<button class="dl-btn" onclick="event.stopPropagation();DownloadPage.startDownload('${dl.id}')">▶</button>` : ''}
            ${dl.status === 'completed' ? `<button class="dl-btn" onclick="event.stopPropagation();DownloadPage.openFile('${dl.id}')">📂</button>` : ''}
            <button class="dl-btn" onclick="event.stopPropagation();DownloadPage.removeDownload('${dl.id}')">🗑</button>
          </div>
        ` : ''}
      </div>`;
  },

  setFilter(filter) {
    this.filter = filter;
    this.render();
  },

  toggleSelectMode() {
    this.selectMode = !this.selectMode;
    this.selected.clear();
    this.render();
  },

  toggleSelect(id) {
    if (this.selected.has(id)) this.selected.delete(id);
    else this.selected.add(id);
    this.render();
  },

  deleteSelected() {
    if (this.selected.size === 0) { System.toast('No items selected'); return; }
    this.queue = this.queue.filter(d => !this.selected.has(d.id));
    this.selected.clear();
    this.selectMode = false;
    System.saveDownloadQueue(this.queue);
    this.render();
    System.toast(`Deleted ${this.selected.size} items`);
  },

  addDownload(video, quality) {
    const dl = {
      id: Date.now().toString(),
      title: video.title || 'Unknown',
      videoId: video.id,
      quality: quality || '720p',
      format: quality?.includes('mp3') ? 'mp3' : 'mp4',
      size: quality?.size || 0,
      downloaded: 0,
      progress: 0,
      speed: '',
      status: 'pending',
      addedAt: new Date().toISOString(),
    };
    this.queue.unshift(dl);
    System.saveDownloadQueue(this.queue);
    this.render();
    System.toast('Added to downloads');
  },

  startDownload(id) {
    const dl = this.queue.find(d => d.id === id);
    if (!dl) return;
    dl.status = 'downloading';
    System.saveDownloadQueue(this.queue);
    this.render();
    this.simulateDownload(dl);
  },

  simulateDownload(dl) {
    const interval = setInterval(() => {
      dl.progress = Math.min((dl.progress || 0) + Math.random() * 15, 100);
      dl.downloaded = Math.floor((dl.size || 10000000) * dl.progress / 100);
      dl.speed = (Math.random() * 5 + 1).toFixed(1) + ' MB/s';
      if (dl.progress >= 100) {
        dl.status = 'completed';
        dl.progress = 100;
        clearInterval(interval);
        System.toast('Download complete!');
      }
      System.saveDownloadQueue(this.queue);
      this.render();
    }, 500);
  },

  pauseDownload(id) {
    const dl = this.queue.find(d => d.id === id);
    if (dl) { dl.status = 'pending'; System.saveDownloadQueue(this.queue); this.render(); }
  },

  removeDownload(id) {
    this.queue = this.queue.filter(d => d.id !== id);
    System.saveDownloadQueue(this.queue);
    this.render();
  },

  clearCompleted() {
    this.queue = this.queue.filter(d => d.status !== 'completed');
    System.saveDownloadQueue(this.queue);
    this.render();
    System.toast('Cleared completed');
  },

  openFile(id) {
    System.toast('Opening file...');
  },

  emptyState() {
    return `<div class="empty-state"><div class="empty-icon">⬇</div><div class="empty-title">No Downloads</div><div class="empty-text">Search for music and videos to download</div></div>`;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
};
