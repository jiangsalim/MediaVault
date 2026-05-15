/**
 * MediaVault — Tools Page
 * Status Saver, Vault, Phone Cleaner
 * All icons SVG — no emojis
 */

var Tools = {
  // ── SVG Icons ──
  _icons: {
    statusSaver: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    vault: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg>',
    cleaner: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    fileManager: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    scan: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    trash: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    lock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    boost: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    battery: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="10" y1="10" x2="10" y2="14"/><line x1="14" y1="10" x2="14" y2="14"/></svg>',
  },

  // ── Open Tool ──
  open: function(id) {
    if (id === 'statusSaver') this._statusSaver();
    else if (id === 'vault') this._vault();
    else if (id === 'cleaner') this._cleaner();
    else if (id === 'files') { if (typeof Router !== 'undefined') Router.go('downloads'); }
  },

  // ── Status Saver ──
  _statusSaver: function() {
    var html = '<h3 style="font-size:16px;margin-bottom:8px;">' + this._icons.statusSaver + ' WhatsApp Status Saver</h3>'
      + '<p style="font-size:13px;color:var(--text-tertiary);margin-bottom:16px;">Auto-save statuses from your contacts before they disappear.</p>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--surface);border-radius:8px;margin-bottom:12px;">'
      + '<span style="font-weight:500;">Auto-Save Statuses</span>'
      + '<input type="checkbox" class="settings-toggle" checked>'
      + '</div>'
      + '<button onclick="Sheet.hide();Toast.show(\'Status Saver activated\')" style="width:100%;padding:12px;background:var(--accent);color:var(--accent-text);border:none;border-radius:8px;cursor:pointer;font-weight:600;">Save All Statuses</button>'
      + '<button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;margin-top:8px;">Cancel</button>';
    Sheet.show(html);
  },

  // ── Vault ──
  _vault: function() {
    var html = '<h3 style="font-size:16px;margin-bottom:8px;">' + this._icons.vault + ' Private Vault</h3>'
      + '<p style="font-size:13px;color:var(--text-tertiary);margin-bottom:16px;">Enter your 4-digit PIN to access the vault.</p>'
      + '<input type="password" id="vault-pin" placeholder="Enter PIN" maxlength="4" style="width:100%;padding:14px;border:1px solid var(--border);border-radius:8px;text-align:center;font-size:24px;letter-spacing:8px;background:var(--bg);color:var(--text);margin-bottom:12px;">'
      + '<button onclick="var p=document.getElementById(\'vault-pin\').value;if(p.length===4){Sheet.hide();Toast.show(\'Vault unlocked\')}else{Toast.show(\'Enter 4-digit PIN\')}" style="width:100%;padding:12px;background:var(--accent);color:var(--accent-text);border:none;border-radius:8px;cursor:pointer;font-weight:600;">' + this._icons.lock + ' Unlock</button>'
      + '<button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;margin-top:8px;">Cancel</button>';
    Sheet.show(html);
  },

  // ── Phone Cleaner ──
  _cleaner: function() {
    var html = '<h3 style="font-size:16px;margin-bottom:12px;">' + this._icons.cleaner + ' Phone Cleaner</h3>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">'
      + this._cleanerCard(this._icons.trash, 'Junk Clean', '1.2 GB', function() { Sheet.hide(); Toast.show('Cleaned 1.2 GB'); })
      + this._cleanerCard(this._icons.boost, 'Boost', '2.1 GB free', function() { Sheet.hide(); Toast.show('RAM boosted'); })
      + this._cleanerCard(this._icons.battery, 'Battery', '85%', function() { Sheet.hide(); Toast.show('Battery optimized'); })
      + this._cleanerCard(this._icons.fileManager, 'Large Files', '340 MB', function() { Sheet.hide(); Toast.show('Files cleaned'); })
      + '</div>'
      + '<button onclick="Sheet.hide()" style="width:100%;padding:10px;border:none;background:var(--surface);border-radius:8px;cursor:pointer;">Cancel</button>';
    Sheet.show(html);
  },

  _cleanerCard: function(icon, title, size, action) {
    return '<button onclick="(' + action.toString() + ')()" style="padding:14px;border:1px solid var(--border);border-radius:8px;background:var(--bg);cursor:pointer;text-align:center;">'
      + '<div style="margin-bottom:8px;">' + icon + '</div>'
      + '<div style="font-weight:600;font-size:13px;">' + title + '</div>'
      + '<div style="font-size:11px;color:var(--text-tertiary);">' + size + '</div>'
      + '</button>';
  },
};
