const SystemUI = (function () {
  'use strict';

  function showToast(message, type, duration) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification' + (type ? ' ' + type : '');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, (duration || 2500));
  }

  function showSnackbar(message, actionText, actionCallback) {
    const existing = document.querySelector('.snackbar');
    if (existing) existing.remove();
    const snackbar = document.createElement('div');
    snackbar.className = 'snackbar';
    snackbar.innerHTML = '<span class="snackbar-text">' + message + '</span>';
    if (actionText) {
      const action = document.createElement('span');
      action.className = 'snackbar-action';
      action.textContent = actionText;
      action.addEventListener('click', function () {
        if (actionCallback) actionCallback();
        snackbar.remove();
      });
      snackbar.appendChild(action);
    }
    document.body.appendChild(snackbar);
    if (!actionText) { setTimeout(function () { snackbar.remove(); }, 4000); }
  }

  function showConfirm(title, message, confirmText, cancelText, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = '<div class="confirm-dialog"><div class="confirm-icon">⚠️</div><div class="confirm-title">' + title + '</div><div class="confirm-message">' + message + '</div><div class="confirm-actions"><button class="btn btn-ghost btn-sm" id="confirm-cancel">' + (cancelText || 'Cancel') + '</button><button class="btn btn-danger btn-sm" id="confirm-ok">' + (confirmText || 'Delete') + '</button></div></div>';
    document.body.appendChild(overlay);
    document.getElementById('confirm-cancel').addEventListener('click', function () { overlay.remove(); });
    document.getElementById('confirm-ok').addEventListener('click', function () { overlay.remove(); if (onConfirm) onConfirm(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  }

  function showUpdateBanner(version, onUpdate) {
    const existing = document.querySelector('.update-banner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.className = 'update-banner';
    banner.innerHTML = '<span class="update-text">New version ' + version + ' available</span><span class="update-btn">Update</span>';
    document.body.appendChild(banner);
    banner.querySelector('.update-btn').addEventListener('click', function () {
      banner.remove();
      showToast('Downloading update...', 'success', 2000);
      if (onUpdate) onUpdate();
    });
    setTimeout(function () { banner.remove(); }, 10000);
  }

  function showOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (banner) banner.classList.add('show');
  }

  function hideOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (banner) banner.classList.remove('show');
  }

  function checkClipboard() {
    setTimeout(function () {
      try {
        navigator.clipboard.readText().then(function (text) {
          if (text && (text.includes('youtube.com') || text.includes('youtu.be') || text.includes('spotify.com'))) {
            showShareIntentToast(text);
          }
        }).catch(function () {});
      } catch (e) {}
    }, 2000);
  }

  function showShareIntentToast(url) {
    const toast = document.createElement('div');
    toast.className = 'share-intent-toast';
    const isSpotify = url.includes('spotify.com');
    toast.textContent = (isSpotify ? '🟢 Spotify' : '▶ YouTube') + ' link detected — tap to download';
    toast.addEventListener('click', function () {
      toast.remove();
      Router.navigate('download');
      setTimeout(function () {
        const searchInput = document.getElementById('search-input');
        if (searchInput) { searchInput.value = url; searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); }
      }, 300);
    });
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 5000);
  }

  function checkForUpdate() {
    setTimeout(function () {
      showUpdateBanner('1.0.1', function () { showToast('Update downloaded! Install now', 'success', 3000); });
    }, 10000);
  }

  function init() {
    window.addEventListener('online', function () { hideOfflineBanner(); showToast('Back online', 'success', 2000); });
    window.addEventListener('offline', function () { showOfflineBanner(); showToast('No internet connection', 'warning', 3000); });
    if (!navigator.onLine) showOfflineBanner();
    checkClipboard();
    checkForUpdate();
    console.log('[SystemUI] Initialized');
  }

  return { init, showToast, showSnackbar, showConfirm, showUpdateBanner };
})();

document.addEventListener('DOMContentLoaded', function () { SystemUI.init(); });
