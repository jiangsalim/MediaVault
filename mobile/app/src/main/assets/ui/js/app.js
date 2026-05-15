/**
 * MediaVault — App Initialization
 * Snaptube-style, no backend, all on-device
 * Professional SVG icons throughout
 */

(function () {
  'use strict';

  // ── SVG Icon Library ──
  var Icons = {
    home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    downloads: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    player: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    profile: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    statusSaver: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    vault: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg>',
    cleaner: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    theme: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    rate: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    share: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    external: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    voice: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  };

  // ── Init ──
  function init() {
    loadTheme();
    monitorNetwork();
    initDrawer();
    initBottomNav();
    if (typeof Router !== 'undefined') Router.init();
    if (typeof Badges !== 'undefined') Badges.init();
    updateBadge();
    console.log('[MediaVault] v' + CONFIG.APP_VERSION + ' ready');
  }

  function loadTheme() {
    var t = localStorage.getItem(CONFIG.STORAGE.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', t);
  }

  window.toggleTheme = function() {
    var c = document.documentElement.getAttribute('data-theme');
    var n = c === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', n);
    localStorage.setItem(CONFIG.STORAGE.THEME, n);
    Toast.show('Theme: ' + (n === 'dark' ? 'Dark' : 'Light'));
  };

  function monitorNetwork() {
    var b = document.getElementById('offline-banner');
    function update() { b.classList.toggle('show', !navigator.onLine); }
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
  }

  function initDrawer() {
    var btn = document.getElementById('btn-menu');
    var drawer = document.getElementById('drawer');
    var overlay = document.getElementById('overlay');

    btn.innerHTML = Icons.menu;
    btn.addEventListener('click', function() {
      drawer.classList.add('open');
      overlay.classList.add('show');
    });

    overlay.addEventListener('click', function() {
      drawer.classList.remove('open');
      overlay.classList.remove('show');
    });

    var menu = document.getElementById('drawer-menu');
    if (!menu) return;

    var items = [
      { label: 'Home', icon: Icons.home, action: function() { Router.go('home'); } },
      { label: 'Downloads', icon: Icons.downloads, action: function() { Router.go('downloads'); } },
      { label: 'Player', icon: Icons.player, action: function() { Router.go('player'); } },
      { label: 'Profile', icon: Icons.profile, action: function() { Router.go('profile'); } },
      { type: 'divider' },
      { label: 'WhatsApp Status Saver', icon: Icons.statusSaver, action: function() { Toast.show('Opening...'); } },
      { label: 'Private Vault', icon: Icons.vault, action: function() { Toast.show('Opening...'); } },
      { label: 'Phone Cleaner', icon: Icons.cleaner, action: function() { Toast.show('Opening...'); } },
      { type: 'divider' },
      { label: 'Theme', icon: Icons.theme, action: function() { toggleTheme(); } },
      { label: 'Rate App', icon: Icons.rate, action: function() { Toast.show('⭐ Rate us!'); } },
      { label: 'Share', icon: Icons.share, action: function() { Toast.show('Share coming soon'); } },
      { label: 'HERMAN Software', icon: Icons.external, href: 'https://herman-software-website.vercel.app' },
    ];

    items.forEach(function(item) {
      if (item.type === 'divider') {
        var d = document.createElement('div');
        d.className = 'drawer-divider';
        menu.appendChild(d);
      } else if (item.href) {
        var a = document.createElement('a');
        a.className = 'drawer-item';
        a.href = item.href;
        a.target = '_blank';
        a.innerHTML = item.icon + ' <span>' + item.label + '</span>';
        menu.appendChild(a);
      } else {
        var b = document.createElement('button');
        b.className = 'drawer-item';
        b.innerHTML = item.icon + ' <span>' + item.label + '</span>';
        b.addEventListener('click', function() {
          drawer.classList.remove('open');
          overlay.classList.remove('show');
          item.action();
        });
        menu.appendChild(b);
      }
    });
  }

  function initBottomNav() {
    document.querySelectorAll('#bottom-nav .nav-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        Router.go(this.dataset.page);
      });
    });
  }

  window.updateBadge = function() {
    var q = [];
    try { q = JSON.parse(localStorage.getItem(CONFIG.STORAGE.QUEUE) || '[]'); } catch(e) {}
    var active = q.filter(function(d) { return d.status === 'downloading' || d.status === 'pending'; }).length;
    var badge = document.getElementById('dl-badge');
    if (active > 0) {
      badge.textContent = active > 99 ? '99+' : active;
      badge.classList.add('show');
    } else {
      badge.classList.remove('show');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
