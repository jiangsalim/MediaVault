const Router = {
  currentPage: 'home',
  pages: {},

  init() {
    document.querySelectorAll('.page').forEach(page => {
      this.pages[page.id.replace('page-', '')] = page;
    });

    document.querySelectorAll('#bottom-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.navigate(btn.dataset.page);
      });
    });

    document.getElementById('btn-search-icon')?.addEventListener('click', () => {
      this.navigate('search');
      setTimeout(() => document.getElementById('search-input-full')?.focus(), 300);
    });

    this.navigate('home');
  },

  navigate(page) {
    if (this.currentPage === page) return;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#bottom-nav .nav-item').forEach(b => b.classList.remove('active'));

    const targetPage = this.pages[page];
    const targetNav = document.querySelector(`#bottom-nav .nav-item[data-page="${page}"]`);

    if (targetPage) targetPage.classList.add('active');
    if (targetNav) targetNav.classList.add('active');

    this.currentPage = page;

    // Show/hide top search bar + platform tabs
    const topBar = document.querySelector('.search-bar');
    const platformTabs = document.getElementById('platform-tabs');
    const topInput = document.getElementById('search-input-main');

    if (page === 'search') {
      // Hide top bar, show full search page
      if (topBar) topBar.style.display = 'none';
      if (platformTabs) platformTabs.style.display = 'none';
    } else {
      // Show top bar on other pages
      if (topBar) topBar.style.display = 'flex';
      if (platformTabs) platformTabs.style.display = 'flex';
      if (topInput) topInput.value = '';
    }

    // Trigger page init
    if (page === 'home' && typeof HomePage !== 'undefined') HomePage.load();
    if (page === 'search' && typeof SearchPage !== 'undefined') SearchPage.init();
    if (page === 'downloads' && typeof DownloadPage !== 'undefined') DownloadPage.load();
    if (page === 'more' && typeof MorePage !== 'undefined') MorePage.init();
    if (page === 'profile' && typeof ProfilePage !== 'undefined') ProfilePage.load();
  },
};
