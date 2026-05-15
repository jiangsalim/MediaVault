/**
 * MediaVault — Favorites & Recently Played
 * All icons SVG
 */

var Favorites = {
  _icons: {
    heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    heartOutline: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    history: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  },

  getFavorites: function() {
    try { return JSON.parse(localStorage.getItem('mv_favorites') || '[]'); } catch(e) { return []; }
  },

  saveFavorites: function(list) {
    localStorage.setItem('mv_favorites', JSON.stringify(list));
  },

  toggle: function(song) {
    var list = this.getFavorites();
    var idx = list.findIndex(function(s) { return s.id === song.id; });
    if (idx >= 0) {
      list.splice(idx, 1);
      Toast.show('Removed from favorites');
    } else {
      list.unshift(song);
      Toast.show('Added to favorites');
    }
    this.saveFavorites(list);
    if (typeof Router !== 'undefined' && Router.current === 'favorites') this.render();
  },

  isFavorite: function(id) {
    return this.getFavorites().some(function(s) { return s.id === id; });
  },

  // Recently Played
  getRecent: function() {
    try { return JSON.parse(localStorage.getItem('mv_recent') || '[]'); } catch(e) { return []; }
  },

  addRecent: function(song) {
    var list = this.getRecent();
    list = list.filter(function(s) { return s.id !== song.id; });
    list.unshift(song);
    if (list.length > 30) list = list.slice(0, 30);
    localStorage.setItem('mv_recent', JSON.stringify(list));
  },

  render: function() {
    var page = document.getElementById('page-favorites');
    var favs = this.getFavorites();
    var recent = this.getRecent();
    var self = this;
    var html = '';

    if (favs.length > 0) {
      html += '<div class="section-head"><h2>Favorites (' + favs.length + ')</h2></div>';
      html += favs.map(function(s) { return self._songRow(s, true); }).join('');
    }
    if (recent.length > 0) {
      html += '<div class="section-head"><h2>Recently Played</h2></div>';
      html += recent.slice(0, 10).map(function(s) { return self._songRow(s, false); }).join('');
    }
    if (favs.length === 0 && recent.length === 0) {
      html += '<div class="empty"><div class="empty-icon">' + self._icons.heart + '</div><div class="empty-title">No Favorites</div><div class="empty-text">Tap the heart icon on any song</div></div>';
    }
    page.innerHTML = html;
  },

  _songRow: function(song, isFav) {
    var thumb = 'https://i.ytimg.com/vi/' + song.id + '/mqdefault.jpg';
    var self = this;
    return ''
      + '<div class="dl-card" onclick="if(typeof Player !== \'undefined\') Player.play(\'' + song.id + '\')">'
      + '<img src="' + thumb + '" style="width:48px;height:48px;border-radius:6px;object-fit:cover;flex-shrink:0;" onerror="this.style.display=\'none\'">'
      + '<div class="dl-info">'
      + '<div class="dl-title">' + Helpers.escape(song.title) + '</div>'
      + '<div class="dl-meta">' + Helpers.escape(song.artist || '') + '</div>'
      + '</div>'
      + '<button onclick="event.stopPropagation();Favorites.toggle({id:\'' + song.id + '\',title:\'' + Helpers.escape(song.title) + '\',artist:\'' + Helpers.escape(song.artist||'') + '\'})" style="background:none;border:none;cursor:pointer;padding:8px;">'
      + (isFav ? self._icons.heart : self._icons.heartOutline)
      + '</button>'
      + '</div>';
  },
};
