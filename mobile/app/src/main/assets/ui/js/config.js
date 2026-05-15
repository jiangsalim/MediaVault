const CONFIG = {
  APP_NAME: 'MediaVault',
  APP_VERSION: '2.0.0',
  BUILD_NUMBER: 1,

  // Direct YouTube APIs — no keys needed, runs on user's device
  YOUTUBE_RSS: 'https://www.youtube.com/feeds/videos.xml',
  GOOGLE_SUGGEST: 'https://suggestqueries.google.com/complete/search',
  INVIDIOUS_INSTANCES: [
    'https://inv.nadeko.net',
    'https://invidious.privacyredirect.com',
    'https://iv.ggtyler.dev',
    'https://yewtu.be',
  ],

  STORAGE_KEYS: {
    SETTINGS: 'mv_settings',
    DOWNLOAD_QUEUE: 'mv_download_queue',
    SEARCH_HISTORY: 'mv_search_history',
    THEME: 'mv_theme',
    BADGE_STATS: 'mv_badge_stats',
    LIBRARY: 'mv_library',
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
};

Object.freeze(CONFIG);
