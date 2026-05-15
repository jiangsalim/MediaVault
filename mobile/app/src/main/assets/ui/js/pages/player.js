const PlayerPage = {
  currentTrack: null,
  queue: [],

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const completed = System.getDownloadQueue().filter(d => d.status === 'completed' && d.format === 'mp3');
    
    container.innerHTML = `
      ${this.currentTrack ? this.nowPlaying() : this.emptyState()}
      ${completed.length > 0 ? `
        <div class="section-header"><span class="section-title">Your Music</span></div>
        <div style="padding:var(--space-md);">${completed.map(d => this.trackRow(d)).join('')}</div>
      ` : ''}
    `;
  },

  nowPlaying() {
    return `<div class="player-container" style="padding:var(--space-xl);text-align:center;">
      <div style="font-size:5rem;margin-bottom:var(--space-md);">🎵</div>
      <h3>${this.currentTrack.title || 'Unknown'}</h3>
      <p style="color:var(--color-text-tertiary);">${this.currentTrack.artist || ''}</p>
      <div class="progress-bar" style="margin:var(--space-md) 0;"><div class="progress-fill" style="width:${this.currentTrack.progress || 0}%"></div></div>
      <div style="display:flex;justify-content:center;gap:var(--space-lg);font-size:1.5rem;">
        <button class="dl-btn" onclick="PlayerPage.prev()">⏮</button>
        <button class="dl-btn" onclick="PlayerPage.togglePlay()">⏯</button>
        <button class="dl-btn" onclick="PlayerPage.next()">⏭</button>
      </div>
    </div>`;
  },

  trackRow(dl) {
    return `<div class="download-card" style="margin-bottom:var(--space-sm);" onclick="PlayerPage.play('${dl.id}')">
      <div class="dl-thumb">🎵</div>
      <div class="dl-info"><div class="dl-title">${dl.title}</div><div class="dl-meta">${dl.quality || ''} • ${System.formatFileSize(dl.size)}</div></div>
      <span style="color:var(--color-text-tertiary);">▶</span>
    </div>`;
  },

  play(id) {
    const dl = System.getDownloadQueue().find(d => d.id === id);
    if (dl) {
      this.currentTrack = { ...dl, progress: 0 };
      System.toast(`Now playing: ${dl.title}`);
      this.render('page-home');
    }
  },

  togglePlay() { System.toast(this.currentTrack ? 'Paused' : 'No track playing'); },
  prev() { System.toast('Previous track'); },
  next() { System.toast('Next track'); },

  emptyState() {
    return `<div class="empty-state"><div class="empty-icon">🎵</div><div class="empty-title">No Music Playing</div><div class="empty-text">Download music to start listening</div></div>`;
  },
};
