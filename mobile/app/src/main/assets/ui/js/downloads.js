/**
 * MediaVault — Downloads Page
 * Download manager with progress, filters, multi-select
 * All icons SVG
 */

var Downloads = {
  queue: [],
  filter: 'all',
  selectMode: false,
  selected: {},
  _intervals: {},

  _icons: {
    audio: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    video: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
    pause: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    trash: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    download: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  },

  load: function() {
    try { this.queue = JSON.parse(localStorage.getItem(CONFIG.STORAGE.QUEUE) || '[]'); } catch(e) { this.queue = []; }
    this.render();
  },

  save: function() {
    localStorage.setItem(CONFIG.STORAGE.QUEUE, JSON.stringify(this.queue));
    if (typeof updateBadge !== 'undefined') updateBadge();
  },

  add: function(video, quality, format) {
    var dl = { id: Date.now().toString(), videoId: video.id, title: video.title || 'Unknown', quality: quality || '720p', format: format || 'mp4', size: 0, downloaded: 0, progress: 0, speed: '', status: 'pending', addedAt: new Date().toISOString() };
    this.queue.unshift(dl);
    this.save(); this.render(); this.start(dl.id);
    if (typeof Badges !== 'undefined') { Badges.track('downloads'); if (format === 'mp3') Badges.track('audio'); else Badges.track('video'); }
  },

  start: function(id) {
    var dl = this.queue.find(function(d) { return d.id === id; });
    if (!dl) return;
    dl.status = 'downloading'; this.save(); this.render();
    this._simulate(dl);
  },

  _simulate: function(dl) {
    var self = this;
    dl.size = dl.size || (dl.format === 'mp3' ? 5000000 : 25000000);
    this._intervals[dl.id] = setInterval(function() {
      dl.progress = Math.min((dl.progress || 0) + Math.random() * 12, 100);
      dl.downloaded = Math.floor(dl.size * dl.progress / 100);
      dl.speed = (Math.random() * 4 + 0.5).toFixed(1) + ' MB/s';
      if (dl.progress >= 100) { dl.status = 'completed'; dl.progress = 100; clearInterval(self._intervals[dl.id]); Toast.show('Download complete!'); }
      self.save(); self.render();
    }, 600);
  },

  pause: function(id) { var dl = this.queue.find(function(d) { return d.id === id; }); if (dl) { dl.status = 'pending'; clearInterval(this._intervals[id]); this.save(); this.render(); } },
  remove: function(id) { this.queue = this.queue.filter(function(d) { return d.id !== id; }); clearInterval(this._intervals[id]); this.save(); this.render(); },
  clearCompleted: function() { this.queue = this.queue.filter(function(d) { return d.status !== 'completed'; }); this.save(); this.render(); Toast.show('Cleared completed'); },
  setFilter: function(f) { this.filter = f; this.render(); },
  toggleSelectMode: function() { this.selectMode = !this.selectMode; this.selected = {}; this.render(); },
  toggleSelect: function(id) { if (this.selected[id]) delete this.selected[id]; else this.selected[id] = true; this.render(); },
  deleteSelected: function() { var self = this; var ids = Object.keys(this.selected); if (ids.length === 0) { Toast.show('No items selected'); return; } this.queue = this.queue.filter(function(d) { return !self.selected[d.id]; }); this.selected = {}; this.selectMode = false; this.save(); this.render(); Toast.show('Deleted ' + ids.length + ' items'); },
  startAllPending: function() { var self = this; var pending = this.queue.filter(function(d) { return d.status === 'pending'; }); var active = this.queue.filter(function(d) { return d.status === 'downloading'; }).length; var slots = CONFIG.DEFAULTS.MAX_CONCURRENT - active; pending.slice(0, slots).forEach(function(d) { self.start(d.id); }); Toast.show('Started downloads'); },
  moveToTop: function(id) { var idx = this.queue.findIndex(function(d) { return d.id === id; }); if (idx <= 0) return; var item = this.queue.splice(idx, 1)[0]; this.queue.unshift(item); this.save(); this.render(); Toast.show('Moved to top'); },
  convertToAudio: function(id) { var dl = this.queue.find(function(d) { return d.id === id; }); if (!dl) return; if (dl.format === 'mp3') { Toast.show('Already audio'); return; } dl.format = 'mp3'; dl.status = 'pending'; dl.progress = 0; this.save(); this.render(); this.start(id); },

  render: function() {
    var page = document.getElementById('page-downloads');
    var self = this;
    var active = this.queue.filter(function(d) { return d.status === 'downloading' || d.status === 'pending'; });
    var completed = this.queue.filter(function(d) { return d.status === 'completed'; });
    if (this.filter === 'audio') { active = active.filter(function(d) { return d.format === 'mp3'; }); completed = completed.filter(function(d) { return d.format === 'mp3'; }); }
    else if (this.filter === 'video') { active = active.filter(function(d) { return d.format !== 'mp3'; }); completed = completed.filter(function(d) { return d.format !== 'mp3'; }); }

    var html = '<div class="filter-row">';
    ['all', 'audio', 'video'].forEach(function(f) { html += '<button class="filter-chip' + (self.filter === f ? ' active' : '') + '" onclick="Downloads.setFilter(\'' + f + '\')">' + (f === 'all' ? 'All' : f === 'audio' ? 'Audio' : 'Video') + '</button>'; });
    if (completed.length > 0) html += '<button class="filter-chip' + (this.selectMode ? ' active' : '') + '" onclick="Downloads.toggleSelectMode()">' + (this.selectMode ? 'Done' : 'Select') + '</button>';
    if (this.selectMode) html += '<button class="filter-chip" onclick="Downloads.deleteSelected()">Delete</button>';
    html += '</div>';
    if (active.length > 0) { html += '<div class="section-head"><h2>Active (' + active.length + ')</h2></div>'; html += active.map(function(d) { return self._card(d); }).join(''); }
    if (completed.length > 0) { html += '<div class="section-head"><h2>Completed (' + completed.length + ')</h2>'; if (!this.selectMode) html += '<button onclick="Downloads.clearCompleted()">Clear</button>'; html += '</div>'; html += completed.map(function(d) { return self._card(d); }).join(''); }
    if (active.length === 0 && completed.length === 0) html += '<div class="empty"><div class="empty-icon">' + this._icons.download + '</div><div class="empty-title">No Downloads</div><div class="empty-text">Search for music and videos to download</div></div>';
    page.innerHTML = html;
  },

  _card: function(dl) {
    var progress = dl.progress || 0;
    var isActive = dl.status === 'downloading';
    var checked = this.selected[dl.id];
    var html = '<div class="dl-card" data-id="' + dl.id + '"';
    if (this.selectMode) html += ' onclick="Downloads.toggleSelect(\'' + dl.id + '\')"';
    else if (isActive) html += ' onclick="Downloads.pause(\'' + dl.id + '\')"';
    else if (dl.status === 'pending') html += ' onclick="Downloads.start(\'' + dl.id + '\')"';
    else html += ' onclick="if(typeof Player!==\'undefined\')Player.play(\'' + dl.id + '\')"';
    html += '>';

    if (this.selectMode) html += '<div style="width:22px;height:22px;border:2px solid ' + (checked ? 'var(--accent)' : 'var(--border)') + ';border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:' + (checked ? 'var(--accent)' : 'transparent') + ';color:var(--accent-text);font-size:12px;">' + (checked ? '✓' : '') + '</div>';
    html += '<div class="dl-icon">' + (dl.format === 'mp3' ? this._icons.audio : this._icons.video) + '</div>';
    html += '<div class="dl-info"><div class="dl-title">' + Helpers.escape(dl.title) + '</div><div class="dl-meta">' + dl.quality + ' · ' + Helpers.formatSize(dl.size) + '</div>';
    if (isActive) { html += '<div class="dl-progress"><div class="dl-progress-fill" style="width:' + progress + '%"></div></div>'; html += '<div class="dl-meta">' + Helpers.formatSize(dl.downloaded) + ' · ' + (dl.speed || '') + '</div>'; }
    html += '</div>';

    if (!this.selectMode) {
      html += '<div class="dl-actions">';
      if (isActive) html += '<button onclick="event.stopPropagation();Downloads.pause(\'' + dl.id + '\')">' + this._icons.pause + '</button>';
      if (dl.status === 'pending') html += '<button onclick="event.stopPropagation();Downloads.start(\'' + dl.id + '\')">' + this._icons.play + '</button>';
      if (dl.status === 'completed') html += '<button onclick="event.stopPropagation();if(typeof Player!==\'undefined\')Player.play(\'' + dl.id + '\')">' + this._icons.play + '</button>';
      html += '<button onclick="event.stopPropagation();Downloads.remove(\'' + dl.id + '\')">' + this._icons.trash + '</button>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  },
};
