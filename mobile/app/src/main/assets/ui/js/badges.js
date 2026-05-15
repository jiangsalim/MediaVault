/**
 * MediaVault — Badge System
 * Tracks user actions and unlocks achievements
 */

var Badges = {
  stats: {
    downloads: 0,
    audio: 0,
    video: 0,
    searches: 0,
    darkDays: 0,
  },

  init: function() {
    try {
      var saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE.BADGES) || '{}');
      this.stats = Object.assign(this.stats, saved);
    } catch(e) {}
    this.trackDarkMode();
  },

  save: function() {
    localStorage.setItem(CONFIG.STORAGE.BADGES, JSON.stringify(this.stats));
  },

  track: function(action) {
    if (this.stats[action] !== undefined) {
      this.stats[action]++;
      this.save();
    }
  },

  trackDarkMode: function() {
    var theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      var today = new Date().toDateString();
      var last = localStorage.getItem('mv_dark_day');
      if (last !== today) {
        localStorage.setItem('mv_dark_day', today);
        this.stats.darkDays = (this.stats.darkDays || 0) + 1;
        this.save();
      }
    }
  },

  getBadges: function() {
    var s = this.stats;
    return [
      { 
        name: 'First Download', 
        unlocked: s.downloads >= 1,
        svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
      },
      { 
        name: 'Power User', 
        unlocked: s.downloads >= 10,
        svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
      },
      { 
        name: 'Music Lover', 
        unlocked: s.audio >= 50,
        svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'
      },
      { 
        name: 'Video Collector', 
        unlocked: s.video >= 50,
        svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>'
      },
      { 
        name: 'Explorer', 
        unlocked: s.searches >= 100,
        svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
      },
      { 
        name: 'Night Owl', 
        unlocked: s.darkDays >= 7,
        svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      },
      { 
        name: 'King', 
        unlocked: s.downloads >= 100,
        svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
      },
      { 
        name: 'Early Adopter', 
        unlocked: true,
        svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
      },
    ];
  },
};
