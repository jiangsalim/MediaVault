const CONFIG = {
  APP_NAME: 'MediaVault',
  APP_VERSION: '2.0.0',
  BUILD_NUMBER: 1,

  // Live Render API
  API_BASE_URL: 'https://mediavault-website-api.onrender.com/api',

  STORAGE_KEYS: {
    SETTINGS: 'mv_settings',
    DOWNLOAD_QUEUE: 'mv_download_queue',
    SEARCH_HISTORY: 'mv_search_history',
    THEME: 'mv_theme',
    HOME_CACHE: 'mv_home_cache',
  },

  DOWNLOAD_DEFAULTS: {
    WIFI_QUALITY: '720p',
    MOBILE_QUALITY: '480p',
    AUDIO_QUALITY: '128kbps',
    MAX_CONCURRENT: 2,
  },

  THEMES: { LIGHT: 'light', DARK: 'dark' },
  TOAST: { SHORT: 2000, LONG: 4000 },
  MAX_SEARCH_HISTORY: 20,
  HOME_REFRESH_INTERVAL: 300000, // 5 minutes
};

Object.freeze(CONFIG);
