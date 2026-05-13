const HamburgerMenu = (function () {
  'use strict';
  let isOpen = false;
  let menuEl, overlayEl;

  function init() {
    createMenuElements();
    document.getElementById('btn-hamburger')?.addEventListener('click', toggle);
    document.addEventListener('click', function (e) {
      if (isOpen && !e.target.closest('.hamburger-menu') && !e.target.closest('#btn-hamburger')) {
        close();
      }
    });
  }

  function createMenuElements() {
    overlayEl = document.createElement('div');
    overlayEl.className = 'hamburger-overlay';
    overlayEl.id = 'hamburger-overlay';
    overlayEl.addEventListener('click', close);
    document.body.appendChild(overlayEl);

    menuEl = document.createElement('div');
    menuEl.className = 'hamburger-menu';
    menuEl.id = 'hamburger-menu';

    let html = '';
    html += '<div class="hamburger-header"><div class="hamburger-avatar">J</div><div class="hamburger-user-info"><div class="hamburger-name">Jiang Salim</div><div class="hamburger-email">jaingsalim@gmail.com</div></div></div>';
    html += '<div class="hamburger-section"><div class="hamburger-section-title">YouTube library</div>';
    html += '<div class="hamburger-sub-items"><div class="hamburger-sub-item" data-action="history"><span>🕐</span><span>History</span></div>';
    html += '<div class="hamburger-sub-item" data-action="playlists"><span>📋</span><span>Playlists</span></div>';
    html += '<div class="hamburger-sub-item" data-action="watch-later"><span>⏰</span><span>Watch later</span></div></div></div>';
    html += '<div class="hamburger-divider"></div>';
    html += '<div class="hamburger-item" data-action="restricted"><span class="hamburger-icon">🔒</span><span class="hamburger-label">Restricted mode</span><label class="toggle-switch hamburger-toggle"><input type="checkbox"><span class="toggle-slider"></span></label></div>';
    html += '<div class="hamburger-item" data-action="switch-account"><span class="hamburger-icon">🔄</span><span class="hamburger-label">Switch Account</span><span class="hamburger-chevron">›</span></div>';
    html += '<div class="hamburger-item" data-action="badges"><span class="hamburger-icon">🏆</span><span class="hamburger-label">Badges & Achievements</span><span class="hamburger-chevron">›</span></div>';
    html += '<div class="hamburger-footer"><button class="sign-out-btn" id="btn-sign-out">Sign out</button></div>';

    menuEl.innerHTML = html;
    document.body.appendChild(menuEl);

    bindMenuEvents();
  }

  function bindMenuEvents() {
    document.querySelector('.hamburger-sub-item[data-action="history"]')?.addEventListener('click', function () {
      close();
      showToast('History coming soon');
    });
    document.querySelector('.hamburger-sub-item[data-action="playlists"]')?.addEventListener('click', function () {
      close();
      renderPlaylistsPage();
    });
    document.querySelector('.hamburger-sub-item[data-action="watch-later"]')?.addEventListener('click', function () {
      close();
      renderWatchLaterPage();
    });
    document.querySelector('.hamburger-item[data-action="switch-account"]')?.addEventListener('click', function () {
      close();
      showToast('Account switching coming soon');
    });
    document.querySelector('.hamburger-item[data-action="badges"]')?.addEventListener('click', function () {
      close();
      renderBadgesPage();
    });
    document.getElementById('btn-sign-out')?.addEventListener('click', function () {
      if (confirm('Sign out of MediaVault?')) {
        close();
        showToast('Signed out successfully');
      }
    });
  }

  function renderPlaylistsPage() {
    const container = document.getElementById('settings-content');
    if (!container) return;
    Router.navigate('settings');
    setTimeout(function () {
      let html = '<div class="settings-back-header"><button class="back-btn" onclick="SettingsPage.backToMain()">←</button><span class="back-title">Playlists</span></div>';
      html += '<div class="settings-sub-content">';
      const playlists = [
        { name: 'Gospel Mix', count: 34 },
        { name: 'Dancehall Bangers', count: 28 },
        { name: 'Workout Music', count: 15 },
        { name: 'Study Beats', count: 22 },
      ];
      playlists.forEach(function (p) {
        html += '<div class="playlist-item-hamburger"><span class="playlist-icon">🎵</span><span class="playlist-name">' + p.name + '</span><span class="playlist-count">' + p.count + ' songs</span></div>';
      });
      html += '</div>';
      container.innerHTML = html;
    }, 100);
  }

  function renderWatchLaterPage() {
    const container = document.getElementById('settings-content');
    if (!container) return;
    Router.navigate('settings');
    setTimeout(function () {
      let html = '<div class="settings-back-header"><button class="back-btn" onclick="SettingsPage.backToMain()">←</button><span class="back-title">Watch Later</span></div>';
      html += '<div class="settings-sub-content">';
      const videos = [
        { title: 'How to Build a Mobile App', channel: 'Tech Tutorials', duration: '12:45' },
        { title: 'Uganda Music Mix 2026', channel: 'DJ Erycom', duration: '45:20' },
        { title: 'Learn Python Programming', channel: 'Code Academy', duration: '28:15' },
      ];
      videos.forEach(function (v) {
        html += '<div style="display:flex;gap:8px;padding:8px 0;border-bottom:1px solid var(--color-divider);"><span style="font-size:1.5rem;">▶</span><div style="flex:1;"><div style="font-size:13px;color:var(--color-text-primary);">' + v.title + '</div><div style="font-size:11px;color:var(--color-text-secondary);">' + v.channel + ' · ' + v.duration + '</div></div></div>';
      });
      html += '</div>';
      container.innerHTML = html;
    }, 100);
  }

  function renderBadgesPage() {
    const container = document.getElementById('settings-content');
    if (!container) return;
    Router.navigate('settings');
    setTimeout(function () {
      let html = '<div class="settings-back-header"><button class="back-btn" onclick="SettingsPage.backToMain()">←</button><span class="back-title">Badges & Achievements</span></div>';
      html += '<div class="badges-section">';
      html += '<p class="badge-progress">8 of 12 badges unlocked</p>';
      html += '<div class="badges-grid">';
      const badges = [
        { name: '7 Day Streak', icon: '🔥', unlocked: true },
        { name: '10 Videos', icon: '🎬', unlocked: true },
        { name: '50 Videos', icon: '🎬', unlocked: false },
        { name: '1 GB Club', icon: '💾', unlocked: true },
        { name: 'First Status', icon: '📱', unlocked: true },
        { name: 'Vault Guardian', icon: '🔒', unlocked: true },
        { name: 'Sharer', icon: '📡', unlocked: false },
        { name: 'Night Owl', icon: '🦉', unlocked: false },
        { name: 'Speed Demon', icon: '⚡', unlocked: true },
        { name: 'Perfect Week', icon: '🎯', unlocked: true },
        { name: 'Collector', icon: '📚', unlocked: false },
        { name: 'Veteran', icon: '👑', unlocked: true },
      ];
      badges.forEach(function (b) {
        html += '<div class="badge-card ' + (b.unlocked ? 'unlocked' : 'locked') + '"><div class="badge-icon">' + b.icon + '</div><div class="badge-name">' + b.name + '</div><div class="badge-status">' + (b.unlocked ? 'Unlocked ✓' : 'Locked 🔒') + '</div></div>';
      });
      html += '</div></div>';
      container.innerHTML = html;
    }, 100);
  }

  function toggle() { isOpen ? close() : open(); }
  function open() { isOpen = true; menuEl?.classList.add('active'); overlayEl?.classList.add('active'); }
  function close() { isOpen = false; menuEl?.classList.remove('active'); overlayEl?.classList.remove('active'); }
  function showToast(msg) { const toast = document.createElement('div'); toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--color-surface);color:var(--color-text-primary);padding:8px 16px;border-radius:20px;font-size:13px;z-index:500;'; toast.textContent = msg; document.body.appendChild(toast); setTimeout(function () { toast.remove(); }, 2000); }

  return { init, open, close, toggle };
})();
