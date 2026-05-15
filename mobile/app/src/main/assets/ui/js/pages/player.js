const PlayerPage = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackSpeed: 1.0,
  sleepTimer: null,
  sleepTimeLeft: 0,

  init() {
    this.queue = System.getDownloadQueue().filter(d => d.status === 'completed');
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('player-content');
    if (!container) return;

    container.innerHTML = this.currentTrack ? this.nowPlayingView() : this.libraryView();
  },

  nowPlayingView() {
    const t = this.currentTrack;
    const progress = t.duration > 0 ? (this.currentTime / t.duration) * 100 : 0;

    return `
      <div class="player-fullscreen">
        <!-- Album Art -->
        <div class="player-art" style="text-align:center;padding:var(--space-xl);">
          <div style="font-size:8rem;margin-bottom:var(--space-lg);">${t.format === 'mp3' ? '🎵' : '🎬'}</div>
          <h2 style="font-size:var(--font-size-xl);font-weight:700;margin-bottom:var(--space-sm);">${this.escapeHtml(t.title || 'Unknown')}</h2>
          <p style="color:var(--color-text-tertiary);">${this.escapeHtml(t.artist || '')} • ${t.quality || ''}</p>
        </div>

        <!-- Seekbar -->
        <div style="padding:0 var(--space-lg);">
          <div class="seekbar-container" style="position:relative;height:40px;display:flex;align-items:center;cursor:pointer;" onclick="PlayerPage.seek(event)">
            <div class="seekbar-track" style="flex:1;height:4px;background:var(--color-border);border-radius:2px;position:relative;">
              <div class="seekbar-fill" style="width:${progress}%;height:100%;background:var(--color-primary);border-radius:2px;"></div>
              <div class="seekbar-thumb" style="position:absolute;left:${progress}%;top:50%;transform:translate(-50%,-50%);width:16px;height:16px;background:var(--color-primary);border-radius:50%;box-shadow:var(--shadow-md);"></div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:var(--font-size-xs);color:var(--color-text-tertiary);">
            <span>${System.formatDuration(this.currentTime)}</span>
            <span>${System.formatDuration(t.duration || 0)}</span>
          </div>
        </div>

        <!-- Controls -->
        <div style="display:flex;align-items:center;justify-content:center;gap:var(--space-xl);padding:var(--space-lg);">
          <button class="player-btn" onclick="PlayerPage.setSpeed()" style="font-size:var(--font-size-sm);">${this.playbackSpeed}x</button>
          <button class="player-btn" onclick="PlayerPage.skip(-10)">⏪</button>
          <button class="player-btn-lg" onclick="PlayerPage.togglePlay()">${this.isPlaying ? '⏸' : '▶'}</button>
          <button class="player-btn" onclick="PlayerPage.skip(10)">⏩</button>
          <button class="player-btn" onclick="PlayerPage.setSleepTimer()">⏰</button>
        </div>

        <!-- Sleep Timer Display -->
        ${this.sleepTimeLeft > 0 ? `
          <div style="text-align:center;padding:var(--space-sm);color:var(--color-text-tertiary);font-size:var(--font-size-sm);">
            ⏰ Sleep timer: ${Math.ceil(this.sleepTimeLeft / 60)} min remaining
            <button onclick="PlayerPage.cancelSleepTimer()" style="border:none;background:none;color:var(--color-error);cursor:pointer;margin-left:8px;">Cancel</button>
          </div>
        ` : ''}

        <!-- Queue -->
        <div style="padding:var(--space-md);">
          <div class="section-header"><span class="section-title">Up Next</span></div>
          <div style="padding:0 var(--space-md);">${this.queue.slice(0, 10).map(d => this.trackRow(d)).join('')}</div>
        </div>
      </div>`;
  },

  libraryView() {
    const audio = this.queue.filter(d => d.format === 'mp3');
    const video = this.queue.filter(d => d.format !== 'mp3');

    return `
      <div style="padding:var(--space-md);">
        ${audio.length > 0 ? `
          <div class="section-header"><span class="section-title">🎵 Audio (${audio.length})</span></div>
          ${audio.map(d => this.trackRow(d)).join('')}
        ` : ''}
        ${video.length > 0 ? `
          <div class="section-header"><span class="section-title">🎬 Video (${video.length})</span></div>
          ${video.map(d => this.trackRow(d)).join('')}
        ` : ''}
        ${audio.length === 0 && video.length === 0 ? this.emptyState() : ''}
      </div>`;
  },

  trackRow(dl) {
    return `
      <div class="download-card" style="margin-bottom:var(--space-sm);cursor:pointer;" onclick="PlayerPage.play('${dl.id}')">
        <div class="dl-thumb">${dl.format === 'mp3' ? '🎵' : '🎬'}</div>
        <div class="dl-info">
          <div class="dl-title">${this.escapeHtml(dl.title || 'Unknown')}</div>
          <div class="dl-meta">${dl.quality || ''} • ${System.formatFileSize(dl.size)} • ${System.timeAgo(dl.addedAt)}</div>
        </div>
        <span style="color:var(--color-primary);font-size:1.5rem;">▶</span>
      </div>`;
  },

  play(id) {
    const dl = this.queue.find(d => d.id === id);
    if (!dl) return;
    this.currentTrack = { ...dl, duration: 180 };
    this.currentTime = 0;
    this.isPlaying = true;
    System.toast(`Now playing: ${dl.title}`);
    this.render();
    this.startPlayback();
  },

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.render();
    if (this.isPlaying) this.startPlayback();
    else System.toast('Paused');
  },

  startPlayback() {
    if (this._interval) clearInterval(this._interval);
    this._interval = setInterval(() => {
      if (!this.isPlaying || !this.currentTrack) return;
      this.currentTime += 1;
      if (this.currentTime >= (this.currentTrack.duration || 180)) {
        this.next();
      }
      this.render();
    }, 1000);
  },

  skip(seconds) {
    this.currentTime = Math.max(0, Math.min((this.currentTrack?.duration || 180), this.currentTime + seconds));
    this.render();
  },

  seek(event) {
    const rect = event.target.closest('.seekbar-container').getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    this.currentTime = Math.floor(percent * (this.currentTrack?.duration || 180));
    this.render();
  },

  setSpeed() {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const idx = speeds.indexOf(this.playbackSpeed);
    this.playbackSpeed = speeds[(idx + 1) % speeds.length];
    System.toast(`Speed: ${this.playbackSpeed}x`);
    this.render();
  },

  setSleepTimer() {
    const options = [15, 30, 45, 60];
    const current = this.sleepTimeLeft > 0 ? 0 : options[0];
    if (this.sleepTimeLeft > 0) {
      this.sleepTimeLeft = 0;
      if (this._sleepInterval) clearInterval(this._sleepInterval);
      System.toast('Sleep timer cancelled');
    } else {
      this.sleepTimeLeft = options[0] * 60;
      System.toast(`Sleep timer: ${options[0]} min`);
      this._sleepInterval = setInterval(() => {
        this.sleepTimeLeft -= 1;
        if (this.sleepTimeLeft <= 0) {
          this.isPlaying = false;
          clearInterval(this._sleepInterval);
          System.toast('Sleep timer ended');
        }
        this.render();
      }, 1000);
    }
    this.render();
  },

  cancelSleepTimer() {
    this.sleepTimeLeft = 0;
    if (this._sleepInterval) clearInterval(this._sleepInterval);
    this.render();
  },

  prev() { System.toast('Previous track'); },
  next() {
    const idx = this.queue.findIndex(d => d.id === this.currentTrack?.id);
    if (idx < this.queue.length - 1) this.play(this.queue[idx + 1].id);
    else System.toast('End of queue');
  },

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') { e.preventDefault(); this.togglePlay(); }
    });
  },

  emptyState() {
    return `<div class="empty-state"><div class="empty-icon">🎵</div><div class="empty-title">No Music</div><div class="empty-text">Download music to play here</div></div>`;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
};
