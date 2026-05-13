import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getSongSEO } from '../../lib/seo';

export default function SongPage({ song }) {
  const seo = getSongSEO(song);
  return (
    <Layout>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Head>
      <div className="container" style={{padding:'40px 0'}}>
        <Link href="/" style={{color:'#999',fontSize:14}}>← Back to Home</Link>
        <div style={{textAlign:'center',padding:'40px 0'}}>
          <div style={{fontSize:'5rem',marginBottom:20}}>🎵</div>
          <h1 style={{fontSize:28,marginBottom:8}}>{song.title}</h1>
          <p style={{fontSize:18,color:'#999',marginBottom:16}}>{song.artist}</p>
          <div style={{display:'flex',gap:16,justifyContent:'center',marginBottom:24,color:'#666',fontSize:14}}>
            <span>{song.genre}</span><span>{song.duration}</span><span>{song.size}</span>
          </div>
          <div style={{background:'#2A2A2A',borderRadius:12,padding:24,maxWidth:400,margin:'0 auto',textAlign:'left'}}>
            <p style={{fontWeight:600,marginBottom:16}}>Download Options:</p>
            <label style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #333',cursor:'pointer'}}>
              <input type="radio" name="quality" defaultChecked style={{accentColor:'#FF0000'}} /> MP3 128kbps - 3.5 MB (Standard)
            </label>
            <label style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #333',cursor:'pointer'}}>
              <input type="radio" name="quality" style={{accentColor:'#FF0000'}} /> MP3 256kbps - 7.8 MB (High Quality)
            </label>
            <label style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',cursor:'pointer'}}>
              <input type="radio" name="quality" style={{accentColor:'#FF0000'}} /> M4A 128kbps - 3.5 MB (Fast)
            </label>
          </div>
          <button className="btn btn-primary btn-block" style={{maxWidth:400,margin:'20px auto',fontSize:18,padding:'16px'}}>⬇ Download Now</button>
        </div>
        <div className="app-banner">
          <h2>📱 Want videos too?</h2>
          <p>Get the MediaVault app for video downloads, WhatsApp status saver, private vault, and more!</p>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn" style={{background:'#fff',color:'#FF0000',fontSize:18,padding:'14px 32px'}}>Get MediaVault App - Free</a>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const slug = params.slug.replace(/-/g, ' ');
  return {
    props: {
      song: {
        title: slug.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        artist: 'Artist Name',
        genre: 'Afrobeat',
        duration: '3:35',
        size: '3.5 MB',
      }
    }
  };
}
