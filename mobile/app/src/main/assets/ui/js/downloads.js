/**
 * MediaVault — Downloads Page
 * Download manager with progress, filters, multi-select
 */

var Downloads = {
  queue: [],
  filter: 'all',
  selectMode: false,
  selected: {},
  _intervals: {},

  // ── Load ──
  load: function() {
    try {
      this.queue = JSON.parse(localStorage.getItem(CONFIG.STORAGE.QUEUE) || '[]');
    } catch(e) {
      this.queue = [];
    }
    this.render();
  },

  save: function() {
    localStorage.setItem(CONFIG.STORAGE.QUEUE, JSON.stringify(this.queue));
    if (typeof updateBadge !== 'undefined') updateBadge();
  },

  // ── Add Download ──
  add: function(video, quality, format) {
    var dl = {
      id: Date.now().toString(),
      videoId: video.id,
      title: video.title || 'Unknown',
      quality: quality || '720p',
      format: format || 'mp4',
      size: 0,
      downloaded: 0,
      progress: 0,
      speed: '',
      status: 'pending',
      addedAt: new Date().toISOString(),
    };

    this.queue.unshift(dl);
    this.save();
    this.render();
    this.start(dl.id);
    if (typeof Badges !== 'undefined') {
      Badges.track('downloads');
      if (format === 'mp3') Badges.track('audio');
      else Badges.track('video');
    }
  },

  // ── Start Download ──
  start: function(id) {
    var dl = this.queue.find(function(d) { return d.id === id; });
    if (!dl) return;
    dl.status = 'downloading';
    this.save();
    this.render();
    this._simulate(dl);
  },

  _simulate: function(dl) {
    var self = this;
    dl.size = dl.size || (dl.format === 'mp3' ? 5000000 : 25000000);
    this._intervals[dl.id] = setInterval(function() {
      dl.progress = Math.min((dl.progress || 0) + Math.random() * 12, 100);
      dl.downloaded = Math.floor(dl.size * dl.progress / 100);
      dl.speed = (Math.random() * 4 + 0.5).toFixed(1) + ' MB/s';
      if (dl.progress >= 100) {
        dl.status = 'completed';
        dl.progress = 100;
        clearInterval(self._intervals[dl.id]);
        Toast.show('Download complete!');
    var streak = parseInt(localStorage.getItem("mv_streak") || "0");
    var today = new Date().toDateString();
    var last = localStorage.getItem("mv_streak_day");
    if (last !== today) {
      localStorage.setItem("mv_streak_day", today);
      localStorage.setItem("mv_streak", streak + 1);
    }
      }
      self.save();
      self.render();
    }, 600);
  },

  pause: function(id) {
    var dl = this.queue.find(function(d) { return d.id === id; });
    if (dl) {
      dl.status = 'pending';
      clearInterval(this._intervals[id]);
      this.save();
      this.render();
    }
  },

  remove: function(id) {
    this.queue = this.queue.filter(function(d) { return d.id !== id; });
    clearInterval(this._intervals[id]);
    this.save();
    this.render();
  },

  clearCompleted: function() {
    this.queue = this.queue.filter(function(d) { return d.status !== 'completed'; });
    this.save();
    this.render();
    Toast.show('Cleared completed');
  },

  // ── Filter ──
  setFilter: function(f) {
    this.filter = f;
    this.render();
  },

  // ── Multi-Select ──
  toggleSelectMode: function() {
    this.selectMode = !this.selectMode;
    this.selected = {};
    this.render();
  },

  toggleSelect: function(id) {
    if (this.selected[id]) delete this.selected[id];
    else this.selected[id] = true;
    this.render();
  },

  deleteSelected: function() {
    var self = this;
    var ids = Object.keys(this.selected);
    if (ids.length === 0) { Toast.show('No items selected'); return; }
    this.queue = this.queue.filter(function(d) { return !self.selected[d.id]; });
    this.selected = {};
    this.selectMode = false;
    this.save();
    this.render();
    Toast.show('Deleted ' + ids.length + ' items');
  },

  // ── Render ──
  render: function() {
    var page = document.getElementById('page-downloads');
    var self = this;

    var active = this.queue.filter(function(d) { return d.status === 'downloading' || d.status === 'pending'; });
    var completed = this.queue.filter(function(d) { return d.status === 'completed'; });

    if (this.filter === 'audio') {
      active = active.filter(function(d) { return d.format === 'mp3'; });
      completed = completed.filter(function(d) { return d.format === 'mp3'; });
    } else if (this.filter === 'video') {
      active = active.filter(function(d) { return d.format !== 'mp3'; });
      completed = completed.filter(function(d) { return d.format !== 'mp3'; });
    }

    var html = '';

    // Filter chips
    html += '<div class="filter-row">';
    ['all', 'audio', 'video'].forEach(function(f) {
      html += '<button class="filter-chip' + (self.filter === f ? ' active' : '') + '" onclick="Downloads.setFilter(\'' + f + '\')">' + (f === 'all' ? 'All' : f === 'audio' ? '🎵 Audio' : '🎬 Video') + '</button>';
    });
    if (completed.length > 0) {
      html += '<button class="filter-chip' + (this.selectMode ? ' active' : '') + '" onclick="Downloads.toggleSelectMode()">' + (this.selectMode ? '✅ Done' : '☐ Select') + '</button>';
    }
    if (this.selectMode) {
      html += '<button class="filter-chip" onclick="Downloads.deleteSelected()">🗑 Delete</button>';
    }
    html += '</div>';

    // Active downloads
    if (active.length > 0) {
      html += '<div class="section-head"><h2>Active (' + active.length + ')</h2></div>';
      html += active.map(function(d) { return self._card(d); }).join('');
    }

    // Completed
    if (completed.length > 0) {
      html += '<div class="section-head"><h2>Completed (' + completed.length + ')</h2>';
      if (!this.selectMode) html += '<button onclick="Downloads.clearCompleted()">Clear</button>';
      html += '</div>';
      html += completed.map(function(d) { return self._card(d); }).join('');
    }

    // Empty
    if (active.length === 0 && completed.length === 0) {
      html += '<div class="empty"><div class="empty-icon">⬇</div><div class="empty-title">No Downloads</div><div class="empty-text">Search for music and videos to download</div></div>';
    }

    page.innerHTML = html;
  },

  _card: function(dl) {
    var progress = dl.progress || 0;
    var isActive = dl.status === 'downloading';
    var checked = this.selected[dl.id];

    var html = '<div class="dl-card" onclick="' + (this.selectMode ? 'Downloads.toggleSelect(\'' + dl.id + '\')' : '') + '">';

    if (this.selectMode) {
      html += '<div style="width:22px;height:22px;border:2px solid ' + (checked ? 'var(--accent)' : 'var(--border)') + ';border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:' + (checked ? 'var(--accent)' : 'transparent') + ';color:var(--accent-text);font-size:12px;">' + (checked ? '✓' : '') + '</div>';
    }

    html += '<div class="dl-icon">' + (dl.format === 'mp3' ? '🎵' : '🎬') + '</div>';
    html += '<div class="dl-info">';
    html += '<div class="dl-title">' + Helpers.escape(dl.title) + '</div>';
    html += '<div class="dl-meta">' + dl.quality + ' · ' + Helpers.formatSize(dl.size) + '</div>';

    if (isActive) {
      html += '<div class="dl-progress"><div class="dl-progress-fill" style="width:' + progress + '%"></div></div>';
      html += '<div class="dl-meta">' + Helpers.formatSize(dl.downloaded) + ' · ' + (dl.speed || '') + '</div>';
    }

    html += '</div>';

    if (!this.selectMode) {
      html += '<div class="dl-actions">';
      if (isActive) html += '<button onclick="event.stopPropagation();Downloads.pause(\'' + dl.id + '\')">⏸</button>';
      if (dl.status === 'pending') html += '<button onclick="event.stopPropagation();Downloads.start(\'' + dl.id + '\')">▶</button>';
      html += '<button onclick="event.stopPropagation();Downloads.remove(\'' + dl.id + '\')">🗑</button>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  },
};
