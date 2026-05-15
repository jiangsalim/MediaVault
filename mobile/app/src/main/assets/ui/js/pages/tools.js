const ToolsPage = {
  openTool(id) {
    const actions = {
      statusSaver: () => {
        Router.navigate('home');
        System.toast('WhatsApp Status Saver — Auto-save enabled');
      },
      vault: () => {
        System.showSheet(`
          <h3 style="margin-bottom:var(--space-md);">🔒 Private Vault</h3>
          <p style="font-size:var(--font-size-sm);color:var(--color-text-tertiary);margin-bottom:var(--space-md);">Enter PIN to access vault</p>
          <input type="password" placeholder="Enter 4-digit PIN" maxlength="4" style="width:100%;padding:var(--space-md);border:1px solid var(--color-border);border-radius:var(--radius-sm);text-align:center;font-size:1.5rem;margin-bottom:var(--space-md);">
          <button onclick="System.hideSheet();System.toast('Vault unlocked')" style="width:100%;padding:var(--space-sm);background:var(--color-primary);color:white;border:none;border-radius:var(--radius-sm);cursor:pointer;">Unlock</button>
        `);
      },
      cleaner: () => {
        System.showSheet(`
          <h3 style="margin-bottom:var(--space-md);">🧹 Phone Cleaner</h3>
          <div style="text-align:center;padding:var(--space-xl);">
            <div style="font-size:3rem;animation:pulse 1s infinite;">🔄</div>
            <p style="margin-top:var(--space-md);">Scanning device...</p>
          </div>
          <div style="background:var(--color-background);border-radius:var(--radius-sm);padding:var(--space-md);margin-bottom:var(--space-sm);">
            <div style="display:flex;justify-content:space-between;"><span>Junk Files</span><span style="color:var(--color-error);">1.2 GB</span></div>
            <div style="display:flex;justify-content:space-between;"><span>Cache</span><span>340 MB</span></div>
            <div style="display:flex;justify-content:space-between;"><span>Temp Files</span><span>180 MB</span></div>
          </div>
          <button onclick="System.hideSheet();System.toast('Cleaned 1.7 GB')" style="width:100%;padding:var(--space-sm);background:var(--color-primary);color:white;border:none;border-radius:var(--radius-sm);cursor:pointer;">Clean Now</button>
          <button onclick="System.hideSheet()" style="width:100%;padding:var(--space-sm);border:none;background:var(--color-background);border-radius:var(--radius-sm);cursor:pointer;margin-top:var(--space-sm);">Cancel</button>
        `);
      },
      files: () => { Router.navigate('downloads'); },
    };
    if (actions[id]) actions[id]();
  },
};
