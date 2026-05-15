const ToolsPage = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
      <div class="section-header"><span class="section-title">🛠 Tools</span></div>
      <div style="padding:var(--space-md);display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-md);">
        ${this.toolCard('💬', 'WhatsApp Status Saver', 'Save statuses before they disappear', 'statusSaver')}
        ${this.toolCard('🔒', 'Private Vault', 'PIN-protected file storage', 'vault')}
        ${this.toolCard('🧹', 'Phone Cleaner', 'Free up device space', 'cleaner')}
        ${this.toolCard('📂', 'File Manager', 'Browse downloaded files', 'files')}
      </div>`;
  },

  toolCard(icon, title, desc, id) {
    return `<div class="video-card" onclick="ToolsPage.openTool('${id}')" style="text-align:center;padding:var(--space-md);">
      <div style="font-size:2rem;margin-bottom:var(--space-sm);">${icon}</div>
      <div class="card-title" style="margin-bottom:4px;">${title}</div>
      <div class="card-meta" style="justify-content:center;">${desc}</div>
    </div>`;
  },

  openTool(id) {
    const actions = {
      statusSaver: () => System.toast('Opening WhatsApp Status Saver...'),
      vault: () => System.toast('Opening Private Vault...'),
      cleaner: () => System.toast('Scanning device...'),
      files: () => {
        Router.navigate('downloads');
        System.toast('Opening file manager');
      },
    };
    if (actions[id]) actions[id]();
  },
};
