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

// ── Snackbar ──
var Snackbar = {
  show: function(msg, action, callback) {
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;bottom:80px;left:16px;right:16px;background:var(--accent);color:var(--accent-text);padding:14px 16px;border-radius:8px;display:flex;align-items:center;justify-content:space-between;z-index:9999;box-shadow:var(--shadow-md);animation:slideUp 300ms ease;';
    el.innerHTML = '<span style="font-size:14px;">' + msg + '</span>';
    if (action) {
      el.innerHTML += '<button style="background:none;border:none;color:var(--accent-text);font-weight:600;cursor:pointer;font-size:14px;">' + action + '</button>';
      el.querySelector('button').addEventListener('click', function() { el.remove(); if (callback) callback(); });
    }
    document.body.appendChild(el);
    setTimeout(function() { if (el.parentNode) el.remove(); }, 4000);
  },
};

// ── Dialog ──
var Dialog = {
  confirm: function(title, message, onConfirm) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9998;display:flex;align-items:center;justify-content:center;padding:24px;';
    overlay.innerHTML = '<div style="background:var(--bg);border-radius:12px;padding:24px;max-width:320px;width:100%;text-align:center;">'
      + '<h3 style="font-size:18px;font-weight:700;margin-bottom:8px;">' + title + '</h3>'
      + '<p style="font-size:14px;color:var(--text-secondary);margin-bottom:20px;">' + message + '</p>'
      + '<div style="display:flex;gap:12px;">'
      + '<button id="dialog-cancel" style="flex:1;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--bg);cursor:pointer;">Cancel</button>'
      + '<button id="dialog-confirm" style="flex:1;padding:12px;border:none;border-radius:8px;background:var(--accent);color:var(--accent-text);cursor:pointer;">Confirm</button>'
      + '</div></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#dialog-cancel').addEventListener('click', function() { overlay.remove(); });
    overlay.querySelector('#dialog-confirm').addEventListener('click', function() { overlay.remove(); if (onConfirm) onConfirm(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  },
};
