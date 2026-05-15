/**
 * MediaVault — Player Page
 * Audio/video player with seekbar, speed, sleep timer
 */

var Player = {
  track: null,
  playing: false,
  currentTime: 0,
  duration: 0,
  speed: 1.0,
  sleepTimer: 0,
  _interval: null,
  _sleepInterval: null,

  // ── SVG Icons ──
  _icons: {
    play: '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    pause: '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    prev: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>',
    next: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    skipBack: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
    skipFwd: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/></svg>',
    speed: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    sleep: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    music: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  },

  // ── Load ──
  load: function() {
    var q = [];
    try { q = JSON.parse(localStorage.getItem(CONFIG.STORAGE.QUEUE) || '[]'); } catch(e) {}
    this.queue = q.filter(function(d) { return d.status === 'completed'; });
    this.render();
  },

  // ── Play ──
  play: function(id) {
    var dl = this.queue.find(function(d) { return d.id === id; });
    if (!dl) return;
    this.track = Object.assign({}, dl, { duration: 180 });
    this.currentTime = 0;
    this.playing = true;
    Toast.show('Now playing: ' + dl.title);
    this.render();
    this._startTimer();
  },

  togglePlay: function() {
    this.playing = !this.playing;
    if (this.playing) this._startTimer();
    else clearInterval(this._interval);
    this.render();
  },

  _startTimer: function() {
    var self = this;
    clearInterval(this._interval);
    this._interval = setInterval(function() {
      if (!self.playing || !self.track) return;
      self.currentTime++;
      if (self.currentTime >= (self.track.duration || 180)) {
        self.next();
      }
      self.render();
    }, 1000);
  },

  skip: function(sec) {
    if (!this.track) return;
    this.currentTime = Math.max(0, Math.min(this.track.duration || 180, this.currentTime + sec));
    this.render();
  },

  seek: function(e) {
    if (!this.track) return;
    var rect = e.target.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    this.currentTime = Math.floor(pct * (this.track.duration || 180));
    this.render();
  },

  setSpeed: function() {
    var speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    var idx = speeds.indexOf(this.speed);
    this.speed = speeds[(idx + 1) % speeds.length];
    Toast.show('Speed: ' + this.speed + 'x');
    this.render();
  },

  setSleepTimer: function() {
    var opts = [15, 30, 45, 60];
    if (this.sleepTimer > 0) {
      this.sleepTimer = 0;
      clearInterval(this._sleepInterval);
      Toast.show('Sleep timer off');
    } else {
      this.sleepTimer = opts[0] * 60;
      Toast.show('Sleep timer: ' + opts[0] + ' min');
      var self = this;
      this._sleepInterval = setInterval(function() {
        self.sleepTimer--;
        if (self.sleepTimer <= 0) {
          self.playing = false;
          clearInterval(self._sleepInterval);
          Toast.show('Sleep timer ended');
        }
        self.render();
      }, 1000);
    }
    this.render();
  },

  prev: function() { Toast.show('Previous track'); },
  next: function() { Toast.show('Next track'); },

  // ── Render ──
  render: function() {
    var page = document.getElementById('page-player');
    var self = this;

    if (this.track) {
      var pct = this.track.duration > 0 ? (this.currentTime / this.track.duration * 100) : 0;

      page.innerHTML = ''
        + '<div class="player-art">'
        + '<div class="art">' + (this.track.format === 'mp3' ? this._icons.music : '🎬') + '</div>'
        + '<h2>' + Helpers.escape(this.track.title) + '</h2>'
        + '<p>' + Helpers.escape(this.track.artist || '') + ' · ' + (this.track.quality || '') + '</p>'
        + '</div>'
        + '<div class="seekbar" onclick="Player.seek(event)"><div class="seekbar-fill" style="width:' + pct + '%"></div></div>'
        + '<div class="seek-time"><span>' + Helpers.formatDuration(this.currentTime) + '</span><span>' + Helpers.formatDuration(this.track.duration) + '</span></div>'
        + '<div class="player-controls">'
        + '<button class="player-btn" onclick="Player.setSpeed()" style="font-size:13px;font-weight:600;">' + this.speed + 'x</button>'
        + '<button class="player-btn" onclick="Player.skip(-10)">' + this._icons.skipBack + '</button>'
        + '<button class="player-btn-lg" onclick="Player.togglePlay()">' + (this.playing ? this._icons.pause : this._icons.play) + '</button>'
        + '<button class="player-btn" onclick="Player.skip(10)">' + this._icons.skipFwd + '</button>'
        + '<button class="player-btn" onclick="Player.setSleepTimer()">' + this._icons.sleep + '</button>'
        + '</div>';

      if (this.sleepTimer > 0) {
        page.innerHTML += '<div style="text-align:center;padding:8px;font-size:13px;color:var(--text-tertiary);">⏰ Sleep in ' + Math.ceil(this.sleepTimer / 60) + ' min <button onclick="Player.setSleepTimer()" style="background:none;border:none;color:var(--error);cursor:pointer;margin-left:8px;">Cancel</button></div>';
      }
    } else {
      // Library view
      var audio = this.queue.filter(function(d) { return d.format === 'mp3'; });
      var video = this.queue.filter(function(d) { return d.format !== 'mp3'; });

      var html = '';
      if (audio.length > 0) {
        html += '<div class="section-head"><h2>🎵 Audio (' + audio.length + ')</h2></div>';
        html += audio.map(function(d) { return self._trackRow(d); }).join('');
      }
      if (video.length > 0) {
        html += '<div class="section-head"><h2>🎬 Video (' + video.length + ')</h2></div>';
        html += video.map(function(d) { return self._trackRow(d); }).join('');
      }
      if (audio.length === 0 && video.length === 0) {
        html += '<div class="empty"><div class="empty-icon">🎵</div><div class="empty-title">No Music</div><div class="empty-text">Download music to play here</div></div>';
      }
      page.innerHTML = html;
    }
  },

  _trackRow: function(dl) {
    return ''
      + '<div class="dl-card" onclick="Player.play(\'' + dl.id + '\')" style="cursor:pointer;">'
      + '<div class="dl-icon">' + (dl.format === 'mp3' ? '🎵' : '🎬') + '</div>'
      + '<div class="dl-info">'
      + '<div class="dl-title">' + Helpers.escape(dl.title) + '</div>'
      + '<div class="dl-meta">' + (dl.quality || '') + ' · ' + Helpers.formatSize(dl.size) + ' · ' + Helpers.timeAgo(dl.addedAt) + '</div>'
      + '</div>'
      + '<span style="font-size:24px;color:var(--text-secondary);">▶</span>'
      + '</div>';
  },
};
