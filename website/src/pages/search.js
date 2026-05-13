import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import SongModal from '../components/SongModal';
import { searchMusic } from '../lib/api';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    searchMusic(q).then(data => { setResults(data.data?.videos || []); setLoading(false); }).catch(() => setLoading(false));
  }, [q]);

  function thumb(id) { return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; }
  function dur(s) { if(!s)return''; const m=Math.floor(s/60),sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); }
  function vw(n) { if(!n)return''; if(n>=1e6)return (n/1e6).toFixed(1)+'M views'; if(n>=1e3)return (n/1e3).toFixed(0)+'K views'; return n+' views'; }

  return (
    <Layout>
      <Head><title>{q ? q+' — Search' : 'Search Music'} | MediaVault</title></Head>
      <div className="page-header"><h1>{q ? 'Results for "'+q+'"' : 'Search Music'}</h1></div>
      {loading ? (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {Array.from({length:8}).map((_,i) => (
            <div key={i} style={{display:'flex',gap:14,padding:10,borderRadius:10}}>
              <div className="skeleton" style={{width:180,height:100,borderRadius:8,flexShrink:0}}></div>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:8,justifyContent:'center'}}><div className="skeleton" style={{height:16,width:'80%'}}></div><div className="skeleton" style={{height:14,width:'40%'}}></div></div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div style={{textAlign:'center',padding:60,color:'#999'}}><div style={{fontSize:48,marginBottom:12}}>🔍</div><p style={{fontSize:18,fontWeight:600,color:'#333'}}>No results found</p></div>
      ) : (
        <div className="search-results-grid">
          {results.map(s => (
            <div key={s.id} className="result-card" onClick={() => setSelectedSong(s)}>
              <div className="result-thumb"><img src={thumb(s.id)} alt="" onError={e=>{e.target.style.display='none'}} /><span className="result-duration">{dur(s.duration)}</span></div>
              <div className="result-info"><div className="result-title">{s.title}</div><div className="result-channel">{s.artist}</div><div className="result-meta">{vw(s.views)}</div></div>
            </div>
          ))}
        </div>
      )}
      {selectedSong && <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />}
    </Layout>
  );
}
