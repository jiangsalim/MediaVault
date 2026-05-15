const HamburgerMenu = {
  init() {
    document.getElementById('btn-hamburger')?.addEventListener('click', () => this.toggle());
    this.createDrawer();
  },

  createDrawer() {
    if (document.getElementById('hamburger-drawer')) return;
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const themeIcon = theme === 'dark' ? '☀️' : '🌙';
    
    const drawer = document.createElement('div');
    drawer.id = 'hamburger-drawer';
    drawer.innerHTML = `
      <div class="drawer-overlay" onclick="HamburgerMenu.close()"></div>
      <div class="drawer-content">
        <div class="drawer-header">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none"><polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="#00C2BA" stroke-width="2.5" fill="none"/><polyline points="12,18 20,26 28,18" stroke="#00C2BA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          <div>
            <div style="font-weight:700;">MediaVault</div>
            <div style="font-size:12px;color:var(--color-text-tertiary);">Free Media Toolkit</div>
          </div>
        </div>
        <div class="drawer-menu">
          <button class="drawer-item" onclick="HamburgerMenu.goHome()">🏠 Home</button>
          <button class="drawer-item" onclick="HamburgerMenu.goDownloads()">⬇ Downloads</button>
          <button class="drawer-item" onclick="HamburgerMenu.goPlayer()">▶ Player</button>
          <button class="drawer-item" onclick="HamburgerMenu.goProfile()">👤 Profile</button>
          <div class="drawer-divider"></div>
          <button class="drawer-item" onclick="HamburgerMenu.openTool('statusSaver')">💬 WhatsApp Status Saver</button>
          <button class="drawer-item" onclick="HamburgerMenu.openTool('vault')">🔒 Private Vault</button>
          <button class="drawer-item" onclick="HamburgerMenu.openTool('cleaner')">🧹 Phone Cleaner</button>
          <div class="drawer-divider"></div>
          <button class="drawer-item" onclick="HamburgerMenu.toggleTheme()">${themeIcon} Theme</button>
          <button class="drawer-item" onclick="HamburgerMenu.rateApp()">⭐ Rate App</button>
          <button class="drawer-item" onclick="HamburgerMenu.shareApp()">📤 Share App</button>
          <a class="drawer-item" href="https://herman-software-website.vercel.app" target="_blank">🌐 HERMAN Software</a>
        </div>
        <div class="drawer-footer">
          <span style="font-size:12px;color:var(--color-text-tertiary);">v${CONFIG.APP_VERSION}</span>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
  },

  toggle() { document.getElementById('hamburger-drawer')?.classList.toggle('open'); },
  close() { document.getElementById('hamburger-drawer')?.classList.remove('open'); },
  goHome() { this.close(); Router.navigate('home'); },
  goDownloads() { this.close(); Router.navigate('downloads'); },
  goPlayer() { this.close(); Router.navigate('player'); },
  goProfile() { this.close(); Router.navigate('profile'); },
  openTool(t) { this.close(); if (typeof ToolsPage !== 'undefined') ToolsPage.openTool(t); },
  toggleTheme() {
    const c = document.documentElement.getAttribute('data-theme') || 'light';
    const n = c === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', n);
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, n);
    System.toast(`Theme: ${n === 'dark' ? 'Dark' : 'Light'}`);
    this.close();
  },
  rateApp() { System.toast('⭐ Rate us on the store!'); this.close(); },
  shareApp() { System.toast('📤 Share options coming soon'); this.close(); },
};
