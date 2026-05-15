const HamburgerMenu = {
  open: false,

  init() {
    document.getElementById('btn-hamburger')?.addEventListener('click', () => this.toggle());
    this.createDrawer();
  },

  createDrawer() {
    // Create drawer if not exists
    if (document.getElementById('hamburger-drawer')) return;
    
    const drawer = document.createElement('div');
    drawer.id = 'hamburger-drawer';
    drawer.className = 'hamburger-drawer';
    drawer.innerHTML = `
      <div class="drawer-overlay" onclick="HamburgerMenu.close()"></div>
      <div class="drawer-content">
        <div class="drawer-header">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none"><polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="#00C2BA" stroke-width="2.5" fill="none"/><polyline points="12,18 20,26 28,18" stroke="#00C2BA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          <div>
            <div style="font-weight:700;font-size:var(--font-size-lg);">MediaVault</div>
            <div style="font-size:var(--font-size-xs);color:var(--color-text-tertiary);">Free Media Toolkit</div>
          </div>
        </div>
        <div class="drawer-menu">
          <button class="drawer-item" onclick="HamburgerMenu.navigate('home')">🏠 Home</button>
          <button class="drawer-item" onclick="HamburgerMenu.navigate('downloads')">⬇ Downloads</button>
          <button class="drawer-item" onclick="HamburgerMenu.navigate('profile')">👤 Profile</button>
          <div class="drawer-divider"></div>
          <button class="drawer-item" onclick="HamburgerMenu.openTool('statusSaver')">💬 WhatsApp Status Saver</button>
          <button class="drawer-item" onclick="HamburgerMenu.openTool('vault')">🔒 Private Vault</button>
          <button class="drawer-item" onclick="HamburgerMenu.openTool('cleaner')">🧹 Phone Cleaner</button>
          <button class="drawer-item" onclick="HamburgerMenu.openTool('files')">📂 File Manager</button>
          <div class="drawer-divider"></div>
          <button class="drawer-item" onclick="HamburgerMenu.toggleTheme()">${this.getThemeIcon()} Theme</button>
  rateApp() { System.toast("Opening store..."); this.close(); },
  shareApp() { System.toast("Share options coming soon"); this.close(); },
          <a class="drawer-item" href="https://herman-software-website.vercel.app" target="_blank">🌐 HERMAN Software</a>
          <div class="drawer-divider"></div>
          <button class="drawer-item" onclick="HamburgerMenu.rateApp()">⭐ Rate App</button>
          <button class="drawer-item" onclick="HamburgerMenu.shareApp()">📤 Share App</button>
        </div>
        <div class="drawer-footer">
          <span style="font-size:var(--font-size-xs);color:var(--color-text-tertiary);">v${CONFIG.APP_VERSION}</span>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
  },

  toggle() {
    this.open ? this.close() : this.openDrawer();
  },

  openDrawer() {
    this.open = true;
    document.getElementById('hamburger-drawer').classList.add('open');
  },

  close() {
    this.open = false;
    document.getElementById('hamburger-drawer').classList.remove('open');
  },

  navigate(page) {
    this.close();
    Router.navigate(page);
  },

  openTool(tool) {
    this.close();
    if (typeof ToolsPage !== 'undefined') ToolsPage.openTool(tool);
  },

  toggleTheme() {
  rateApp() { System.toast("Opening store..."); this.close(); },
  shareApp() { System.toast("Share options coming soon"); this.close(); },
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, next);
    System.toast(`Theme: ${next === 'dark' ? 'Dark' : 'Light'}`);
    this.close();
    // Update icon
    this.createDrawer();
  },

  getThemeIcon() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    return theme === 'dark' ? '☀️' : '🌙';
  },
};
