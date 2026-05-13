import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { searchMusic } from '../lib/api';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const genres = ['Gospel','Dancehall','Afrobeat','Hip Hop','Reggae','Bongo Flava','Zouk','R&B','Amapiano','Singeli'];
  const artists = [
    { name:'Eddy Kenzo', songs:24, icon:'🎤' },{ name:'Sheebah', songs:18, icon:'🎵' },{ name:'John Blaq', songs:15, icon:'🎧' },{ name:'Vinka', songs:12, icon:'🎶' },{ name:'Spice Diana', songs:20, icon:'🎼' },
  ];

  useEffect(() => {
    Promise.all(['Eddy Kenzo','Sheebah','John Blaq'].map(q => searchMusic(q))).then(r => {
      setTrending(r.flatMap(x => (x.data?.videos||[]).slice(0,4)).slice(0,12));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function thumb(id) { return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; }
  function dur(s) { if(!s)return''; const m=Math.floor(s/60),sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); }
  function vw(n) { if(!n)return''; if(n>=1e6)return (n/1e6).toFixed(1)+'M views'; if(n>=1e3)return (n/1e3).toFixed(0)+'K views'; return n+' views'; }

  return (
    <Layout>
      <Head><title>MediaVault — Free Music Downloads | Uganda</title></Head>
      <div className="hero">
        <h1>Free Music Downloads</h1>
        <p>Download MP3s from YouTube, Spotify, TikTok and more. No fees. No registration. Just free music.</p>
        <div className="hero-actions">
          <Link href="/search" className="btn btn-primary">🔍 Search Music</Link>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn btn-outline">Get the App</a>
        </div>
        <div className="hero-stats"><span><strong>15+</strong> Platforms</span><span><strong>100K+</strong> Downloads</span><span><strong>4.8</strong> Rating</span></div>
      </div>
      <div className="genre-scroll">{genres.map(g => <Link href={'/search?q='+g.toLowerCase()} key={g} className="genre-chip">{g}</Link>)}</div>
      <div className="two-col">
        <div className="section">
          <h2 className="section-title">🔥 Trending Now</h2>
          <div className="song-list">
            {loading ? Array.from({length:6}).map((_,i) => (
              <div key={i} style={{display:'flex',gap:10,padding:'10px 0'}}><div className="skeleton" style={{width:48,height:48,borderRadius:6}}></div><div style={{flex:1}}><div className="skeleton" style={{height:14,width:'80%',marginBottom:6}}></div><div className="skeleton" style={{height:12,width:'40%'}}></div></div></div>
            )) : trending.slice(0,6).map((s,i) => (
              <Link href={'/songs/'+s.id} key={s.id} className="song-row">
                <span className="song-num">{i+1}</span>
                <div className="song-thumb"><img src={thumb(s.id)} alt="" onError={e=>{e.target.style.display='none'}} /></div>
                <div className="song-info"><div className="song-name">{s.title}</div><div className="song-artist">{s.artist}</div></div>
                <span className="song-meta">{dur(s.duration)}</span>
                <span className="song-dl">⬇</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="section">
          <h2 className="section-title">🆕 New Releases</h2>
          <div className="song-list">
            {loading ? Array.from({length:6}).map((_,i) => (
              <div key={i} style={{display:'flex',gap:10,padding:'10px 0'}}><div className="skeleton" style={{width:48,height:48,borderRadius:6}}></div><div style={{flex:1}}><div className="skeleton" style={{height:14,width:'80%',marginBottom:6}}></div><div className="skeleton" style={{height:12,width:'40%'}}></div></div></div>
            )) : trending.slice(6,12).map((s,i) => (
              <Link href={'/songs/'+s.id} key={s.id} className="song-row">
                <div className="song-thumb"><img src={thumb(s.id)} alt="" onError={e=>{e.target.style.display='none'}} /></div>
                <div className="song-info"><div className="song-name">{s.title}</div><div className="song-artist">{s.artist}</div></div>
                <span className="song-meta">{dur(s.duration)}<br/>{vw(s.views)}</span>
                <span className="song-dl">⬇</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">🎤 Top Artists</h2>
        <div className="artist-row">
          {artists.map(a => (
            <Link href={'/search?q='+encodeURIComponent(a.name)} key={a.name} className="artist-card">
              <div className="artist-avatar">{a.icon}</div>
              <div className="artist-name">{a.name}</div>
              <div className="artist-count">{a.songs} songs</div>
            </Link>
          ))}
        </div>
      </div>
      <div className="app-banner">
        <div style={{flex:1}}>
          <h3>Get the Full Experience</h3>
          <p>The MediaVault app gives you everything the website offers, plus:</p>
          <ul>
            <li>Video downloads in HD (up to 4K)</li>
            <li>WhatsApp Status Saver</li>
            <li>Private Vault with PIN protection</li>
            <li>Phone cleaning tools</li>
            <li>Works offline</li>
          </ul>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn btn-primary" style={{marginTop:16}}>Download on APKPure — Free</a>
        </div>
      </div>
    </Layout>
  );
}
