/**
 * MediaVault — Profile & Settings Page
 * All icons are SVG — no emojis
 */

var Profile = {
  settings: {
    path: '/storage/emulated/0/MediaVault',
    maxConcurrent: 2,
    speedLimit: false,
    mobileData: true,
    autoSync: false,
  },

  // ── SVG Icons ──
  _icons: {
    folder: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    download: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    wifi: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
    zap: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    refresh: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/></svg>',
    message: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    share: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    chevron: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    external: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  },

  // ── Load ──
  load: function() {
    try {
      var saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE.SETTINGS) || '{}');
      this.settings = Object.assign(this.settings, saved);
    } catch(e) {}
    this.render();
  },

  save: function() {
    localStorage.setItem(CONFIG.STORAGE.SETTINGS, JSON.stringify(this.settings));
  },

  // ── Toggle Setting ──
  toggleSetting: function(key) {
    this.settings[key] = !this.settings[key];
    this.save();
    this.render();
  },

  // ── Render ──
  render: function() {
    var page = document.getElementById('page-profile');
    var self = this;
    var theme = document.documentElement.getAttribute('data-theme') || 'light';
    var q = [];
    try { q = JSON.parse(localStorage.getItem(CONFIG.STORAGE.QUEUE) || '[]'); } catch(e) {}
    var completed = q.filter(function(d) { return d.status === 'completed'; }).length;

    var html = '';

    // Header
    html += '<div style="text-align:center;padding:32px 16px 24px;">'
      + '<div style="width:72px;height:72px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">'
      + '<svg width="36" height="36" viewBox="0 0 40 40"><polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="var(--accent-text)" stroke-width="2.5" fill="none"/><polyline points="12,18 20,26 28,18" stroke="var(--accent-text)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
      + '</div>'
      + '<h2 style="font-size:20px;font-weight:700;">MediaVault</h2>'
      + '<p style="font-size:13px;color:var(--text-tertiary);">v' + CONFIG.APP_VERSION + ' · ' + completed + ' downloads</p>'
      + '</div>';

    // Download Settings
    html += '<div class="settings-section">';
    html += '<div class="settings-label">Download Settings</div>';
    html += self._row(self._icons.folder, 'Download Path', self.settings.path);
    html += self._row(self._icons.download, 'Max Concurrent', self.settings.maxConcurrent.toString());
    html += self._toggle(self._icons.zap, 'Speed Limit', self.settings.speedLimit, 'speedLimit');
    html += self._toggle(self._icons.phone, 'Mobile Data', self.settings.mobileData, 'mobileData');
    html += self._toggle(self._icons.refresh, 'Auto-Sync', self.settings.autoSync, 'autoSync');
    html += '</div>';

    // Appearance
    html += '<div class="settings-section">';
    html += '<div class="settings-label">Appearance</div>';
    html += self._themeRow(self._icons.sun, 'Light', 'light', theme);
    html += self._themeRow(self._icons.moon, 'Dark', 'dark', theme);
    html += '</div>';

    // Notification Settings
    html += '<div class="settings-section">';
    html += '<div class="settings-label">Notifications</div>';
    html += self._toggle(self._icons.bell, 'Download Progress', true, 'notifProgress');
    html += self._toggle(self._icons.bell, 'Download Complete', true, 'notifComplete');
    html += self._toggle(self._icons.bell, 'Recommended Content', false, 'notifRecommend');
    html += '</div>';

    // Region & Language
    html += '<div class="settings-section">';
    html += '<div class="settings-label">Region & Language</div>';
    html += self._row(self._icons.globe, 'Region', 'Uganda');
    html += self._row(self._icons.globe, 'Language', 'English');
    html += '</div>';

    // Download Streak
    var streak = parseInt(localStorage.getItem('mv_streak') || '0');
    html += '<div class="settings-section">';
    html += '<div class="settings-label">Download Streak</div>';
    html += '<div style="padding:16px;text-align:center;">';
    html += '<div style="font-size:40px;margin-bottom:8px;">' + (streak > 0 ? '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' : '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>') + '</div>';
    html += '<div style="font-size:28px;font-weight:700;">' + streak + ' days</div>';
    html += '<div style="font-size:12px;color:var(--text-tertiary);">Keep downloading daily!</div>';
    html += '</div></div>';

    // Tools
    html += '<div class="settings-section">';
    html += '<div class="settings-label">Tools</div>';
    html += self._actionRow(self._icons.message, 'WhatsApp Status Saver', function() { Toast.show('Opening...'); });
    html += self._actionRow(self._icons.folder, 'Private Vault', function() { Toast.show('Opening...'); });
    html += self._actionRow(self._icons.refresh, 'Phone Cleaner', function() { Toast.show('Opening...'); });
    html += '</div>';

    // About
    html += '<div class="settings-section">';
    html += '<div class="settings-label">About</div>';
    html += self._row(self._icons.info, 'Version', CONFIG.APP_VERSION);
    html += self._actionRow(self._icons.star, 'Rate App', function() { Toast.show('⭐ Rate us!'); });
    html += self._actionRow(self._icons.share, 'Share App', function() { Toast.show('Share coming soon'); });
    html += self._linkRow(self._icons.external, 'HERMAN Software', 'https://herman-software-website.vercel.app');
    html += '</div>';

    // Badges
    if (typeof Badges !== 'undefined') {
      var badges = Badges.getBadges();
      var unlocked = badges.filter(function(b) { return b.unlocked; }).length;
      html += '<div class="settings-section">';
      html += '<div class="settings-label">Badges (' + unlocked + '/' + badges.length + ')</div>';
      html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px;">';
      badges.forEach(function(b) {
        html += '<div style="text-align:center;opacity:' + (b.unlocked ? '1' : '0.3') + ';">'
          + '<div style="margin-bottom:4px;">' + b.svg + '</div>'
          + '<div style="font-size:10px;font-weight:600;">' + b.name + '</div>'
          + '</div>';
      });
      html += '</div></div>';
    }

    // Feedback
    html += '<div class="settings-section" style="margin-bottom:24px;">';
    html += '<div class="settings-label">Feedback</div>';
    html += '<div style="padding:12px 16px;">';
    html += '<textarea id="feedback-text" placeholder="Tell us what you think..." style="width:100%;height:80px;border:1px solid var(--border);border-radius:8px;padding:8px;font-family:var(--font);font-size:14px;resize:vertical;background:var(--bg);color:var(--text);"></textarea>';
    html += '<button onclick="Profile.sendFeedback()" style="width:100%;margin-top:8px;padding:10px;background:var(--accent);color:var(--accent-text);border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">Send Feedback</button>';
    html += '</div></div>';

    // Footer
    html += '<div style="text-align:center;padding:16px;font-size:12px;color:var(--text-tertiary);">Built by HERMAN Software Solutions</div>';

    page.innerHTML = html;
  },

  sendFeedback: function() {
    var text = document.getElementById('feedback-text').value;
    if (text && text.trim()) {
      Toast.show('Feedback sent. Thank you!');
      document.getElementById('feedback-text').value = '';
    } else {
      Toast.show('Please write something');
    }
  },

  // ── Row Helpers ──
  _row: function(icon, label, value) {
    return '<div class="settings-row"><span>' + icon + ' ' + label + '</span><span>' + value + '</span></div>';
  },

  _actionRow: function(icon, label, action) {
    return '<div class="settings-row" onclick="(' + action.toString() + ')()"><span>' + icon + ' ' + label + '</span><span>' + this._icons.chevron + '</span></div>';
  },

  _linkRow: function(icon, label, href) {
    return '<a class="settings-row" href="' + href + '" target="_blank" style="text-decoration:none;"><span>' + icon + ' ' + label + '</span><span>' + this._icons.external + '</span></a>';
  },

  _toggle: function(icon, label, value, key) {
    var self = this;
    var id = 'toggle-' + key;
    return '<div class="settings-row" onclick="Profile.toggleSetting(\'' + key + '\')"><span>' + icon + ' ' + label + '</span><input type="checkbox" class="settings-toggle" id="' + id + '" ' + (value ? 'checked' : '') + '></div>';
  },

  _themeRow: function(icon, label, theme, current) {
    return '<div class="settings-row" onclick="(function(){document.documentElement.setAttribute(\'data-theme\',\'' + theme + '\');localStorage.setItem(\'' + CONFIG.STORAGE.THEME + '\',\'' + theme + '\');Profile.render();})()"><span>' + icon + ' ' + label + '</span><span>' + (theme === current ? this._icons.check : '') + '</span></div>';
  },
};
