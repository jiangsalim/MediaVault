/**
 * MediaVault — System Utilities
 * Toast, Bottom Sheet, Helpers
 */

// ── Toast ──
var Toast = {
  _timer: null,

  show: function(msg, duration) {
    duration = duration || CONFIG.TOAST.SHORT;
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._timer);
    this._timer = setTimeout(function() {
      el.classList.remove('show');
    }, duration);
  },
};

// ── Bottom Sheet ──
var Sheet = {
  show: function(html) {
    document.getElementById('sheet-body').innerHTML = html;
    document.getElementById('sheet').classList.add('show');
    document.getElementById('overlay').classList.add('show');
  },

  hide: function() {
    document.getElementById('sheet').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
  },
};

// ── Helpers ──
var Helpers = {
  formatDuration: function(s) {
    if (!s) return '0:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  },

  formatNumber: function(n) {
    if (!n) return '0';
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return n.toString();
  },

  formatSize: function(b) {
    if (!b) return '0 B';
    var u = ['B', 'KB', 'MB', 'GB'];
    var i = 0;
    while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
    return b.toFixed(1) + ' ' + u[i];
  },

  timeAgo: function(d) {
    if (!d) return '';
    var diff = Date.now() - new Date(d).getTime();
    var m = Math.floor(diff / 60000);
    var h = Math.floor(diff / 3600000);
    var day = Math.floor(diff / 86400000);
    if (m < 1) return 'Just now';
    if (m < 60) return m + 'm ago';
    if (h < 24) return h + 'h ago';
    if (day < 30) return day + 'd ago';
    return Math.floor(day / 30) + 'mo ago';
  },

  escape: function(t) {
    var d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  },
};
