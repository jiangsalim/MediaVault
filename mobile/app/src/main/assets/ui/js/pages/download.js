const DownloadPage = {
  queue: [],

  load() {
    this.queue = System.getDownloadQueue();
    this.render();
  },

  render() {
    const container = document.getElementById('downloads-content');
    const active = this.queue.filter(d => d.status === 'downloading' || d.status === 'pending');
    const completed = this.queue.filter(d => d.status === 'completed');

    container.innerHTML = `
      ${active.length > 0 ? `<div class="section-header"><span class="section-title">Active (${active.length})</span></div>${active.map(d => this.downloadCard(d)).join('')}` : ''}
      ${completed.length > 0 ? `<div class="section-header"><span class="section-title">Completed (${completed.length})</span><button class="section-link" onclick="DownloadPage.clearCompleted()">Clear</button></div>${completed.map(d => this.downloadCard(d)).join('')}` : ''}
      ${active.length === 0 && completed.length === 0 ? this.emptyState() : ''}
    `;

    System.updateDownloadBadge();
  },

  downloadCard(dl) {
    const progress = dl.status === 'completed' ? 100 : dl.progress || 0;
    const isActive = dl.status === 'downloading';

    return `
      <div class="download-card">
        <div class="dl-thumb">${dl.format === 'mp3' ? '🎵' : '🎬'}</div>
        <div class="dl-info">
          <div class="dl-title">${this.escapeHtml(dl.title || 'Unknown')}</div>
          <div class="dl-meta">${dl.quality || ''} • ${System.formatFileSize(dl.size || 0)}</div>
          ${isActive ? `
            <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
            <div class="dl-meta">${System.formatFileSize(dl.downloaded || 0)} / ${System.formatFileSize(dl.size || 0)} • ${dl.speed || ''}</div>
          ` : ''}
        </div>
        <div class="dl-actions">
          ${isActive ? `<button class="dl-btn" onclick="DownloadPage.pauseDownload('${dl.id}')">⏸</button>` : ''}
          ${dl.status === 'pending' ? `<button class="dl-btn" onclick="DownloadPage.startDownload('${dl.id}')">▶</button>` : ''}
          ${dl.status === 'completed' ? `<button class="dl-btn" onclick="DownloadPage.openFile('${dl.id}')">📂</button>` : ''}
          <button class="dl-btn" onclick="DownloadPage.removeDownload('${dl.id}')">🗑</button>
        </div>
      </div>`;
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
    // Simulate progress (replace with real download logic)
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
    const dl = this.queue.find(d => d.id === id);
    if (dl) System.toast('Opening file...');
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
