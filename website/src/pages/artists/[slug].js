import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function ArtistPage({ artist }) {
  return (
    <Layout>
      <Head><title>{artist.name} Songs MP3 Download | MediaVault</title></Head>
      <div className="container" style={{padding:'40px 0'}}>
        <Link href="/" style={{color:'#999',fontSize:14}}>← Back to Home</Link>
        <div style={{textAlign:'center',padding:'40px 0'}}>
          <div className="artist-avatar" style={{margin:'0 auto 16px',width:120,height:120,fontSize:'3rem'}}>🎤</div>
          <h1 style={{fontSize:28,marginBottom:4}}>{artist.name}</h1>
          <p style={{color:'#999'}}>{artist.songCount} songs available</p>
        </div>
        <div className="song-grid">
          {artist.songs.map((song,i) => (
            <Link href={'/songs/' + song.slug} key={i} className="song-card">
              <div className="song-card-content">
                <div className="song-title">{song.title}</div>
                <div className="song-meta"><span>{song.duration}</span><span>{song.size}</span></div>
                <span className="download-btn">⬇ Download MP3</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="app-banner">
          <h2>📱 Get the App</h2>
          <p>Download videos, save WhatsApp statuses, and more!</p>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn" style={{background:'#fff',color:'#FF0000',fontSize:18,padding:'14px 32px'}}>Get MediaVault App - Free</a>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const name = params.slug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return { props: { artist: { name, songCount: 24, songs: [
    { title: 'Song One', duration: '3:35', size: '3.9 MB', slug: 'song-one' },
    { title: 'Song Two', duration: '4:12', size: '4.8 MB', slug: 'song-two' },
    { title: 'Song Three', duration: '3:05', size: '3.1 MB', slug: 'song-three' },
    { title: 'Song Four', duration: '3:45', size: '4.2 MB', slug: 'song-four' },
  ]}}};
}
