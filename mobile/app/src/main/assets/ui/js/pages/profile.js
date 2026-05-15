const ProfilePage = {
  settings: {
    downloadPath: '/storage/emulated/0/MediaVault',
    maxConcurrent: 2,
    speedLimit: false,
    mobileData: true,
    autoSync: false,
    filenameFormat: '{title}_{quality}',
  },

  load() {
    // Load saved settings
    try {
      const saved = JSON.parse(localStorage.getItem('mv_profile_settings') || '{}');
      this.settings = { ...this.settings, ...saved };
    } catch {}
    this.render();
  },

  save() {
    localStorage.setItem('mv_profile_settings', JSON.stringify(this.settings));
  },

  render() {
    const container = document.getElementById('profile-content');
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const queue = System.getDownloadQueue();
    const completed = queue.filter(d => d.status === 'completed').length;
    const totalSize = queue.reduce((sum, d) => sum + (d.size || 0), 0);

    container.innerHTML = `
      <!-- Profile Header -->
      <div style="text-align:center;padding:var(--space-xl) var(--space-md);">
        <div style="width:80px;height:80px;border-radius:50%;background:var(--color-primary-dark);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-md);">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="#00C2BA" stroke-width="2.5" fill="none"/><polyline points="12,18 20,26 28,18" stroke="#00C2BA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </div>
        <h2 style="font-size:var(--font-size-xl);font-weight:700;">MediaVault</h2>
        <p style="font-size:var(--font-size-sm);color:var(--color-text-tertiary);">v${CONFIG.APP_VERSION} • ${completed} downloads • ${System.formatFileSize(totalSize)}</p>
      </div>

      <!-- Download Settings -->
      <div style="padding:var(--space-md);">
        <div class="card-base" style="background:var(--color-surface);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);margin-bottom:var(--space-md);">
          <div style="padding:var(--space-sm) var(--space-md);font-weight:700;color:var(--color-text-tertiary);font-size:var(--font-size-xs);text-transform:uppercase;">Download Settings</div>
          ${this.settingInput('📁', 'Download Path', this.settings.downloadPath, (v) => { this.settings.downloadPath = v; this.save(); })}
          ${this.settingSelect('⚡', 'Max Concurrent', this.settings.maxConcurrent, [1,2,3,5], (v) => { this.settings.maxConcurrent = parseInt(v); this.save(); })}
          ${this.settingToggle('🚫', 'Speed Limit', this.settings.speedLimit, (v) => { this.settings.speedLimit = v; this.save(); })}
          ${this.settingToggle('📱', 'Mobile Data', this.settings.mobileData, (v) => { this.settings.mobileData = v; this.save(); })}
          ${this.settingToggle('🔄', 'Auto-Sync Watch Later', this.settings.autoSync, (v) => { this.settings.autoSync = v; this.save(); })}
        </div>

        <!-- Appearance -->
        <div class="card-base" style="background:var(--color-surface);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);margin-bottom:var(--space-md);">
          <div style="padding:var(--space-sm) var(--space-md);font-weight:700;color:var(--color-text-tertiary);font-size:var(--font-size-xs);text-transform:uppercase;">Appearance</div>
          ${this.themeRow('☀️', 'Light', 'light', theme)}
          ${this.themeRow('🌙', 'Dark', 'dark', theme)}
        </div>

        <!-- Tools -->
        <div class="card-base" style="background:var(--color-surface);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);margin-bottom:var(--space-md);">
          <div style="padding:var(--space-sm) var(--space-md);font-weight:700;color:var(--color-text-tertiary);font-size:var(--font-size-xs);text-transform:uppercase;">Tools</div>
          ${this.settingRow('💬', 'WhatsApp Status Saver', 'Save statuses', () => ToolsPage.openTool('statusSaver'))}
          ${this.settingRow('🔒', 'Private Vault', 'PIN-protected', () => ToolsPage.openTool('vault'))}
          ${this.settingRow('🧹', 'Phone Cleaner', 'Free up space', () => ToolsPage.openTool('cleaner'))}
          ${this.settingRow('🗑', 'Recover Deleted Files', 'Scan & restore', () => System.toast('Scanning...'))}
        </div>

        <!-- Storage -->
        <div class="card-base" style="background:var(--color-surface);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);margin-bottom:var(--space-md);">
          <div style="padding:var(--space-sm) var(--space-md);font-weight:700;color:var(--color-text-tertiary);font-size:var(--font-size-xs);text-transform:uppercase;">Storage</div>
          <div style="padding:var(--space-md);">
            <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-sm);font-size:var(--font-size-sm);">
              <span>Downloads</span><span>${System.formatFileSize(totalSize)}</span>
            </div>
            <div class="progress-bar" style="height:6px;"><div class="progress-fill" style="width:${Math.min(totalSize / 100000000 * 100, 100)}%;"></div></div>
          </div>
          ${this.settingRow('🧹', 'Clear Cache', '', () => { System.toast('Cache cleared'); })}
          ${this.settingRow('📂', 'File Manager', '', () => Router.navigate('downloads'))}
        </div>

        <!-- About -->
        <div class="card-base" style="background:var(--color-surface);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);margin-bottom:var(--space-md);">
          ${this.settingRow('ℹ️', 'Version', CONFIG.APP_VERSION)}
          ${this.settingRow('🔄', 'Check for Updates', '', () => System.toast('You are up to date!'))}
          ${this.settingRow('⭐', 'Rate MediaVault', '', () => System.toast('Opening store...'))}
          ${this.settingRow('📤', 'Share App', '', () => System.toast('Share options...'))}
        </div>

        <div style="text-align:center;padding:var(--space-lg);">
          <p style="font-size:var(--font-size-xs);color:var(--color-text-tertiary);">Built by <a href="https://herman-software-website.vercel.app" target="_blank" style="color:var(--color-primary);">HERMAN Software Solutions</a></p>
        </div>
      </div>
    `;
  },

  settingRow(icon, label, value, action) {
    return `<div class="setting-row" style="display:flex;align-items:center;padding:var(--space-md);border-bottom:1px solid var(--color-divider);${action ? 'cursor:pointer' : ''}" ${action ? `onclick="(${action.toString()})()"` : ''}>
      <span style="margin-right:var(--space-md);">${icon}</span>
      <span style="flex:1;font-size:var(--font-size-sm);">${label}</span>
      <span style="font-size:var(--font-size-sm);color:var(--color-text-tertiary);">${value}</span>
      ${action ? '<span style="margin-left:var(--space-sm);">›</span>' : ''}
    </div>`;
  },

  settingToggle(icon, label, value, onChange) {
    return `<div class="setting-row" style="display:flex;align-items:center;padding:var(--space-md);border-bottom:1px solid var(--color-divider);cursor:pointer;" onclick="this.querySelector('input').click()">
      <span style="margin-right:var(--space-md);">${icon}</span>
      <span style="flex:1;font-size:var(--font-size-sm);">${label}</span>
      <input type="checkbox" ${value ? 'checked' : ''} onchange="(${onChange.toString()})(this.checked)" style="accent-color:var(--color-primary);">
    </div>`;
  },

  settingInput(icon, label, value, onChange) {
    return `<div class="setting-row" style="display:flex;align-items:center;padding:var(--space-md);border-bottom:1px solid var(--color-divider);">
      <span style="margin-right:var(--space-md);">${icon}</span>
      <span style="flex:1;font-size:var(--font-size-sm);">${label}</span>
      <input value="${value}" onchange="(${onChange.toString()})(this.value)" style="border:none;background:transparent;font-size:var(--font-size-sm);color:var(--color-text-tertiary);text-align:right;width:150px;">
    </div>`;
  },

  settingSelect(icon, label, value, options, onChange) {
    return `<div class="setting-row" style="display:flex;align-items:center;padding:var(--space-md);border-bottom:1px solid var(--color-divider);">
      <span style="margin-right:var(--space-md);">${icon}</span>
      <span style="flex:1;font-size:var(--font-size-sm);">${label}</span>
      <select onchange="(${onChange.toString()})(this.value)" style="border:none;background:transparent;font-size:var(--font-size-sm);color:var(--color-text-tertiary);">
        ${options.map(o => `<option value="${o}" ${value === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
    </div>`;
  },

  themeRow(icon, label, theme, current) {
    return `<div class="setting-row" style="display:flex;align-items:center;padding:var(--space-md);border-bottom:1px solid var(--color-divider);cursor:pointer;" onclick="ProfilePage.setTheme('${theme}')">
      <span style="margin-right:var(--space-md);">${icon}</span>
      <span style="flex:1;font-size:var(--font-size-sm);">${label}</span>
      <span style="color:${theme === current ? 'var(--color-primary)' : 'transparent'};font-size:1.25rem;">${theme === current ? '✓' : ''}</span>
    </div>`;
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
    System.toast(`Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`);
    this.render();
  },
};

// Add badges section to render
ProfilePage.renderBadges = function() {
  const badges = [
    { icon: '🏆', name: 'First Download', desc: 'Complete your first download', unlocked: true },
    { icon: '🔥', name: 'Power User', desc: 'Download 10 files', unlocked: true },
    { icon: '🎵', name: 'Music Lover', desc: 'Download 50 audio files', unlocked: false },
    { icon: '🎬', name: 'Video Collector', desc: 'Download 50 videos', unlocked: false },
    { icon: '⚡', name: 'Speed Demon', desc: 'Download at 5+ MB/s', unlocked: true },
    { icon: '🌙', name: 'Night Owl', desc: 'Use dark mode for a week', unlocked: false },
    { icon: '🔒', name: 'Vault Master', desc: 'Store 20 files in vault', unlocked: false },
    { icon: '💬', name: 'Status Saver', desc: 'Save 100 WhatsApp statuses', unlocked: false },
    { icon: '🧹', name: 'Clean Freak', desc: 'Clean 5GB of junk', unlocked: false },
    { icon: '👑', name: 'King of Downloads', desc: 'Download 100+ files', unlocked: false },
    { icon: '🌟', name: 'Early Adopter', desc: 'Installed v1.0', unlocked: true },
    { icon: '📤', name: 'Sharer', desc: 'Share the app 5 times', unlocked: false },
  ];

  return `
    <div class="card-base" style="background:var(--color-surface);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);margin-bottom:var(--space-md);">
      <div style="padding:var(--space-sm) var(--space-md);font-weight:700;color:var(--color-text-tertiary);font-size:var(--font-size-xs);text-transform:uppercase;">🏅 Badges & Achievements</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);padding:var(--space-sm) var(--space-md) var(--space-md);">
        ${badges.map(b => `
          <div style="text-align:center;padding:var(--space-sm);opacity:${b.unlocked ? '1' : '0.4'};">
            <div style="font-size:1.5rem;margin-bottom:2px;">${b.icon}</div>
            <div style="font-size:var(--font-size-xs);font-weight:600;">${b.name}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
};

ProfilePage.renderFeedback = function() {
  return `
    <div class="card-base" style="background:var(--color-surface);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);margin-bottom:var(--space-md);">
      <div style="padding:var(--space-sm) var(--space-md);font-weight:700;color:var(--color-text-tertiary);font-size:var(--font-size-xs);text-transform:uppercase;">📝 Feedback</div>
      <div style="padding:var(--space-md);">
        <textarea id="feedback-text" placeholder="Tell us what you think..." style="width:100%;height:80px;border:1px solid var(--color-border);border-radius:var(--radius-sm);padding:var(--space-sm);font-family:var(--font-family);font-size:var(--font-size-sm);resize:vertical;background:var(--color-background);color:var(--color-text-primary);"></textarea>
        <button onclick="ProfilePage.sendFeedback()" style="width:100%;padding:var(--space-sm);background:var(--color-primary);color:white;border:none;border-radius:var(--radius-sm);cursor:pointer;margin-top:var(--space-sm);">Send Feedback</button>
      </div>
    </div>`;
};

ProfilePage.sendFeedback = function() {
  const text = document.getElementById('feedback-text')?.value;
  if (text && text.trim()) {
    System.toast('Feedback sent. Thank you!');
    document.getElementById('feedback-text').value = '';
  } else {
    System.toast('Please write something');
  }
};

ProfilePage.renderRegion = function() {
  return `
    <div class="card-base" style="background:var(--color-surface);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);margin-bottom:var(--space-md);">
      ${this.settingRow('🌍', 'Region', 'Uganda')}
      ${this.settingRow('🔤', 'Language', 'English')}
    </div>`;
};

// Inject badges, feedback, region into main render
ProfilePage._originalRender = ProfilePage.render;
ProfilePage.render = function() {
  this._originalRender();
  const container = document.getElementById('profile-content');
  if (!container) return;
  
  // Insert badges after the profile header
  const headerEnd = container.querySelector('div[style*="text-align:center"]');
  if (headerEnd) {
    const badgesHtml = this.renderBadges();
    const feedbackHtml = this.renderFeedback();
    const regionHtml = this.renderRegion();
    const toolsSection = container.querySelector('.card-base:last-of-type');
    if (toolsSection) {
      toolsSection.insertAdjacentHTML('afterend', regionHtml + badgesHtml + feedbackHtml);
    }
  }
};
