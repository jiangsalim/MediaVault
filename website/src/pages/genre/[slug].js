import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function GenrePage({ genre }) {
  return (
    <Layout>
      <Head><title>{genre.name} Music MP3 Download | MediaVault</title></Head>
      <div className="container" style={{padding:'40px 0'}}>
        <Link href="/" style={{color:'#999',fontSize:14}}>← Back to Home</Link>
        <h1 style={{fontSize:28,margin:'20px 0'}}>{genre.name} Music 🎵</h1>
        <div className="song-grid">
          {genre.songs.map((song,i) => (
            <Link href={'/songs/' + song.slug} key={i} className="song-card">
              <div className="song-card-content">
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artist}</div>
                <div className="song-meta"><span>{song.duration}</span><span>{song.size}</span></div>
                <span className="download-btn">⬇ Download MP3</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="app-banner">
          <h2>📱 Get the Full App</h2>
          <p>Download videos, save WhatsApp statuses, private vault, and more!</p>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn" style={{background:'#fff',color:'#FF0000',fontSize:18,padding:'14px 32px'}}>Get MediaVault App - Free</a>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const name = params.slug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return { props: { genre: { name, songs: [
    { title: 'Song One', artist: 'Artist A', duration: '3:35', size: '3.9 MB', slug: 'song-one' },
    { title: 'Song Two', artist: 'Artist B', duration: '4:12', size: '4.8 MB', slug: 'song-two' },
    { title: 'Song Three', artist: 'Artist C', duration: '3:05', size: '3.1 MB', slug: 'song-three' },
    { title: 'Song Four', artist: 'Artist D', duration: '3:45', size: '4.2 MB', slug: 'song-four' },
  ]}}};
}
