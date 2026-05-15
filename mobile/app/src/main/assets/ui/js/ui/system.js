const System = {
  currentPlatform: 'all',

  init() {
    this.monitorNetwork();
    this.updateDownloadBadge();
    this.initPlatformTabs();
    this.initPasteButton();
    this.initVoiceSearch();
  },

  // Platform tabs
  initPlatformTabs() {
    document.querySelectorAll('#platform-tabs .tab-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#platform-tabs .tab-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentPlatform = chip.dataset.platform;
        if (typeof HomePage !== 'undefined') HomePage.filterByPlatform(this.currentPlatform);
      });
    });
  },

  // Paste URL button
  initPasteButton() {
    document.getElementById('btn-paste-url')?.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          const input = document.getElementById('search-input-main');
          if (input) { input.value = text; input.focus(); }
          this.toast('URL pasted from clipboard');
          // Auto-detect platform from URL
          if (text.includes('youtube.com') || text.includes('youtu.be')) this.selectPlatform('youtube');
          else if (text.includes('spotify.com')) this.selectPlatform('spotify');
          else if (text.includes('tiktok.com')) this.selectPlatform('tiktok');
          else if (text.includes('instagram.com')) this.selectPlatform('instagram');
          else if (text.includes('facebook.com')) this.selectPlatform('facebook');
        }
      } catch {
        this.toast('Clipboard access denied');
      }
    });
  },

  // Voice search
  initVoiceSearch() {
    document.getElementById('btn-voice-search')?.addEventListener('click', () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        this.toast('Voice search not supported');
        return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      this.toast('🎤 Listening...');
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('search-input-main');
        if (input) { input.value = transcript; input.focus(); }
        this.toast(`Heard: "${transcript}"`);
        // Auto search
        if (typeof HomePage !== 'undefined') HomePage.search(transcript);
      };
      recognition.onerror = () => this.toast('Voice recognition failed');
    });
  },

  selectPlatform(platform) {
    document.querySelectorAll('#platform-tabs .tab-chip').forEach(c => c.classList.remove('active'));
    const chip = document.querySelector(`#platform-tabs .tab-chip[data-platform="${platform}"]`);
    if (chip) chip.classList.add('active');
    this.currentPlatform = platform;
  },

  // Network monitoring
  monitorNetwork() {
    const banner = document.getElementById('offline-banner') || this.createOfflineBanner();
    const update = () => { banner.classList.toggle('visible', !navigator.onLine); };
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

  // Toast
  toast(message, duration = CONFIG.TOAST.SHORT) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('toast-out'); setTimeout(() => toast.remove(), 300); }, duration);
  },

  // Download badge
  updateDownloadBadge() {
    const queue = this.getDownloadQueue();
    const active = queue.filter(d => d.status === 'downloading' || d.status === 'pending').length;
    const total = active + queue.filter(d => d.status === 'completed').length;
    ['download-badge', 'bottom-download-badge'].forEach(id => {
      const badge = document.getElementById(id);
      if (badge) {
        if (total > 0) { badge.textContent = total > 99 ? '99+' : total; badge.classList.add('visible'); }
        else badge.classList.remove('visible');
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
  formatDuration(s) { if (!s) return '0:00'; const m = Math.floor(s/60), sec = Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); },
  formatNumber(n) { if (!n) return '0'; if (n>=1e9) return (n/1e9).toFixed(1)+'B'; if (n>=1e6) return (n/1e6).toFixed(1)+'M'; if (n>=1e3) return (n/1e3).toFixed(0)+'K'; return n.toString(); },
  formatFileSize(b) { if (!b) return '0 B'; const u=['B','KB','MB','GB']; let i=0; while(b>=1024&&i<u.length-1){b/=1024;i++;} return b.toFixed(1)+' '+u[i]; },
  timeAgo(d) { if(!d)return''; const diff=Date.now()-new Date(d).getTime(),m=Math.floor(diff/6e4),h=Math.floor(diff/36e5),day=Math.floor(diff/864e5); if(m<1)return'Just now';if(m<60)return m+'m ago';if(h<24)return h+'h ago';if(day<30)return day+'d ago';return Math.floor(day/30)+'mo ago'; },

  // API helper
  async apiGet(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${CONFIG.API_BASE_URL}${endpoint}${query ? '?' + query : ''}`;
    try { const res = await fetch(url); return await res.json(); }
    catch (e) { return { success: false, data: { videos: [] } }; }
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
