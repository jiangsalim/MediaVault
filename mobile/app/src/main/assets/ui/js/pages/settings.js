const SettingsPage = (function () {
  'use strict';
  let settingsContent;
  let currentView = 'main';

  const settingsState = {
    downloadPath: '/storage/emulated/0/MediaVault/download',
    maxTasksWifi: 10,
    maxTasksMobile: 10,
    speedLimit: 'Unlimited',
    mobileData: true,
    autoSync: false,
    scheduleEnabled: false,
    scheduleStart: '02:00',
    scheduleEnd: '06:00',
    scheduleDays: [true,true,true,true,true,true,true],
    filenameFormat: '{title}_{quality}',
    notifyProgress: true,
    notifyComplete: true,
    notifyRecommend: false,
    notifyTools: false,
    notifyToolbar: true,
    theme: 'dark',
  };

  function init() {
    settingsContent = document.getElementById('settings-content');
    if (!settingsContent) return;
    renderMain();
  }

  function renderMain() {
    currentView = 'main';
    settingsContent.innerHTML = '';

    // General section
    settingsContent.innerHTML += '<div class="settings-section"><div class="settings-section-title">General</div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="download-settings"><span class="item-info"><span class="item-title">Download settings</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="notification-settings"><span class="item-info"><span class="item-title">Notification settings</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="theme-settings"><span class="item-info"><span class="item-title">Theme</span></span><span class="item-value">' + (settingsState.theme === 'dark' ? 'Dark' : 'Light') + '</span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '</div>';

    // Download tools section
    settingsContent.innerHTML += '<div class="settings-section"><div class="settings-section-title">Download tools</div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="recover-files"><span class="item-info"><span class="item-title">Recover deleted files</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="status-saver"><span class="item-info"><span class="item-title">WhatsApp status saver</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="vault"><span class="item-info"><span class="item-title">Vault</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '</div>';

    // Phone clean section
    settingsContent.innerHTML += '<div class="settings-section"><div class="settings-section-title">Phone clean</div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="junk-clean"><span class="item-info"><span class="item-title">Junk clean</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="boost"><span class="item-info"><span class="item-title">Boost</span></span><span class="item-value">83%</span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="battery-saver"><span class="item-info"><span class="item-title">Battery saver</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="large-files"><span class="item-info"><span class="item-title">Large files clean</span></span><span class="item-value">8.65 GB</span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="whatsapp-clean"><span class="item-info"><span class="item-title">WhatsApp clean</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '</div>';

    // Info section
    settingsContent.innerHTML += '<div class="settings-section"><div class="settings-section-title">Info</div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="account"><span class="item-info"><span class="item-title">Account</span></span><span class="item-value">Jiang Salim</span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="region"><span class="item-info"><span class="item-title">Region & language</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="feedback"><span class="item-info"><span class="item-title">Feedback</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="share"><span class="item-info"><span class="item-title">Share MediaVault</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '<div class="settings-item" data-action="about"><span class="item-info"><span class="item-title">About</span></span><span class="item-chevron">›</span></div>';
    settingsContent.innerHTML += '</div>';

    bindMainEvents();
  }

  function bindMainEvents() {
    document.querySelectorAll('.settings-item').forEach(item => {
      item.addEventListener('click', function () {
        const action = this.dataset.action;
        switch (action) {
          case 'download-settings': renderDownloadSettings(); break;
          case 'notification-settings': renderNotificationSettings(); break;
          case 'theme-settings': renderThemeSettings(); break;
          case 'status-saver': renderStatusSaver(); break;
          case 'vault': renderVault(); break;
          case 'junk-clean': renderJunkClean(); break;
          case 'boost': renderBoost(); break;
          case 'battery-saver': renderBatterySaver(); break;
          case 'large-files': renderLargeFiles(); break;
          case 'whatsapp-clean': renderWhatsAppClean(); break;
          case 'recover-files': renderRecoverFiles(); break;
          case 'account': renderAccount(); break;
          case 'region': renderRegion(); break;
          case 'feedback': renderFeedback(); break;
          case 'share': renderShare(); break;
          case 'about': renderAbout(); break;
        }
      });
    });
  }

  function backToMain() { renderMain(); }

  function renderBackHeader(title) {
    return '<div class="settings-back-header"><button class="back-btn" onclick="SettingsPage.backToMain()">←</button><span class="back-title">' + title + '</span></div>';
  }

  function renderDownloadSettings() {
    currentView = 'download-settings';
    let html = renderBackHeader('Download settings');
    html += '<div class="settings-sub-content">';
    html += '<div class="form-group"><label class="form-label">Download path</label><div class="form-input">' + settingsState.downloadPath + '</div></div>';
    html += '<div class="form-group"><label class="form-label">Max download tasks</label><p style="font-size:13px;color:var(--color-text-secondary);">WIFI: ' + settingsState.maxTasksWifi + ' tasks | Mobile data: ' + settingsState.maxTasksMobile + ' tasks</p></div>';
    html += '<div class="form-group"><label class="form-label">Download Speed Limit</label><div class="form-input">' + settingsState.speedLimit + '</div></div>';
    html += '<div class="form-group"><div class="settings-item" style="padding:12px 0;border:none;"><span class="settings-label">Download via mobile data</span><label class="toggle-switch"><input type="checkbox" ' + (settingsState.mobileData ? 'checked' : '') + '><span class="toggle-slider"></span></label></div><p class="settings-info-text">Media will be downloaded via data</p></div>';
    html += '<div class="form-group"><div class="settings-item" style="padding:12px 0;border:none;"><span class="settings-label">Auto-sync Watch Later</span><label class="toggle-switch"><input type="checkbox" ' + (settingsState.autoSync ? 'checked' : '') + '><span class="toggle-slider"></span></label></div></div>';
    html += '<div class="form-group"><label class="form-label">Schedule</label><div class="time-picker-row"><select><option>' + settingsState.scheduleStart + '</option></select><span>to</span><select><option>' + settingsState.scheduleEnd + '</option></select></div><div class="day-chips" style="margin-top:8px;">';
    ['S','M','T','W','T','F','S'].forEach((d,i) => { html += '<div class="day-chip' + (settingsState.scheduleDays[i] ? ' active' : '') + '">' + d + '</div>'; });
    html += '</div></div>';
    html += '<div class="form-group"><label class="form-label">Filename format</label><div class="form-input">' + settingsState.filenameFormat + '</div></div>';
    html += '</div>';
    settingsContent.innerHTML = html;
  }

  function renderNotificationSettings() {
    currentView = 'notifications';
    let html = renderBackHeader('Notifications');
    html += '<div class="settings-sub-content">';
    html += '<div class="form-group"><label class="form-label">Download Notifications</label>';
    html += '<div class="settings-item" style="padding:12px 0;border:none;"><span class="settings-label">Download progress</span><label class="toggle-switch"><input type="checkbox" ' + (settingsState.notifyProgress ? 'checked' : '') + '><span class="toggle-slider"></span></label></div>';
    html += '<p class="settings-info-text">Notify me of download progress</p>';
    html += '<div class="settings-item" style="padding:12px 0;border:none;"><span class="settings-label">Download completed</span><label class="toggle-switch"><input type="checkbox" ' + (settingsState.notifyComplete ? 'checked' : '') + '><span class="toggle-slider"></span></label></div>';
    html += '<p class="settings-info-text">Notify me when download is complete</p></div>';
    html += '<div class="form-group"><label class="form-label">Push Notifications</label>';
    html += '<div class="settings-item" style="padding:12px 0;border:none;"><span class="settings-label">Recommended contents</span><label class="toggle-switch"><input type="checkbox" ' + (settingsState.notifyRecommend ? 'checked' : '') + '><span class="toggle-slider"></span></label></div>';
    html += '<p class="settings-info-text">Notify me of videos and music I might like</p>';
    html += '<div class="settings-item" style="padding:12px 0;border:none;"><span class="settings-label">Tool notifications</span><label class="toggle-switch"><input type="checkbox" ' + (settingsState.notifyTools ? 'checked' : '') + '><span class="toggle-slider"></span></label></div>';
    html += '<p class="settings-info-text">Notify me when new tools are released</p>';
    html += '<div class="settings-item" style="padding:12px 0;border:none;"><span class="settings-label">Tools bar</span><label class="toggle-switch"><input type="checkbox" ' + (settingsState.notifyToolbar ? 'checked' : '') + '><span class="toggle-slider"></span></label></div>';
    html += '<p class="settings-info-text">Quick access to tools in notification bar</p></div>';
    html += '</div>';
    settingsContent.innerHTML = html;
  }

  function renderThemeSettings() {
    currentView = 'theme';
    let html = renderBackHeader('Theme');
    html += '<div class="settings-sub-content">';
    html += '<div class="form-group"><label class="form-label">App theme</label><p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:12px;">Use system setting</p>';
    html += '<div class="radio-group">';
    html += '<div class="radio-item' + (settingsState.theme === 'light' ? ' selected' : '') + '" data-theme="light"><div class="radio-dot"></div><span class="radio-label">Light</span></div>';
    html += '<div class="radio-item' + (settingsState.theme === 'dark' ? ' selected' : '') + '" data-theme="dark"><div class="radio-dot"></div><span class="radio-label">Dark</span></div>';
    html += '</div></div></div>';
    settingsContent.innerHTML = html;
    document.querySelectorAll('.radio-item').forEach(item => {
      item.addEventListener('click', function () {
        document.querySelectorAll('.radio-item').forEach(r => r.classList.remove('selected'));
        this.classList.add('selected');
        settingsState.theme = this.dataset.theme;
      });
    });
  }

  function renderStatusSaver() {
    currentView = 'status-saver';
    let html = renderBackHeader('WhatsApp Status Saver');
    html += '<div class="settings-sub-content">';
    html += '<div class="form-group"><div class="settings-item" style="padding:12px 0;border:none;"><span class="settings-label">Auto-Save</span><label class="toggle-switch"><input type="checkbox"><span class="toggle-slider"></span></label></div><p class="settings-info-text">Automatically save new statuses</p></div>';
    html += '<div style="text-align:center;padding:20px;color:var(--color-text-secondary);"><div style="font-size:2rem;margin-bottom:8px;">📱</div><p>Open WhatsApp and view statuses first</p><p style="font-size:12px;margin-top:4px;">Statuses you have viewed will appear here</p></div>';
    html += '<button class="btn btn-primary btn-block">Save All Statuses</button></div>';
    settingsContent.innerHTML = html;
  }

  function renderVault() {
    currentView = 'vault';
    let html = renderBackHeader('Vault');
    html += '<div class="settings-sub-content">';
    html += '<div style="text-align:center;padding:30px;">';
    html += '<div style="font-size:3rem;margin-bottom:12px;">🔒</div>';
    html += '<p style="font-weight:600;color:var(--color-text-primary);margin-bottom:4px;">Video</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:16px;">No videos</p>';
    html += '<p style="font-weight:600;color:var(--color-text-primary);margin-bottom:4px;">Music</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:16px;">No music</p>';
    html += '<p style="font-weight:600;color:var(--color-text-primary);margin-bottom:4px;">Photo</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:24px;">No photos</p>';
    html += '<p style="font-size:12px;color:var(--color-text-tertiary);margin-bottom:4px;">Keep your private files here</p>';
    html += '<p style="font-size:12px;color:var(--color-text-tertiary);margin-bottom:20px;">Files in Vault won\'t be seen in Play tab</p>';
    html += '<button class="btn btn-primary btn-block btn-lg">+ LOCK</button></div></div>';
    settingsContent.innerHTML = html;
  }

  function renderJunkClean() {
    currentView = 'junk-clean';
    let html = renderBackHeader('Junk clean');
    html += '<div class="settings-sub-content" style="text-align:center;">';
    html += '<div style="font-size:4rem;margin:40px 0 20px;">🧹</div>';
    html += '<p style="color:var(--color-text-primary);font-weight:600;margin-bottom:8px;">Free up storage space</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:24px;">Scan for junk files, cache, and temporary data</p>';
    html += '<button class="btn btn-primary btn-lg" id="btn-scan-junk">Scan for Junk Files</button>';
    html += '<div id="junk-result" style="margin-top:20px;"></div></div>';
    settingsContent.innerHTML = html;
    document.getElementById('btn-scan-junk').addEventListener('click', function () {
      this.textContent = 'Scanning...'; this.disabled = true;
      setTimeout(() => {
        document.getElementById('junk-result').innerHTML = '<div style="background:var(--color-surface);padding:16px;border-radius:12px;text-align:left;"><div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--color-divider);"><span>App Cache</span><span>340 MB</span></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--color-divider);"><span>Temp Files</span><span>120 MB</span></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--color-divider);"><span>Thumbnails</span><span>85 MB</span></div><div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:700;margin-top:4px;"><span>Total Cleanable</span><span>545 MB</span></div></div><button class="btn btn-primary btn-block" style="margin-top:16px;" id="btn-clean-now">Clean Now (545 MB)</button>';
        document.getElementById('btn-clean-now').addEventListener('click', function () {
          document.getElementById('junk-result').innerHTML = '<div style="font-size:3rem;margin:20px 0;">✨</div><p style="color:var(--color-success);font-weight:600;">Cleaned 545 MB!</p><p style="color:var(--color-text-secondary);font-size:13px;">Your device is now cleaner</p>';
        });
      }, 1800);
    });
  }

  function renderBoost() {
    currentView = 'boost';
    let html = renderBackHeader('Boost');
    html += '<div class="settings-sub-content" style="text-align:center;">';
    html += '<div style="font-size:5rem;margin:30px 0 20px;">⚡</div>';
    html += '<p style="font-size:24px;font-weight:700;color:var(--color-text-primary);" id="boost-ram">RAM: 2.1 GB / 4 GB</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:24px;">52% used</p>';
    html += '<button class="btn btn-primary btn-lg" id="btn-boost-now">Boost Now</button>';
    html += '<p style="font-size:11px;color:var(--color-text-tertiary);margin-top:16px;">Android manages memory automatically. This provides a temporary refresh.</p></div>';
    settingsContent.innerHTML = html;
    document.getElementById('btn-boost-now').addEventListener('click', function () {
      this.textContent = 'Boosting...'; this.disabled = true;
      setTimeout(() => {
        document.getElementById('boost-ram').textContent = 'RAM: 2.4 GB / 4 GB';
        this.textContent = 'Boost Again'; this.disabled = false;
      }, 1500);
    });
  }

  function renderBatterySaver() {
    currentView = 'battery';
    let html = renderBackHeader('Battery saver');
    html += '<div class="settings-sub-content" style="text-align:center;">';
    html += '<div style="font-size:4rem;margin:20px 0;">🔋</div>';
    html += '<p style="font-size:32px;font-weight:700;color:var(--color-text-primary);">52%</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:16px;">Freeze apps to save battery</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:16px;">51 Battery Draining Apps</p>';
    html += '<div style="text-align:left;background:var(--color-surface);padding:12px;border-radius:8px;margin-bottom:16px;max-height:200px;overflow-y:auto;">';
    ['AM TUNNEL LITE VPN','APKPure','Alpha Hybrid Launcher','Assistant','Calculator','Calendar','Clock','DeepSeek','Facebook','Instagram','Messenger','TikTok','WhatsApp','X','YouTube'].forEach(app => {
      html += '<div style="padding:6px 0;font-size:13px;color:var(--color-text-primary);border-bottom:1px solid var(--color-divider);">' + app + '</div>';
    });
    html += '</div>';
    html += '<button class="btn btn-primary btn-block btn-lg">Freeze 51 Apps</button></div>';
    settingsContent.innerHTML = html;
  }

  function renderLargeFiles() {
    currentView = 'large-files';
    let html = renderBackHeader('Large files');
    html += '<div class="settings-sub-content">';
    html += '<p style="font-size:24px;font-weight:700;color:var(--color-text-primary);margin-bottom:4px;">8.65 GB</p><p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:16px;">large files</p>';
    html += '<div style="background:var(--color-surface);padding:12px;border-radius:8px;">';
    const largeFiles = [
      { name: 'DJ Wicky Wicky Dancehall Party Mixtape vol 2 ft Mc Diara Tem N...', size: '196.2 MB', type: 'audio' },
      { name: 'Party O_clock Season 5 Mixed and Hyped by DJ Emaranx_Mc ...', size: '129.8 MB', type: 'audio' },
      { name: 'Club Mix 28 at Happy Boyz Tula by Dj Ricky Uganda and Mc Newt...', size: '115.6 MB', type: 'audio' },
      { name: 'VOL 193 DJ I MC KHOFFLA NON STOP LIVE MIX T...', size: '113.9 MB', type: 'audio' },
      { name: 'Dj X-Vibes Da Headboy _Mc Ranx - Club Bangers. 2026 (MP3...)', size: '113.7 MB', type: 'audio' },
      { name: 'RADIO AND WEASEL NONSTOP PART 2 (ALL HITS AN...)', size: '112.1 MB', type: 'audio' },
    ];
    largeFiles.forEach(f => {
      html += '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--color-divider);"><span>' + (f.type === 'audio' ? '🎵' : '📅') + '</span><span style="flex:1;font-size:12px;color:var(--color-text-primary);">' + f.name + '</span><span style="font-size:12px;color:var(--color-text-secondary);">' + f.size + '</span></div>';
    });
    html += '</div>';
    html += '<button class="btn btn-primary btn-block" style="margin-top:16px;">Clean junk 0 KB</button></div>';
    settingsContent.innerHTML = html;
  }

  function renderWhatsAppClean() {
    currentView = 'whatsapp-clean';
    let html = renderBackHeader('WhatsApp cleaner');
    html += '<div class="settings-sub-content">';
    html += '<p style="font-size:20px;font-weight:700;color:var(--color-text-primary);margin-bottom:4px;">684.5 MB</p><p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:16px;">WhatsApp files scanned</p>';
    const cats = [
      { name: 'Images', size: '35.1 MB', desc: 'Clean rarely used images' },
      { name: 'Videos', size: '261.0 MB', desc: 'Clean watched videos' },
      { name: 'Documents', size: '167.8 MB', desc: 'Clean rarely used documents' },
      { name: 'Stickers', size: '34.9 MB', desc: 'Clean rarely used stickers' },
      { name: 'Voice notes', size: '185.8 MB', desc: 'Clean rarely used voice notes' },
    ];
    cats.forEach(c => {
      html += '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--color-divider);"><div style="flex:1;"><div style="font-size:14px;font-weight:500;color:var(--color-text-primary);">' + c.size + '</div><div style="font-size:13px;font-weight:600;color:var(--color-text-primary);">' + c.name + '</div><div style="font-size:12px;color:var(--color-text-secondary);">' + c.desc + '</div></div><button class="btn btn-sm btn-outline">View</button></div>';
    });
    html += '</div>';
    settingsContent.innerHTML = html;
  }

  function renderRecoverFiles() {
    currentView = 'recover';
    let html = renderBackHeader('Recover deleted files');
    html += '<div class="settings-sub-content" style="text-align:center;">';
    html += '<div style="font-size:4rem;margin:30px 0 20px;">🔄</div>';
    html += '<p style="color:var(--color-text-primary);font-weight:600;margin-bottom:8px;">Scan for deleted files</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:24px;">Recover recently deleted photos and videos</p>';
    html += '<button class="btn btn-primary btn-lg" id="btn-scan-recover">Scan for Deleted Files</button>';
    html += '<p style="font-size:11px;color:var(--color-text-tertiary);margin-top:16px;">⚠ Recovery is not guaranteed. Deleted files may be overwritten.</p>';
    html += '<div id="recover-result" style="margin-top:20px;"></div></div>';
    settingsContent.innerHTML = html;
    document.getElementById('btn-scan-recover').addEventListener('click', function () {
      this.textContent = 'Scanning...'; this.disabled = true;
      setTimeout(() => {
        document.getElementById('recover-result').innerHTML = '<p style="color:var(--color-text-primary);font-weight:600;">8 recoverable files found</p><p style="color:var(--color-text-secondary);font-size:13px;">3 photos · 2 videos · 45 MB total</p><button class="btn btn-primary btn-block" style="margin-top:12px;">Recover Selected</button>';
      }, 2000);
    });
  }

  function renderAccount() {
    currentView = 'account';
    let html = renderBackHeader('Account');
    html += '<div class="settings-sub-content" style="text-align:center;">';
    html += '<div style="font-size:4rem;margin:20px 0;">👤</div>';
    html += '<p style="font-weight:600;color:var(--color-text-primary);">Jiang Salim</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;">jaingsalim@gmail.com</p></div>';
    settingsContent.innerHTML = html;
  }

  function renderRegion() {
    currentView = 'region';
    let html = renderBackHeader('Region & language');
    html += '<div class="settings-sub-content">';
    html += '<div class="form-group"><label class="form-label">Language of Snaptube</label><div class="form-input">English</div></div>';
    html += '<div class="form-group"><label class="form-label">Region</label><div class="form-input">Uganda</div></div></div>';
    settingsContent.innerHTML = html;
  }

  function renderFeedback() {
    currentView = 'feedback';
    let html = renderBackHeader('Send feedback');
    html += '<div class="settings-sub-content">';
    html += '<div class="form-group"><label class="form-label">Details *</label><textarea class="form-input" style="min-height:120px;resize:vertical;" placeholder="Tell us a bit more about your questions or suggestions." maxlength="1000"></textarea><p style="font-size:11px;color:var(--color-text-tertiary);text-align:right;">0/1000</p></div>';
    html += '<div class="form-group"><label class="form-label">Contact details</label><input type="text" class="form-input" placeholder="WhatsApp number or email"></div>';
    html += '<div class="form-group"><label class="form-label">Photos and videos (0/9)</label><button class="btn btn-outline btn-sm">Add attachments</button></div>';
    html += '<button class="btn btn-primary btn-block btn-lg">Send</button></div>';
    settingsContent.innerHTML = html;
  }

  function renderShare() {
    currentView = 'share';
    let html = renderBackHeader('Share MediaVault');
    html += '<div class="settings-sub-content">';
    html += '<p style="color:var(--color-text-primary);font-weight:600;margin-bottom:4px;">MediaVault</p><p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:16px;">mediavault.vercel.app</p>';
    const shareOptions = ['WhatsApp','Bluetooth','Messages','Post','APK','More'];
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">';
    shareOptions.forEach(opt => {
      html += '<div style="text-align:center;cursor:pointer;"><div style="width:56px;height:56px;border-radius:16px;background:var(--color-surface);display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin:0 auto 8px;">📤</div><span style="font-size:12px;color:var(--color-text-primary);">' + opt + '</span></div>';
    });
    html += '</div></div>';
    settingsContent.innerHTML = html;
  }

  function renderAbout() {
    currentView = 'about';
    let html = renderBackHeader('About');
    html += '<div class="settings-sub-content" style="text-align:center;">';
    html += '<div style="font-size:3rem;margin:20px 0;">⬇</div>';
    html += '<p style="font-weight:600;color:var(--color-text-primary);">MediaVault</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;">Version 1.0.0</p>';
    html += '<p style="color:var(--color-text-secondary);font-size:13px;">mediavault.vercel.app</p>';
    html += '<div style="margin:20px 0;"><button class="btn btn-outline">Check for updates</button></div>';
    html += '<p style="color:var(--color-success);font-size:13px;">Up to date</p>';
    html += '<div style="margin-top:24px;font-size:12px;color:var(--color-text-tertiary);">';
    html += '<p>Policies & Guidelines | Credits</p>';
    html += '<p style="margin-top:8px;">©2026 MediaVault</p></div></div>';
    settingsContent.innerHTML = html;
  }

  return { init, renderMain, backToMain };
})();

document.addEventListener('DOMContentLoaded', function () { SettingsPage.init(); });
