(function () {
  'use strict';

  function init() {
    console.log('[MediaVault] Initializing v' + CONFIG.APP_VERSION);
    var theme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (typeof System !== 'undefined') System.init();
    if (typeof BadgeSystem !== 'undefined') BadgeSystem.init();
    if (typeof Router !== 'undefined') Router.init();
    initDrawer();
    console.log('[MediaVault] Ready');
  }

  function initDrawer() {
    var btn = document.getElementById('btn-hamburger');
    var drawer = document.getElementById('hamburger-drawer');
    if (!btn || !drawer) return;

    btn.addEventListener('click', function() { drawer.classList.add('open'); });

    // Close on overlay click
    drawer.querySelector('.drawer-overlay').addEventListener('click', function() { drawer.classList.remove('open'); });

    // Build menu items
    var menu = document.getElementById('drawer-menu');
    if (!menu) return;

    var items = [
      { label: '🏠 Home', action: function() { Router.navigate('home'); } },
      { label: '⬇ Downloads', action: function() { Router.navigate('downloads'); } },
      { label: '▶ Player', action: function() { Router.navigate('player'); } },
      { label: '👤 Profile', action: function() { Router.navigate('profile'); } },
      { type: 'divider' },
      { label: '💬 WhatsApp Status Saver', action: function() { System.toast('Opening Status Saver...'); } },
      { label: '🔒 Private Vault', action: function() { System.toast('Opening Vault...'); } },
      { label: '🧹 Phone Cleaner', action: function() { System.toast('Opening Cleaner...'); } },
      { type: 'divider' },
      { label: '🌙 Theme', action: function() {
        var c = document.documentElement.getAttribute('data-theme') || 'light';
        var n = c === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', n);
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, n);
        System.toast('Theme: ' + (n === 'dark' ? 'Dark' : 'Light'));
      }},
      { label: '⭐ Rate App', action: function() { System.toast('⭐ Rate us on the store!'); } },
      { label: '📤 Share App', action: function() { System.toast('📤 Share options coming soon'); } },
      { label: '🌐 HERMAN Software', href: 'https://herman-software-website.vercel.app' },
    ];

    items.forEach(function(item) {
      if (item.type === 'divider') {
        var div = document.createElement('div');
        div.className = 'drawer-divider';
        menu.appendChild(div);
      } else if (item.href) {
        var a = document.createElement('a');
        a.className = 'drawer-item';
        a.href = item.href;
        a.target = '_blank';
        a.textContent = item.label;
        menu.appendChild(a);
      } else {
        var btn = document.createElement('button');
        btn.className = 'drawer-item';
        btn.textContent = item.label;
        btn.addEventListener('click', function() {
          drawer.classList.remove('open');
          item.action();
        });
        menu.appendChild(btn);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Helper functions for drawer onclick handlers
function HamburgerMenu_close() {
  var d = document.getElementById('hamburger-drawer');
  if (d) d.classList.remove('open');
}

function HamburgerMenu_toggleTheme() {
  var c = document.documentElement.getAttribute('data-theme') || 'light';
  var n = c === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', n);
  localStorage.setItem('mv_theme', n);
  if (typeof System !== 'undefined') System.toast('Theme: ' + (n === 'dark' ? 'Dark' : 'Light'));
}

function HamburgerMenu_go(page) {
  var d = document.getElementById('hamburger-drawer');
  if (d) d.classList.remove('open');
  if (typeof Router !== 'undefined') Router.navigate(page);
}

function HamburgerMenu_toast(msg) {
  var d = document.getElementById('hamburger-drawer');
  if (d) d.classList.remove('open');
  if (typeof System !== 'undefined') System.toast(msg);
}
