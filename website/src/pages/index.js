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
  const trendingQueries = ['Eddy Kenzo','Sheebah','John Blaq','Vinka','Spice Diana'];
  const newReleaseQueries = ['new ugandan music 2026','latest uganda songs this week','uganda fresh music','brand new ugandan hits'];

  useEffect(() => {
    Promise.all([
      ...trendingQueries.map(q => searchMusic(q)),
      searchMusic(newReleaseQueries[Math.floor(Math.random()*newReleaseQueries.length)])
    ]).then(results => {
      const trendingResults = results.slice(0,5).flatMap(r => (r.data?.videos || []).slice(0,2));
      const newResults = results[5]?.data?.videos?.slice(0,8) || [];
      
      // Remove duplicates — songs in trending must NOT appear in new releases
      const trendingIds = new Set(trendingResults.map(s => s.id));
      const filteredNew = newResults.filter(s => !trendingIds.has(s.id));
      
      setTrending(trendingResults);
      setNewReleases(filteredNew.slice(0,6));
      
      const uniqueArtists = [];
      const seen = new Set();
      trendingResults.forEach(s => {
        if (s.artist && !seen.has(s.artist)) { seen.add(s.artist); uniqueArtists.push({ name:s.artist, songs:Math.floor(Math.random()*20)+5, id:s.id }); }
      });
      setArtists(uniqueArtists.slice(0,6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function thumb(id) { return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; }
  function dur(s) { if(!s)return''; const m=Math.floor(s/60),sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); }
  function vw(n) { if(!n)return''; if(n>=1e6)return (n/1e6).toFixed(1)+'M views'; if(n>=1e3)return (n/1e3).toFixed(0)+'K views'; return n+' views'; }

  return (
    <Layout>
      <Head><title>MediaVault — Free Music Downloads | Uganda</title></Head>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',padding:'24px 0 32px'}}>
        {genreList.map(g => <Link href={'/search?q='+g.toLowerCase()} key={g} style={{padding:'8px 18px',borderRadius:20,fontSize:13,fontWeight:500,background:'#f8f8f8',color:'#555',border:'1px solid #e8e8e8'}}>{g}</Link>)}
      </div>
      <div className="two-col">
        <div className="section"><h2 className="section-title">🔥 Trending Now</h2><div className="song-list">
          {loading ? Array.from({length:6}).map((_,i)=><div key={i} style={{display:'flex',gap:10,padding:'10px 0'}}><div className="skeleton" style={{width:48,height:48,borderRadius:6}}></div><div style={{flex:1}}><div className="skeleton" style={{height:14,width:'80%',marginBottom:6}}></div><div className="skeleton" style={{height:12,width:'40%'}}></div></div></div>)
          : trending.map((s,i)=><div key={s.id} className="song-row" onClick={()=>setSelectedSong(s)}><span className="song-num">{i+1}</span><div className="song-thumb"><img src={thumb(s.id)} alt="" onError={e=>{e.target.style.display='none'}}/></div><div className="song-info"><div className="song-name">{s.title}</div><div className="song-artist">{s.artist}</div></div><span className="song-meta">{dur(s.duration)}</span><span className="song-dl">⬇</span></div>)}
        </div></div>
        <div className="section"><h2 className="section-title">🆕 New Releases</h2><div className="song-list">
          {loading ? Array.from({length:6}).map((_,i)=><div key={i} style={{display:'flex',gap:10,padding:'10px 0'}}><div className="skeleton" style={{width:48,height:48,borderRadius:6}}></div><div style={{flex:1}}><div className="skeleton" style={{height:14,width:'80%',marginBottom:6}}></div><div className="skeleton" style={{height:12,width:'40%'}}></div></div></div>)
          : newReleases.map(s=><div key={s.id} className="song-row" onClick={()=>setSelectedSong(s)}><div className="song-thumb"><img src={thumb(s.id)} alt="" onError={e=>{e.target.style.display='none'}}/></div><div className="song-info"><div className="song-name">{s.title}</div><div className="song-artist">{s.artist}</div></div><span className="song-meta">{dur(s.duration)}<br/>{vw(s.views)}</span><span className="song-dl">⬇</span></div>)}
        </div></div>
      </div>
      <div className="section" style={{marginTop:20}}><h2 className="section-title">🎤 Top Artists</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
          {loading ? Array.from({length:6}).map((_,i)=><div key={i} style={{background:'#fafafa',borderRadius:10,padding:16,textAlign:'center'}}><div className="skeleton" style={{width:64,height:64,borderRadius:'50%',margin:'0 auto 8px'}}></div><div className="skeleton" style={{height:14,width:'70%',margin:'0 auto 6px'}}></div><div className="skeleton" style={{height:12,width:'40%',margin:'0 auto'}}></div></div>)
          : artists.map(a=><Link href={'/search?q='+encodeURIComponent(a.name)} key={a.name} style={{background:'#fafafa',borderRadius:10,padding:16,textAlign:'center',display:'block',cursor:'pointer',border:'1px solid transparent'}}><div style={{width:64,height:64,borderRadius:'50%',background:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 8px'}}>🎤</div><div style={{fontSize:14,fontWeight:600,color:'#1a1a1a',marginBottom:2}}>{a.name}</div><div style={{fontSize:12,color:'#888'}}>{a.songs} songs</div></Link>)}
        </div>
      </div>
      <div className="app-banner"><div style={{flex:1}}><h3>Get the Full Experience</h3><p>The MediaVault app gives you everything the website offers, plus:</p><ul><li>Video downloads in HD (up to 4K)</li><li>WhatsApp Status Saver</li><li>Private Vault with PIN protection</li><li>Phone cleaning tools</li><li>Works offline</li></ul><a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn btn-primary" style={{marginTop:16}}>Download on APKPure — Free</a></div></div>
      {selectedSong && <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />}
    </Layout>
  );
}
