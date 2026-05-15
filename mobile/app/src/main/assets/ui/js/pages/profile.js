const ProfilePage = {
  load() {
    this.render();
  },

  render() {
    const container = document.getElementById('profile-content');
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const queue = System.getDownloadQueue();
    const completed = queue.filter(d => d.status === 'completed').length;

    container.innerHTML = `
      <div style="text-align:center;padding:var(--space-xl) var(--space-md);">
        <div style="width:80px;height:80px;border-radius:50%;background:var(--color-primary-dark);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-md);">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="#00C2BA" stroke-width="2.5" fill="none"/><polyline points="12,18 20,26 28,18" stroke="#00C2BA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </div>
        <h2 style="font-size:var(--font-size-xl);font-weight:700;color:var(--color-text-primary);">MediaVault</h2>
        <p style="font-size:var(--font-size-sm);color:var(--color-text-tertiary);">v${CONFIG.APP_VERSION}</p>
      </div>

      <div style="padding:var(--space-md);">
        <div class="card-base" style="background:var(--color-surface);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);">
          ${this.settingRow('📥', 'Downloads Completed', completed.toString())}
          ${this.settingRow('🎨', 'Theme', theme === 'dark' ? 'Dark' : 'Light', () => this.toggleTheme())}
          ${this.settingRow('🌐', 'API Status', 'Connected')}
          ${this.settingRow('ℹ️', 'About', 'Free Media Toolkit')}
        </div>
      </div>

      <div style="padding:0 var(--space-md);text-align:center;margin-top:var(--space-lg);">
        <p style="font-size:var(--font-size-xs);color:var(--color-text-tertiary);">Built by <a href="https://herman-software-website.vercel.app" target="_blank" style="color:var(--color-primary);">HERMAN Software Solutions</a></p>
      </div>
    `;
  },

  settingRow(icon, label, value, action) {
    return `<div class="setting-row" style="display:flex;align-items:center;padding:var(--space-md);border-bottom:1px solid var(--color-divider);${action ? 'cursor:pointer' : ''}" ${action ? `onclick="(${action.toString()})()"` : ''}>
      <span style="font-size:1.25rem;margin-right:var(--space-md);">${icon}</span>
      <span style="flex:1;font-size:var(--font-size-sm);font-weight:500;">${label}</span>
      <span style="font-size:var(--font-size-sm);color:var(--color-text-tertiary);">${value}</span>
      ${action ? '<span style="margin-left:var(--space-sm);color:var(--color-text-tertiary);">›</span>' : ''}
    </div>`;
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, next);
    System.toast(`Theme: ${next === 'dark' ? 'Dark' : 'Light'} mode`);
    this.render();
  },
};
