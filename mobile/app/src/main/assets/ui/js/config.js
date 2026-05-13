/**
 * MediaVault — Global Configuration
 */
const CONFIG = {
  APP_NAME: 'MediaVault',
  APP_VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  API_BASE_URL: 'https://mediavault.vercel.app/api',
  STORAGE_KEYS: {
    SETTINGS: 'mv_settings',
    DOWNLOAD_QUEUE: 'mv_download_queue',
    LIBRARY: 'mv_library',
    SEARCH_HISTORY: 'mv_search_history',
    THEME: 'mv_theme',
  },
  DOWNLOAD_DEFAULTS: {
    WIFI_QUALITY: '720p',
    MOBILE_QUALITY: '480p',
    AUDIO_QUALITY: '128kbps',
    MAX_CONCURRENT: 2,
  },
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
  },
  TOAST: {
    SHORT: 2000,
    LONG: 4000,
  },
  MAX_SEARCH_HISTORY: 20,
  MAX_RETRY_ATTEMPTS: 3,
};
Object.freeze(CONFIG);
