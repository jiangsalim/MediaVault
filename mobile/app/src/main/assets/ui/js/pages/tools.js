const ToolsPage = (function () {
  'use strict';

  return {
    renderJunkClean: function (container) {
      let html = '<div class="tool-page"><div class="tool-hero"><div class="tool-icon">🧹</div><h2 class="tool-title">Junk Clean</h2><p class="tool-subtitle">Free up storage space by removing junk files, cache, and temporary data</p>';
      html += '<button class="btn btn-primary btn-lg" id="btn-start-scan">Scan for Junk Files</button>';
      html += '<div id="junk-scan-area"></div></div></div>';
      container.innerHTML = html;

      document.getElementById('btn-start-scan').addEventListener('click', function () {
        this.textContent = 'Scanning...';
        this.disabled = true;
        const scanArea = document.getElementById('junk-scan-area');

        setTimeout(function () {
          scanArea.innerHTML = '<div class="tool-result"><div class="tool-result-row"><span class="tool-result-label">App Cache Files</span><span class="tool-result-value">340 MB</span></div><div class="tool-result-row"><span class="tool-result-label">Temporary Files</span><span class="tool-result-value">120 MB</span></div><div class="tool-result-row"><span class="tool-result-label">Thumbnail Caches</span><span class="tool-result-value">85 MB</span></div><div class="tool-result-row"><span class="tool-result-label">Incomplete Downloads</span><span class="tool-result-value">45 MB</span></div><div class="tool-result-total"><span class="tool-result-label">Total Cleanable</span><span class="tool-result-value">590 MB</span></div></div><button class="btn btn-primary btn-block btn-lg" id="btn-clean-now">Clean Now (590 MB)</button>';

          document.getElementById('btn-clean-now').addEventListener('click', function () {
            scanArea.innerHTML = '<div class="clean-success"><div class="success-icon">✨</div><h3 class="success-title">Optimized!</h3><p class="success-detail">Freed up 590 MB of storage space</p></div>';
          });
        }, 2000);
      });
    },

    renderBoost: function (container) {
      let html = '<div class="tool-page"><div class="tool-hero"><div class="tool-icon">⚡</div><h2 class="tool-title">Boost</h2><p style="font-size:24px;font-weight:700;color:var(--color-text-primary);" id="boost-ram-display">RAM: 2.1 GB / 4 GB</p><p class="tool-subtitle">52% used</p>';
      html += '<button class="btn btn-primary btn-lg" id="btn-boost-trigger">Boost Now</button>';
      html += '<p style="font-size:11px;color:var(--color-text-tertiary);margin-top:16px;">Android manages memory automatically. This provides a temporary refresh.</p></div></div>';
      container.innerHTML = html;

      document.getElementById('btn-boost-trigger').addEventListener('click', function () {
        this.textContent = 'Boosting...';
        this.disabled = true;
        setTimeout(function () {
          document.getElementById('boost-ram-display').textContent = 'RAM: 2.4 GB / 4 GB';
          document.getElementById('btn-boost-trigger').textContent = 'Boost Again';
          document.getElementById('btn-boost-trigger').disabled = false;
        }, 1500);
      });
    },

    renderBatterySaver: function (container) {
      const apps = ['AM TUNNEL LITE VPN', 'APKPure', 'Alpha Hybrid Launcher', 'Assistant', 'Calculator', 'Calendar', 'Clock', 'DeepSeek', 'Facebook', 'Instagram', 'Messenger', 'TikTok', 'WhatsApp', 'X', 'YouTube'];
      let html = '<div class="tool-page"><div class="tool-hero"><div class="tool-icon">🔋</div><h2 class="tool-title">Battery Saver</h2><p style="font-size:32px;font-weight:700;color:var(--color-text-primary);">52%</p><p class="tool-subtitle">Freeze apps to save battery</p></div>';
      html += '<p style="padding:0 var(--space-md);font-size:var(--font-size-sm);color:var(--color-text-primary);font-weight:500;">' + apps.length + ' Battery Draining Apps</p>';
      html += '<div style="padding:var(--space-sm) var(--space-md);">';
      apps.forEach(function (app) {
        html += '<div class="app-list-item"><div class="app-icon">📱</div><div class="app-info"><div class="app-name">' + app + '</div></div></div>';
      });
      html += '</div>';
      html += '<div style="padding:var(--space-md);"><button class="btn btn-primary btn-block btn-lg">Freeze ' + apps.length + ' Apps</button></div></div>';
      container.innerHTML = html;
    },

    renderLargeFiles: function (container) {
      const largeFiles = [
        { name: 'DJ Wicky Wicky Dancehall Party Mixtape vol 2 ft Mc Diara Tem N...', size: '196.2 MB', type: 'audio' },
        { name: 'Party O_clock Season 5 Mixed and Hyped by DJ Emaranx_Mc ...', size: '129.8 MB', type: 'audio' },
        { name: 'Club Mix 28 at Happy Boyz Tula by Dj Ricky Uganda and Mc Newt...', size: '115.6 MB', type: 'audio' },
        { name: 'VOL 193 DJ I MC KHOFFLA NON STOP LIVE MIX T...', size: '113.9 MB', type: 'audio' },
        { name: 'Dj X-Vibes Da Headboy _Mc Ranx - Club Bangers. 2026 (MP3...)', size: '113.7 MB', type: 'audio' },
        { name: 'RADIO AND WEASEL NONSTOP PART 2 (ALL HITS AN...)', size: '112.1 MB', type: 'audio' },
      ];
      let html = '<div class="tool-page"><div style="padding:var(--space-md);"><p style="font-size:24px;font-weight:700;color:var(--color-text-primary);">8.65 GB</p><p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);">large files</p></div>';
      html += '<div style="padding:0 var(--space-md);">';
      largeFiles.forEach(function (f) {
        html += '<div class="app-list-item"><div class="app-icon">' + (f.type === 'audio' ? '🎵' : '📅') + '</div><div class="app-info"><div class="app-name" style="font-size:12px;">' + f.name + '</div></div><div class="app-size">' + f.size + '</div></div>';
      });
      html += '</div>';
      html += '<div style="padding:var(--space-md);"><p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);margin-bottom:8px;">Junk files selected: 0 KB</p><button class="btn btn-primary btn-block">Clean junk 0 KB</button></div></div>';
      container.innerHTML = html;
    },

    renderWhatsAppClean: function (container) {
      const categories = [
        { icon: '🖼', name: 'Images', size: '35.1 MB', desc: 'Clean rarely used images' },
        { icon: '🎬', name: 'Videos', size: '261.0 MB', desc: 'Clean watched videos' },
        { icon: '📄', name: 'Documents', size: '167.8 MB', desc: 'Clean rarely used documents' },
        { icon: '😀', name: 'Stickers', size: '34.9 MB', desc: 'Clean rarely used stickers' },
        { icon: '🎤', name: 'Voice notes', size: '185.8 MB', desc: 'Clean rarely used voice notes' },
      ];
      let html = '<div class="tool-page"><div style="padding:var(--space-md);"><p style="font-size:20px;font-weight:700;color:var(--color-text-primary);">684.5 MB</p><p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);">WhatsApp files scanned</p></div>';
      html += '<div class="storage-bar" style="margin:0 var(--space-md);"><div class="storage-bar-fill" style="width:78%;"></div></div>';
      html += '<div style="padding:var(--space-sm) var(--space-md);">';
      categories.forEach(function (c) {
        html += '<div class="whatsapp-clean-category"><div class="wc-icon">' + c.icon + '</div><div class="wc-info"><div class="wc-name">' + c.name + '</div><div class="wc-size">' + c.size + '</div><div class="wc-desc">' + c.desc + '</div></div><span class="wc-action">View</span></div>';
      });
      html += '</div></div>';
      container.innerHTML = html;
    },

    renderRecoverFiles: function (container) {
      let html = '<div class="tool-page"><div class="tool-hero"><div class="tool-icon">🔄</div><h2 class="tool-title">Recover Deleted Files</h2><p class="tool-subtitle">Scan your device for recently deleted photos and videos</p>';
      html += '<button class="btn btn-primary btn-lg" id="btn-recover-scan">Scan for Deleted Files</button>';
      html += '<div id="recover-result"></div>';
      html += '<p style="font-size:11px;color:var(--color-text-tertiary);margin-top:16px;">Recovery is not guaranteed. Deleted files may be overwritten.</p></div></div>';
      container.innerHTML = html;

      document.getElementById('btn-recover-scan').addEventListener('click', function () {
        this.textContent = 'Scanning...';
        this.disabled = true;
        setTimeout(function () {
          document.getElementById('recover-result').innerHTML = '<div class="tool-result" style="margin-top:16px;"><p style="font-weight:600;color:var(--color-text-primary);margin-bottom:8px;">8 recoverable files found</p><p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:12px;">3 photos · 2 videos · 45 MB total</p><button class="btn btn-primary btn-block">Recover Selected (45 MB)</button></div>';
        }, 2000);
      });
    },

    renderAppUninstaller: function (container) {
      const apps = [
        { name: 'Unused Game App', size: '1.2 GB' },
        { name: 'Old Photo Editor', size: '890 MB' },
        { name: 'Rarely Used App', size: '567 MB' },
        { name: 'Duplicate Tool', size: '345 MB' },
      ];
      let html = '<div class="tool-page"><div style="padding:var(--space-md);"><p style="font-size:var(--font-size-lg);font-weight:700;color:var(--color-text-primary);margin-bottom:4px;">App Uninstaller</p><p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);">Remove unused apps to free space</p></div>';
      apps.forEach(function (app) {
        html += '<div class="app-list-item"><div class="app-icon">📱</div><div class="app-info"><div class="app-name">' + app.name + '</div><div class="app-size">' + app.size + '</div></div><button class="uninstall-btn">Uninstall</button></div>';
      });
      html += '</div>';
      container.innerHTML = html;
    },

    renderPhotosClean: function (container) {
      let html = '<div class="tool-page"><div style="padding:var(--space-md);"><p style="font-size:var(--font-size-lg);font-weight:700;color:var(--color-text-primary);margin-bottom:4px;">Photos clean</p><p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);">46 photos found</p></div>';
      for (let i = 0; i < 6; i++) {
        html += '<div class="app-list-item"><div class="app-icon">🖼</div><div class="app-info"><div class="app-name">Photo_' + (i + 1) + '.jpg</div><div class="app-size">' + (Math.random() * 5 + 1).toFixed(1) + ' MB</div></div><button class="btn btn-sm btn-danger">Delete</button></div>';
      }
      html += '<div style="padding:var(--space-md);"><button class="btn btn-primary btn-block">Clean All Photos</button></div></div>';
      container.innerHTML = html;
    },

    renderStorageManager: function (container) {
      let html = '<div class="tool-page"><div style="padding:var(--space-md);"><p style="font-size:var(--font-size-lg);font-weight:700;color:var(--color-text-primary);margin-bottom:4px;">Storage Manager</p></div>';
      html += '<div style="padding:0 var(--space-md);"><div class="storage-bar"><div class="storage-bar-fill" style="width:78%;"></div></div><p style="color:var(--color-text-secondary);font-size:var(--font-size-sm);">64 GB total · 14.1 GB free</p></div>';
      html += '<div class="storage-legend" style="padding:var(--space-sm) var(--space-md);"><div class="legend-item"><div class="legend-dot" style="background:var(--color-primary);"></div>Videos 28.4 GB</div><div class="legend-item"><div class="legend-dot" style="background:#4CAF50;"></div>Audio 12.2 GB</div><div class="legend-item"><div class="legend-dot" style="background:#FF9800;"></div>Apps 8.3 GB</div><div class="legend-item"><div class="legend-dot" style="background:#9C27B0;"></div>Other 1.1 GB</div></div>';
      html += '<div style="padding:var(--space-md);"><button class="btn btn-primary btn-block">Open Full Storage Manager</button></div></div>';
      container.innerHTML = html;
    }
  };
})();
