/**
 * MediaVault — Router
 * Handles tab switching between pages
 */

var Router = {
  current: 'home',

  init: function() {
    // Show home by default
    this.go('home');
  },

  go: function(page) {
    if (this.current === page) return;

    // Hide all pages
    document.querySelectorAll('.page').forEach(function(p) {
      p.classList.remove('active');
    });

    // Update nav buttons
    document.querySelectorAll('#bottom-nav .nav-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.page === page);
    });

    // Show target page
    var target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    this.current = page;

    // Load page content
    if (page === 'home' && typeof Home !== 'undefined') Home.load();
    if (page === 'downloads' && typeof Downloads !== 'undefined') Downloads.load();
    if (page === 'player' && typeof Player !== 'undefined') Player.load();
    if (page === 'profile' && typeof Profile !== 'undefined') Profile.load();
  },
};
