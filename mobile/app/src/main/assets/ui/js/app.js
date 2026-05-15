(function () {
  'use strict';

  function init() {
    console.log(`[MediaVault] Initializing v${CONFIG.APP_VERSION}`);

    // Load theme
    const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Init systems
    if (typeof System !== 'undefined') System.init();
    if (typeof Router !== 'undefined') Router.init();
    if (typeof HamburgerMenu !== 'undefined') HamburgerMenu.init();

    console.log('[MediaVault] Ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
