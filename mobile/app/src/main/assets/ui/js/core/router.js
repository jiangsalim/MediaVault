const Router = (function () {
  'use strict';
  const pages = ['download', 'play', 'settings'];
  let currentPage = 'download';

  function navigate(pageName) {
    if (!pages.includes(pageName)) return;
    currentPage = pageName;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const active = document.getElementById('page-' + pageName);
    if (active) active.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.remove('active');
      if (n.getAttribute('data-page') === pageName) n.classList.add('active');
    });
    document.getElementById('main-content').scrollTop = 0;
    if (pageName === 'play' && typeof PlayPage !== 'undefined') PlayPage.render();
  }

  function getCurrentPage() { return currentPage; }

  function init() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function () {
        navigate(this.getAttribute('data-page'));
      });
    });
    navigate('download');
  }

  return { init, navigate, getCurrentPage };
})();
