const BadgeSystem = {
  // Track user stats
  stats: {
    downloads: 0,
    audioDownloads: 0,
    videoDownloads: 0,
    searches: 0,
    darkModeDays: 0,
    vaultFiles: 0,
    statusSaved: 0,
    junkCleaned: 0,
    appShared: 0,
  },

  init() {
    try {
      const saved = JSON.parse(localStorage.getItem('mv_badge_stats') || '{}');
      this.stats = { ...this.stats, ...saved };
    } catch {}
    this.trackDarkMode();
  },

  save() {
    localStorage.setItem('mv_badge_stats', JSON.stringify(this.stats));
  },

  track(action, count = 1) {
    const keys = {
      download: 'downloads',
      audioDownload: 'audioDownloads',
      videoDownload: 'videoDownloads',
      search: 'searches',
      vaultAdd: 'vaultFiles',
      statusSave: 'statusSaved',
      junkClean: 'junkCleaned',
      appShare: 'appShared',
    };
    const key = keys[action];
    if (key) {
      this.stats[key] += count;
      this.save();
      this.checkUnlocks();
    }
  },

  trackDarkMode() {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      const today = new Date().toDateString();
      const lastDay = localStorage.getItem('mv_dark_last_day');
      if (lastDay !== today) {
        const days = parseInt(localStorage.getItem('mv_dark_days') || '0') + 1;
        localStorage.setItem('mv_dark_days', days.toString());
        localStorage.setItem('mv_dark_last_day', today);
        this.stats.darkModeDays = days;
        this.save();
      }
    }
  },

  getBadges() {
    const s = this.stats;
    return [
      { icon: '🏆', name: 'First Download', unlocked: s.downloads >= 1 },
      { icon: '🔥', name: 'Power User', unlocked: s.downloads >= 10 },
      { icon: '🎵', name: 'Music Lover', unlocked: s.audioDownloads >= 50 },
      { icon: '🎬', name: 'Video Collector', unlocked: s.videoDownloads >= 50 },
      { icon: '🔍', name: 'Explorer', unlocked: s.searches >= 100 },
      { icon: '🌙', name: 'Night Owl', unlocked: s.darkModeDays >= 7 },
      { icon: '🔒', name: 'Vault Master', unlocked: s.vaultFiles >= 20 },
      { icon: '💬', name: 'Status Saver', unlocked: s.statusSaved >= 100 },
      { icon: '🧹', name: 'Clean Freak', unlocked: s.junkCleaned >= 5 },
      { icon: '👑', name: 'King of Downloads', unlocked: s.downloads >= 100 },
      { icon: '🌟', name: 'Early Adopter', unlocked: true },
      { icon: '📤', name: 'Sharer', unlocked: s.appShared >= 5 },
    ];
  },

  checkUnlocks() {
    const badges = this.getBadges();
    const newlyUnlocked = badges.filter(b => b.unlocked && !this._previouslyUnlocked?.has(b.name));
    if (newlyUnlocked.length > 0 && this._previouslyUnlocked) {
      newlyUnlocked.forEach(b => System.toast(`🏅 Badge unlocked: ${b.name}!`));
    }
    this._previouslyUnlocked = new Set(badges.filter(b => b.unlocked).map(b => b.name));
  },
};
