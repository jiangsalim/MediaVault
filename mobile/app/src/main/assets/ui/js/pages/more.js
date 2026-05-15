const MorePage = {
  platforms: [
    { name: 'YouTube', icon: '▶️', status: 'active', desc: 'Videos, Shorts, Music' },
    { name: 'Spotify', icon: '🟢', status: 'active', desc: 'Music, Podcasts' },
    { name: 'TikTok', icon: '🎵', status: 'active', desc: 'Short videos' },
    { name: 'Instagram', icon: '📷', status: 'active', desc: 'Reels, Stories, Posts' },
    { name: 'Facebook', icon: '📘', status: 'active', desc: 'Videos, Reels' },
    { name: 'SoundCloud', icon: '☁️', status: 'active', desc: 'Music, Audio' },
    { name: 'Twitter/X', icon: '𝕏', status: 'active', desc: 'Videos, GIFs' },
    { name: 'Vimeo', icon: '🎬', status: 'active', desc: 'HD Videos' },
    { name: 'Dailymotion', icon: '▶️', status: 'active', desc: 'News, Sports, Music' },
    { name: 'Likee', icon: '👍', status: 'active', desc: 'Short videos' },
    { name: 'Snapchat', icon: '👻', status: 'howto', desc: 'Stories, Spotlight' },
    { name: 'Threads', icon: '🧵', status: 'howto', desc: 'Video posts' },
    { name: 'Pinterest', icon: '📌', status: 'howto', desc: 'Video pins' },
    { name: 'Twitch', icon: '🎮', status: 'howto', desc: 'Streams, Clips' },
    { name: 'Reddit', icon: '🤖', status: 'howto', desc: 'Videos, GIFs' },
  ],

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('more-content');
    if (!container) return;

    container.innerHTML = `
      <div style="padding:var(--space-md);">
        <h2 style="font-size:var(--font-size-xl);font-weight:700;margin-bottom:var(--space-sm);">All Platforms</h2>
        <p style="font-size:var(--font-size-sm);color:var(--color-text-tertiary);margin-bottom:var(--space-md);">Download from 15+ platforms</p>
        
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-md);">
          ${this.platforms.map(p => this.platformCard(p)).join('')}
        </div>

        <div style="margin-top:var(--space-xl);text-align:center;">
          <p style="font-size:var(--font-size-sm);color:var(--color-text-tertiary);margin-bottom:var(--space-md);">Paste any URL to download</p>
          <button onclick="Router.navigate('search')" style="padding:var(--space-sm) var(--space-xl);background:var(--color-primary);color:white;border:none;border-radius:var(--radius-full);font-weight:600;cursor:pointer;">Go to Search</button>
        </div>
      </div>
    `;
  },

  platformCard(platform) {
    const statusBadge = platform.status === 'active' 
      ? '<span style="background:var(--color-success);color:white;padding:2px 8px;border-radius:var(--radius-full);font-size:10px;">Active</span>'
      : '<span style="background:var(--color-warning);color:white;padding:2px 8px;border-radius:var(--radius-full);font-size:10px;">How to start</span>';

    return `
      <div class="platform-card" onclick="MorePage.selectPlatform('${platform.name}')" style="background:var(--color-surface);border-radius:var(--radius-md);padding:var(--space-md);box-shadow:var(--shadow-sm);cursor:pointer;text-align:center;transition:transform var(--transition-fast);">
        <div style="font-size:2rem;margin-bottom:var(--space-sm);">${platform.icon}</div>
        <div style="font-weight:600;font-size:var(--font-size-sm);margin-bottom:4px;">${platform.name}</div>
        <div style="font-size:var(--font-size-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-sm);">${platform.desc}</div>
        ${statusBadge}
      </div>`;
  },

  selectPlatform(name) {
    System.selectPlatform(name.toLowerCase());
    Router.navigate('search');
    const input = document.getElementById('search-input-full') || document.getElementById('search-input-main');
    if (input) {
      input.placeholder = `Search or paste ${name} URL...`;
      input.focus();
    }
    System.toast(`Selected: ${name}`);
  },
};

document.addEventListener('click', (e) => {
  const card = e.target.closest('.platform-card');
  if (card) card.style.transform = 'scale(0.95)';
  setTimeout(() => { if (card) card.style.transform = ''; }, 150);
});
