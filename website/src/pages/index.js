import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  const features = [
    { icon:'🎵', title:'Free Music Downloads', desc:'Download MP3s from YouTube, Spotify, TikTok, Instagram, Facebook, SoundCloud and more. High quality audio, no registration required.' },
    { icon:'📱', title:'WhatsApp Status Saver', desc:'Save photos and videos from your contacts\' WhatsApp statuses before they disappear. Auto-save works silently in the background.' },
    { icon:'🔒', title:'Private Vault', desc:'Lock away personal media with a PIN. Files are hidden from your gallery and encrypted. Only you can access them.' },
    { icon:'🎬', title:'Video Downloads', desc:'Download videos in HD quality — 360p to 4K. Extract audio as MP3. Built-in video and audio player included.' },
    { icon:'🧹', title:'Phone Cleaner', desc:'Free up storage space. Remove junk files, clean WhatsApp media, manage large files, and boost your phone performance.' },
    { icon:'📡', title:'Offline Sharing', desc:'Share files with nearby devices without using mobile data. Fast WiFi Direct transfers between MediaVault users.' },
  ];
  const platforms = [
    { icon:'▶', name:'YouTube' }, { icon:'🟢', name:'Spotify' }, { icon:'🎵', name:'TikTok' },
    { icon:'📷', name:'Instagram' }, { icon:'📘', name:'Facebook' }, { icon:'🐦', name:'Twitter/X' },
    { icon:'🎧', name:'SoundCloud' }, { icon:'📺', name:'DailyMotion' },
  ];
  const songs = [
    { title:'Tweyagale', artist:'Eddy Kenzo', size:'3.9 MB', slug:'eddy-kenzo-tweyagale', icon:'🎵' },
    { title:'Chips Na Ketchup', artist:'Vinka', size:'3.5 MB', slug:'vinka-chips-na-ketchup', icon:'🎵' },
    { title:'Beera Nange', artist:'Sheebah', size:'3.5 MB', slug:'sheebah-beera-nange', icon:'🎵' },
    { title:'Sunday', artist:'Eddy Kenzo ft Martha Mukisa', size:'4.2 MB', slug:'eddy-kenzo-sunday', icon:'🎵' },
    { title:'Semyekozo', artist:'Eddy Kenzo', size:'4.8 MB', slug:'eddy-kenzo-semyekozo', icon:'🎵' },
    { title:'Jambole', artist:'John Blaq', size:'3.1 MB', slug:'john-blaq-jambole', icon:'🎵' },
  ];

  return (
    <Layout>
      <Head>
        <title>MediaVault — Free Music Downloads | Uganda MP3</title>
        <meta name="description" content="Download free Ugandan music MP3. Latest songs from Eddy Kenzo, Sheebah, John Blaq. YouTube, Spotify, TikTok downloads." />
      </Head>

      <section className="hero">
        <div className="container">
          <h1>Free Music Downloads for <span>East Africa</span></h1>
          <p>Download MP3s from YouTube, Spotify, TikTok and more. No registration. No fees. Just free music.</p>
          <div className="hero-actions">
            <Link href="/search" className="btn btn-primary btn-lg">🔍 Search Music</Link>
            <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn btn-outline btn-lg">📱 Get the App</a>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="stats">
          <div className="stat-item"><div className="stat-number">15+</div><div className="stat-label">Platforms Supported</div></div>
          <div className="stat-item"><div className="stat-number">100K+</div><div className="stat-label">Downloads</div></div>
          <div className="stat-item"><div className="stat-number">4.8★</div><div className="stat-label">User Rating</div></div>
          <div className="stat-item"><div className="stat-number">5</div><div className="stat-label">Countries</div></div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Trending Now</div>
            <h2 className="section-title">Top Downloads in Uganda</h2>
            <p className="section-subtitle">The most downloaded songs this week. Updated daily.</p>
          </div>
          <div className="songs-grid">
            {songs.map((song,i) => (
              <Link href={'/songs/'+song.slug} key={i} className="song-card">
                <div className="song-icon">{song.icon}</div>
                <div className="song-info">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">{song.artist}</div>
                  <div className="song-meta"><span>{song.size}</span><span>MP3</span></div>
                </div>
                <span className="download-arrow">⬇</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{background:'#0d0d0d'}}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Features</div>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">A complete media toolkit for your phone. Download, save, protect, and manage.</p>
          </div>
          <div className="features-grid">
            {features.map((f,i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Platforms</div>
            <h2 className="section-title">Download From Anywhere</h2>
            <p className="section-subtitle">Support for all major platforms. One app, unlimited sources.</p>
          </div>
          <div className="platforms-grid">
            {platforms.map((p,i) => (
              <div className="platform-card" key={i}>
                <div className="platform-icon">{p.icon}</div>
                <div className="platform-name">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cta-section">
          <h2>Ready to Download?</h2>
          <p>Get the full MediaVault app for video downloads, WhatsApp status saver, private vault, and phone cleaning tools.</p>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn btn-lg">📱 Get MediaVault — Free</a>
        </div>
      </div>
    </Layout>
  );
}
