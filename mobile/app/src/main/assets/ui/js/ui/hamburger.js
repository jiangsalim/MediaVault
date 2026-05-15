const HamburgerMenu = {
  init() {
    document.getElementById('btn-hamburger')?.addEventListener('click', () => {
      System.toast('Menu: Home, Search, Downloads, Profile');
    });
  },
};
