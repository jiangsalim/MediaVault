/**
 * MediaVault — Extra Features
 * Mini Player, Lyrics, WiFi Only, Offline Suggest, App Lock
 */

// ── Mini Player ──
var MiniPlayer = {
  show: function(track) {
    var el = document.getElementById('mini-player');
    if (!el) {
      el = document.createElement('div');
      el.id = 'mini-player';
      el.style.cssText = 'position:fixed;bottom:60px;left:0;right:0;background:var(--bg);border-top:1px solid var(--border);padding:10px 16px;display:flex;align-items:center;gap:12px;z-index:150;cursor:pointer;box-shadow:0 -2px 10px rgba(0,0,0,0.1);';
      el.onclick = function() { if (typeof Router !== 'undefined') Router.go('player'); };
      document.body.appendChild(el);
    }
    el.innerHTML = ''
      + '<div style="width:40px;height:40px;background:var(--surface);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px;">🎵</div>'
      + '<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + Helpers.escape(track.title) + '</div><div style="font-size:11px;color:var(--text-tertiary);">' + Helpers.escape(track.artist || '') + '</div></div>'
      + '<button onclick="event.stopPropagation();Player.togglePlay()" style="background:none;border:none;font-size:24px;cursor:pointer;padding:8px;">' + (Player.playing ? '⏸' : '▶') + '</button>';
    el.style.display = 'flex';
  },

  hide: function() {
    var el = document.getElementById('mini-player');
    if (el) el.style.display = 'none';
  },
};

// ── Lyrics Fetch ──
var Lyrics = {
  fetch: async function(title, artist) {
    Toast.show('Searching lyrics...');
    try {
      var q = encodeURIComponent((artist || '') + ' ' + (title || ''));
      var res = await fetch('https://api.lyrics.ovh/v1/' + encodeURIComponent(artist || '') + '/' + encodeURIComponent(title || ''));
      var data = await res.json();
      if (data.lyrics) {
        Sheet.show('<h3 style="margin-bottom:12px;">Lyrics</h3><pre style="white-space:pre-wrap;font-size:13px;line-height:1.6;max-height:60vh;overflow-y:auto;">' + data.lyrics + '</pre><button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;margin-top:12px;">Close</button>');
      } else {
        Toast.show('Lyrics not found');
      }
    } catch(e) {
      Toast.show('Lyrics not available');
    }
  },
};

// ── WiFi Only Download ──
var WiFiOnly = {
  enabled: false,

  init: function() {
    this.enabled = localStorage.getItem('mv_wifi_only') === 'true';
  },

  toggle: function() {
    this.enabled = !this.enabled;
    localStorage.setItem('mv_wifi_only', this.enabled.toString());
    Toast.show('WiFi only: ' + (this.enabled ? 'ON' : 'OFF'));
  },

  isAllowed: function() {
    if (!this.enabled) return true;
    var conn = navigator.connection;
    return conn ? conn.type === 'wifi' : true;
  },
};
WiFiOnly.init();

// ── Offline Search Suggestions ──
var OfflineSuggest = {
  cache: [],

  init: function() {
    try { this.cache = JSON.parse(localStorage.getItem('mv_suggest_cache') || '[]'); } catch(e) { this.cache = []; }
  },

  add: function(query) {
    if (this.cache.indexOf(query) >= 0) return;
    this.cache.unshift(query);
    if (this.cache.length > 100) this.cache = this.cache.slice(0, 100);
    localStorage.setItem('mv_suggest_cache', JSON.stringify(this.cache));
  },

  get: function(prefix) {
    return this.cache.filter(function(s) { return s.toLowerCase().indexOf(prefix.toLowerCase()) >= 0; }).slice(0, 8);
  },
};
OfflineSuggest.init();

// ── App Lock ──
var AppLock = {
  enabled: false,
  pin: '',

  init: function() {
    this.enabled = localStorage.getItem('mv_app_lock') === 'true';
    this.pin = localStorage.getItem('mv_app_pin') || '';
  },

  setup: function() {
    var self = this;
    var html = '<h3 style="font-size:16px;margin-bottom:8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> App Lock</h3>'
      + '<p style="font-size:13px;color:var(--text-tertiary);margin-bottom:12px;">Set a 4-digit PIN to lock the app</p>'
      + '<input type="password" id="lock-pin" placeholder="Enter 4-digit PIN" maxlength="4" style="width:100%;padding:14px;border:1px solid var(--border);border-radius:8px;text-align:center;font-size:24px;letter-spacing:8px;background:var(--bg);color:var(--text);margin-bottom:12px;">'
      + '<button onclick="var p=document.getElementById(\'lock-pin\').value;if(p.length===4){localStorage.setItem(\'mv_app_lock\',\'true\');localStorage.setItem(\'mv_app_pin\',p);Sheet.hide();Toast.show(\'App lock enabled\')}" style="width:100%;padding:12px;background:var(--accent);color:var(--accent-text);border:none;border-radius:8px;cursor:pointer;font-weight:600;">Enable Lock</button>';
    if (this.enabled) {
      html += '<button onclick="localStorage.setItem(\'mv_app_lock\',\'false\');Sheet.hide();Toast.show(\'App lock disabled\')" style="width:100%;padding:12px;background:var(--error);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-top:8px;">Disable Lock</button>';
    }
    html += '<button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;margin-top:8px;">Cancel</button>';
    Sheet.show(html);
  },
};
AppLock.init();
