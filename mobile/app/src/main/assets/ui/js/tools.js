var Tools = {
  _icons: {
    statusSaver: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    vault: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg>',
    cleaner: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    fileManager: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    trash: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    boost: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    battery: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>',
  },

  open: function(id) {
    if (id === 'statusSaver') this._statusSaver();
    else if (id === 'vault') this._vault();
    else if (id === 'cleaner') this._cleaner();
    else if (id === 'files') { if (typeof Router !== 'undefined') Router.go('downloads'); }
    else if (id === 'whatsappClean') this._whatsappClean();
    else if (id === 'photosClean') this._photosClean();
    else if (id === 'appUninstaller') this._appUninstaller();
    else if (id === 'storageManager') this._storageManager();
  },

  _statusSaver: function() {
    Sheet.show('<h3 style="font-size:16px;margin-bottom:8px;">WhatsApp Status Saver</h3><p style="font-size:13px;color:var(--text-tertiary);margin-bottom:16px;">Auto-save statuses from your contacts.</p><button onclick="Sheet.hide();Toast.show(\'Activated\')" style="width:100%;padding:12px;background:var(--accent);color:var(--accent-text);border:none;border-radius:8px;cursor:pointer;font-weight:600;">Save All Statuses</button><button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;margin-top:8px;">Cancel</button>');
  },

  _vault: function() {
    Sheet.show('<h3 style="font-size:16px;margin-bottom:8px;">Private Vault</h3><input type="password" placeholder="Enter 4-digit PIN" maxlength="4" style="width:100%;padding:14px;border:1px solid var(--border);border-radius:8px;text-align:center;font-size:24px;letter-spacing:8px;background:var(--bg);color:var(--text);margin-bottom:12px;"><button onclick="Sheet.hide();Toast.show(\'Unlocked\')" style="width:100%;padding:12px;background:var(--accent);color:var(--accent-text);border:none;border-radius:8px;cursor:pointer;font-weight:600;">Unlock</button><button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;margin-top:8px;">Cancel</button>');
  },

  _cleaner: function() {
    var self = this;
    var html = '<h3 style="font-size:16px;margin-bottom:12px;">Phone Cleaner</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">';
    [
      { icon: self._icons.trash, title: 'Junk Clean', size: '1.2 GB' },
      { icon: self._icons.boost, title: 'Boost', size: '2.1 GB free' },
      { icon: self._icons.battery, title: 'Battery', size: '85%' },
      { icon: self._icons.fileManager, title: 'Large Files', size: '340 MB' },
    ].forEach(function(item) {
      html += '<button onclick="Sheet.hide();Toast.show(\'Done\')" style="padding:14px;border:1px solid var(--border);border-radius:8px;background:var(--bg);cursor:pointer;text-align:center;"><div style="margin-bottom:8px;">' + item.icon + '</div><div style="font-weight:600;font-size:13px;">' + item.title + '</div><div style="font-size:11px;color:var(--text-tertiary);">' + item.size + '</div></button>';
    });
    html += '</div><button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;">Cancel</button>';
    Sheet.show(html);
  },

  _whatsappClean: function() {
    var html = '<h3 style="font-size:16px;margin-bottom:12px;">WhatsApp Clean</h3><p style="font-size:13px;color:var(--text-tertiary);margin-bottom:12px;">Total scanned: 2.4 GB</p><div style="display:grid;gap:8px;margin-bottom:12px;">';
    ['Images (1.2 GB)', 'Videos (800 MB)', 'Documents (250 MB)', 'Stickers (100 MB)', 'Voice Notes (50 MB)'].forEach(function(item) {
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--surface);border-radius:8px;"><span style="font-size:13px;">' + item + '</span><button onclick="Sheet.hide();Toast.show(\'Cleaned\')" style="background:var(--accent);color:var(--accent-text);border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Clean</button></div>';
    });
    html += '</div><button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;">Cancel</button>';
    Sheet.show(html);
  },

  _photosClean: function() {
    Sheet.show('<h3 style="font-size:16px;margin-bottom:12px;">Photos Clean</h3><p style="font-size:13px;color:var(--text-tertiary);margin-bottom:12px;">Found 156 photos (340 MB)</p><button onclick="Sheet.hide();Toast.show(\'Cleaned\')" style="width:100%;padding:12px;background:var(--accent);color:var(--accent-text);border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-bottom:8px;">Clean All</button><button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;">Cancel</button>');
  },

  _appUninstaller: function() {
    var apps = ['Old Games (450 MB)', 'Unused Editor (180 MB)', 'Trial App (95 MB)'];
    var html = '<h3 style="font-size:16px;margin-bottom:12px;">App Uninstaller</h3><div style="display:grid;gap:8px;margin-bottom:12px;">';
    apps.forEach(function(a) { html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--surface);border-radius:8px;"><span style="font-size:13px;">' + a + '</span><button onclick="Sheet.hide();Toast.show(\'Uninstalled\')" style="color:var(--error);background:none;border:none;cursor:pointer;">Uninstall</button></div>'; });
    html += '</div><button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;">Cancel</button>';
    Sheet.show(html);
  },

  _storageManager: function() {
    var html = '<h3 style="font-size:16px;margin-bottom:12px;">Storage Manager</h3><div style="background:var(--surface);border-radius:8px;padding:16px;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Total</span><span>64 GB</span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Used</span><span>48 GB (75%)</span></div><div style="display:flex;justify-content:space-between;"><span>Free</span><span>16 GB (25%)</span></div><div class="dl-progress" style="margin-top:12px;"><div class="dl-progress-fill" style="width:75%;"></div></div></div>';
    [{ label: 'Apps', size: '22 GB', color: '#4A90D9' }, { label: 'Media', size: '14 GB', color: '#E67E22' }, { label: 'Downloads', size: '8 GB', color: '#2D8A4E' }].forEach(function(item) {
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;"><div style="width:12px;height:12px;border-radius:3px;background:' + item.color + ';"></div><span style="flex:1;font-size:13px;">' + item.label + '</span><span style="font-size:13px;">' + item.size + '</span></div>';
    });
    html += '<button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;margin-top:8px;">Close</button>';
    Sheet.show(html);
  },
};
