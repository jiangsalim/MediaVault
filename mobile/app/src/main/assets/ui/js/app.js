(function () {
  'use strict';
  function init() {
    console.log('[MediaVault] Initializing v' + CONFIG.APP_VERSION);
    Router.init();
    console.log('[MediaVault] Ready');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
