document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('btn-hamburger');
  var drawer = document.getElementById('hamburger-drawer');
  var overlay = drawer ? drawer.querySelector('.drawer-overlay') : null;

  if (btn && drawer) {
    btn.onclick = function() {
      drawer.classList.add('open');
    };
  }

  if (overlay) {
    overlay.onclick = function() {
      drawer.classList.remove('open');
    };
  }

  // Wire up all drawer items
  var items = drawer ? drawer.querySelectorAll('.drawer-item') : [];
  items.forEach(function(item) {
    item.onclick = function(e) {
      drawer.classList.remove('open');
    };
  });
});
