import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { downloadAudio } from '../../lib/api';

export default function SongPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [format, setFormat] = useState('mp3-128');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const url = 'https://youtube.com/watch?v=' + slug;
      const blob = await downloadAudio(url, 'mp3');
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = (slug||'song')+'.mp3';
      a.click();
    } catch(e) { alert('Download failed. Please try again.'); }
    setDownloading(false);
  };

  return (
    <Layout>
      <Head><title>Download MP3 | MediaVault</title></Head>
      <Link href="/" className="back-btn" style={{display:'inline-flex',marginTop:16}}>← Back</Link>
      <div className="download-card">
        <div className="dl-icon">🎵</div>
        <h2>{slug ? slug.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase()) : 'Song'}</h2>
        <p className="dl-artist">MP3 Download</p>
        <div>
          <label className={'quality-option'+(format==='mp3-128'?' selected':'')}>
            <input type="radio" name="fmt" checked={format==='mp3-128'} onChange={()=>setFormat('mp3-128')} />
            <div className="q-info"><div className="q-name">MP3 128kbps</div><div className="q-size">Standard quality · ~3.5 MB</div></div>
          </label>
          <label className={'quality-option'+(format==='mp3-256'?' selected':'')}>
            <input type="radio" name="fmt" checked={format==='mp3-256'} onChange={()=>setFormat('mp3-256')} />
            <div className="q-info"><div className="q-name">MP3 256kbps</div><div className="q-size">High quality · ~7.8 MB</div></div>
          </label>
          <label className={'quality-option'+(format==='m4a-128'?' selected':'')}>
            <input type="radio" name="fmt" checked={format==='m4a-128'} onChange={()=>setFormat('m4a-128')} />
            <div className="q-info"><div className="q-name">M4A 128kbps</div><div className="q-size">Fast download · ~3.5 MB</div></div>
          </label>
        </div>
        <button className="btn btn-primary btn-block btn-lg" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Downloading...' : '⬇ Download MP3'}
        </button>
      </div>
      <div className="app-banner" style={{marginTop:30}}>
        <div className="app-banner-text"><h3>📱 Want videos too?</h3><p>Get the app for video downloads, WhatsApp status saver & more</p></div>
        <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn">Get App — Free</a>
      </div>
    </Layout>
  );
}
