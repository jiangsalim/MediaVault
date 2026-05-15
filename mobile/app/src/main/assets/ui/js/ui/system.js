const System = {
  init() {
    this.monitorNetwork();
    this.updateDownloadBadge();
  },

  // Network monitoring
  monitorNetwork() {
    const banner = document.getElementById('offline-banner') || this.createOfflineBanner();
    const update = () => {
      if (navigator.onLine) {
        banner.classList.remove('visible');
      } else {
        banner.classList.add('visible');
      }
    };
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
  },

  createOfflineBanner() {
    const banner = document.createElement('div');
    banner.id = 'offline-banner';
    banner.className = 'offline-banner';
    banner.textContent = '⚠ No internet connection';
    document.getElementById('app')?.prepend(banner);
    return banner;
  },

  // Toast notifications
  toast(message, duration = CONFIG.TOAST.SHORT) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Download badge
  updateDownloadBadge() {
    const queue = this.getDownloadQueue();
    const active = queue.filter(d => d.status === 'downloading').length;
    const completed = queue.filter(d => d.status === 'completed').length;
    const total = active + completed;

    ['download-badge', 'bottom-download-badge'].forEach(id => {
      const badge = document.getElementById(id);
      if (badge) {
        if (total > 0) {
          badge.textContent = total > 99 ? '99+' : total;
          badge.classList.add('visible');
        } else {
          badge.classList.remove('visible');
        }
      }
    });
  },

  getDownloadQueue() {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.DOWNLOAD_QUEUE) || '[]'); }
    catch { return []; }
  },

  saveDownloadQueue(queue) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.DOWNLOAD_QUEUE, JSON.stringify(queue));
    this.updateDownloadBadge();
  },

  // Format helpers
  formatDuration(seconds) {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + String(s).padStart(2, '0');
  },

  formatNumber(n) {
    if (!n) return '0';
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return n.toString();
  },

  formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
    return bytes.toFixed(1) + ' ' + units[i];
  },

  timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return 'Just now';
    if (m < 60) return m + 'm ago';
    if (h < 24) return h + 'h ago';
    if (d < 30) return d + 'd ago';
    return Math.floor(d / 30) + 'mo ago';
  },

  // API helper
  async apiGet(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${CONFIG.API_BASE_URL}${endpoint}${query ? '?' + query : ''}`;
    try {
      const res = await fetch(url);
      return await res.json();
    } catch (e) {
      console.error(`API Error: ${endpoint}`, e);
      return { success: false, data: { videos: [] } };
    }
  },

  // Bottom sheet
  showSheet(html) {
    document.getElementById('sheet-body').innerHTML = html;
    document.getElementById('sheet-overlay').classList.add('visible');
    document.getElementById('bottom-sheet').classList.add('visible');
  },

  hideSheet() {
    document.getElementById('sheet-overlay').classList.remove('visible');
    document.getElementById('bottom-sheet').classList.remove('visible');
  },
};

document.getElementById('sheet-overlay')?.addEventListener('click', () => System.hideSheet());
