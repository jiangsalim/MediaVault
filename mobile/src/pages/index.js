import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  const trending = [
    { title: 'Tweyagale', artist: 'Eddy Kenzo', size: '3.9 MB', genre: 'Gospel', slug: 'eddy-kenzo-tweyagale' },
    { title: 'Chips Na Ketchup', artist: 'Vinka', size: '3.5 MB', genre: 'Dancehall', slug: 'vinka-chips-na-ketchup' },
    { title: 'Beera Nange', artist: 'Sheebah', size: '3.5 MB', genre: 'Afrobeat', slug: 'sheebah-beera-nange' },
    { title: 'Sunday', artist: 'Eddy Kenzo ft Martha Mukisa', size: '4.2 MB', genre: 'Gospel', slug: 'eddy-kenzo-sunday' },
    { title: 'Semyekozo', artist: 'Eddy Kenzo', size: '4.8 MB', genre: 'Dancehall', slug: 'eddy-kenzo-semyekozo' },
    { title: 'Jambole', artist: 'John Blaq', size: '3.1 MB', genre: 'Afrobeat', slug: 'john-blaq-jambole' },
  ];
  const genres = ['Gospel', 'Dancehall', 'Afrobeat', 'Hip Hop', 'Reggae', 'Bongo Flava', 'Zouk', 'R&B'];
  const artists = [
    { name: 'Eddy Kenzo', songs: 24 }, { name: 'Sheebah', songs: 18 }, { name: 'John Blaq', songs: 15 }, { name: 'Vinka', songs: 12 }, { name: 'Spice Diana', songs: 20 }, { name: 'David Lutalo', songs: 16 },
  ];

  return (
    <Layout>
      <Head>
        <title>MediaVault - Free Music Downloads | Uganda MP3</title>
        <meta name="description" content="Download free Ugandan music MP3. Latest songs from Eddy Kenzo, Sheebah, John Blaq and more." />
      </Head>
      <div className="hero">
        <h1>Download Free Music 🎵</h1>
        <p>From YouTube, Spotify, TikTok & more. MP3 downloads. No registration.</p>
        <Link href="/search" className="btn btn-primary" style={{fontSize:18,padding:'14px 32px'}}>Start Downloading</Link>
      </div>
      <div className="container">
        <section className="trending-section">
          <h2 className="section-title">🔥 Trending in Uganda</h2>
          <div className="song-grid">
            {trending.map(song => (
              <Link href={'/songs/' + song.slug} key={song.slug} className="song-card">
                <div className="song-card-content">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">{song.artist}</div>
                  <div className="song-meta"><span>{song.genre}</span><span>{song.size}</span></div>
                  <span className="download-btn">⬇ Download MP3</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="trending-section">
          <h2 className="section-title">🎤 Top Artists</h2>
          <div className="artist-grid">
            {artists.map(artist => (
              <Link href={'/artists/' + artist.name.toLowerCase().replace(/\s+/g,'-')} key={artist.name} className="artist-card">
                <div className="artist-avatar">🎵</div>
                <div className="artist-name">{artist.name}</div>
                <div className="artist-count">{artist.songs} songs</div>
              </Link>
            ))}
          </div>
        </section>
        <section className="trending-section">
          <h2 className="section-title">🎧 Browse by Genre</h2>
          <div className="genre-grid">
            {genres.map(genre => (
              <Link href={'/genre/' + genre.toLowerCase().replace(/\s+/g,'-')} key={genre} className="genre-card">{genre}</Link>
            ))}
          </div>
        </section>
        <div className="app-banner">
          <h2>📱 Get the Full Experience</h2>
          <p>Download videos, save WhatsApp statuses, private vault, and more!</p>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn" style={{background:'#fff',color:'#FF0000',fontSize:18,padding:'14px 32px'}}>Get MediaVault App - Free</a>
        </div>
      </div>
    </Layout>
  );
}
