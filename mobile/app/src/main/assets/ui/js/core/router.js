const Router = {
  currentPage: 'home',
  pages: {},

  init() {
    // Cache all page elements
    document.querySelectorAll('.page').forEach(page => {
      this.pages[page.id.replace('page-', '')] = page;
    });

    // Bottom nav clicks
    document.querySelectorAll('#bottom-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        this.navigate(page);
      });
    });

    // Header search icon → go to search
    document.getElementById('btn-search-icon')?.addEventListener('click', () => {
      this.navigate('search');
      setTimeout(() => document.getElementById('search-input')?.focus(), 300);
    });

    // Load home by default
    this.navigate('home');
  },

  navigate(page) {
    if (this.currentPage === page) return;

    // Update active states
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#bottom-nav .nav-item').forEach(b => b.classList.remove('active'));

    const targetPage = this.pages[page];
    const targetNav = document.querySelector(`#bottom-nav .nav-item[data-page="${page}"]`);

    if (targetPage) targetPage.classList.add('active');
    if (targetNav) targetNav.classList.add('active');

    this.currentPage = page;

    // Trigger page-specific init
    if (page === 'home' && typeof HomePage !== 'undefined') HomePage.load();
    if (page === 'search' && typeof SearchPage !== 'undefined') SearchPage.init();
    if (page === 'downloads' && typeof DownloadPage !== 'undefined') DownloadPage.load();
    if (page === 'profile' && typeof ProfilePage !== 'undefined') ProfilePage.load();
  },
};
