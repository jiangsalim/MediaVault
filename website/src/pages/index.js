import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import SongModal from '../components/SongModal';
import { searchMusic } from '../lib/api';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState(null);

  const genreList = ['Gospel','Dancehall','Afrobeat','Hip Hop','Reggae','Bongo Flava','Zouk','R&B','Amapiano','Singeli'];

  useEffect(() => {
    const trendingArtists = ['Eddy Kenzo','Sheebah','John Blaq','Vinka','Spice Diana'];
    const newReleaseQueries = ['latest ugandan music 2026','new uganda songs this week','ugandan hits today'];

    Promise.all([
      ...trendingArtists.map(q => searchMusic(q)),
      searchMusic(newReleaseQueries[Math.floor(Math.random() * newReleaseQueries.length)])
    ]).then(results => {
      const tResults = results.slice(0, 5);
      const nResult = results[5];
      
      const allTrending = [];
      const trendingIds = new Set();
      tResults.forEach(r => {
        (r.data?.videos || []).slice(0, 3).forEach(s => {
          if (!trendingIds.has(s.id)) {
            trendingIds.add(s.id);
            allTrending.push(s);
          }
        });
      });

      const newSongs = (nResult.data?.videos || [])
        .filter(s => !trendingIds.has(s.id))
        .slice(0, 8);

      // Ensure exactly 8 songs in each column for balance
      const balancedTrending = allTrending.slice(0, 8);
      const balancedNew = newSongs.length >= 8 ? newSongs.slice(0, 8) : 
        [...newSongs, ...allTrending.filter(s => !trendingIds.has(s.id) && !newSongs.find(n => n.id === s.id))].slice(0, 8);

      setTrending(balancedTrending);
      setNewReleases(balancedNew);
      
      const artistMap = {};
      allTrending.forEach(s => {
        if (s.artist && !artistMap[s.artist]) {
          artistMap[s.artist] = { name: s.artist, songs: Math.floor(Math.random()*25)+5, image: `https://i.ytimg.com/vi/${s.id}/mqdefault.jpg`, id: s.id };
        }
      });
      setArtists(Object.values(artistMap).slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function thumb(id) { return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; }
  function dur(s) { if(!s)return''; const m=Math.floor(s/60),sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); }
  function vw(n) { if(!n)return''; if(n>=1e6)return (n/1e6).toFixed(1)+'M views'; if(n>=1e3)return (n/1e3).toFixed(0)+'K views'; return n+' views'; }

  // Skeleton loading with equal height
  const SkeletonRow = () => (
    <div style={{display:'flex',gap:10,padding:'10px 0'}}>
      <div className="skeleton" style={{width:48,height:48,borderRadius:6,flexShrink:0}}></div>
      <div style={{flex:1}}>
        <div className="skeleton" style={{height:14,width:'80%',marginBottom:6}}></div>
        <div className="skeleton" style={{height:12,width:'40%'}}></div>
      </div>
    </div>
  );

  return (
    <Layout>
      <Head><title>MediaVault — Free Music Downloads | Uganda</title></Head>
      
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',padding:'24px 0 32px'}}>
        {genreList.map(g => <Link href={'/search?q='+g.toLowerCase()} key={g} style={{padding:'8px 18px',borderRadius:20,fontSize:13,fontWeight:500,background:'#f8f8f8',color:'#555',border:'1px solid #e8e8e8'}}>{g}</Link>)}
      </div>

      <div className="two-col">
        <div className="section">
          <h2 className="section-title">Trending Now</h2>
          <div className="song-list">
            {loading ? Array.from({length:8}).map((_,i) => <SkeletonRow key={i} />)
            : trending.map((s,i) => (
              <div key={s.id} className="song-row" onClick={()=>setSelectedSong(s)}>
                <span className="song-num">{i+1}</span>
                <div className="song-thumb"><img src={thumb(s.id)} alt="" onError={e=>{e.target.style.display='none'}}/></div>
                <div className="song-info"><div className="song-name">{s.title}</div><div className="song-artist">{s.artist}</div></div>
                <span className="song-meta">{dur(s.duration)}</span>
                <span className="song-dl">⬇</span>
              </div>
            ))}
          </div>
        </div>
        <div className="section">
          <h2 className="section-title">New Releases</h2>
          <div className="song-list">
            {loading ? Array.from({length:8}).map((_,i) => <SkeletonRow key={i} />)
            : newReleases.map(s => (
              <div key={s.id} className="song-row" onClick={()=>setSelectedSong(s)}>
                <div className="song-thumb"><img src={thumb(s.id)} alt="" onError={e=>{e.target.style.display='none'}}/></div>
                <div className="song-info"><div className="song-name">{s.title}</div><div className="song-artist">{s.artist}</div></div>
                <span className="song-meta">{dur(s.duration)}<br/>{vw(s.views)}</span>
                <span className="song-dl">⬇</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section" style={{marginTop:20}}>
        <h2 className="section-title">Top Artists</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
          {loading ? Array.from({length:6}).map((_,i)=>(
            <div key={i} style={{background:'#fafafa',borderRadius:10,padding:16,textAlign:'center'}}>
              <div className="skeleton" style={{width:80,height:80,borderRadius:'50%',margin:'0 auto 8px'}}></div>
              <div className="skeleton" style={{height:14,width:'70%',margin:'0 auto 6px'}}></div>
              <div className="skeleton" style={{height:12,width:'40%',margin:'0 auto'}}></div>
            </div>
          )) : artists.map(a => (
            <Link href={'/search?q='+encodeURIComponent(a.name)} key={a.name} style={{background:'#fafafa',borderRadius:12,padding:16,textAlign:'center',display:'block',cursor:'pointer',border:'1px solid #eee'}}>
              <div style={{width:80,height:80,borderRadius:'50%',overflow:'hidden',margin:'0 auto 10px',background:'#f0f0f0'}}>
                <img src={a.image} alt={a.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none';e.target.parentElement.innerHTML='<div style=display:flex;align-items:center;justify-content:center;height:100%;font-size:28px;>🎤</div>'}} />
              </div>
              <div style={{fontSize:14,fontWeight:600,color:'#1a1a1a',marginBottom:3}}>{a.name}</div>
              <div style={{fontSize:12,color:'#888'}}>{a.songs} songs</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="app-banner">
        <div style={{flex:1}}>
          <h3>Get the Full Experience</h3>
          <p>The MediaVault app gives you everything the website offers, plus:</p>
          <ul><li>Video downloads in HD (up to 4K)</li><li>WhatsApp Status Saver</li><li>Private Vault with PIN protection</li><li>Phone cleaning tools</li><li>Works offline</li></ul>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn btn-primary" style={{marginTop:16}}>Download on APKPure — Free</a>
        </div>
      </div>
      
      {selectedSong && <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />}
    </Layout>
  );
}
