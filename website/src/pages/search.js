import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { searchMusic } from '../lib/api';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    searchMusic(q).then(data => {
      setResults(data.data?.videos || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [q]);

  function getThumbnail(id) {
    return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
  }

  function formatDuration(sec) {
    if (!sec) return '';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function formatViews(n) {
    if (!n) return '';
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M views';
    if (n >= 1000) return (n/1000).toFixed(0) + 'K views';
    return n + ' views';
  }

  function timeAgo() {
    const ago = ['1 week ago','2 weeks ago','3 weeks ago','1 month ago','2 months ago','3 days ago','5 days ago','1 day ago'];
    return ago[Math.floor(Math.random() * ago.length)];
  }

  return (
    <Layout>
      <Head><title>{q ? q+' — Search' : 'Search Music'} | MediaVault</title></Head>

      <div className="page-header">
        <h1>{q ? 'Results for "'+q+'"' : 'Search Music'}</h1>
      </div>

      {loading ? (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {Array.from({length:6}).map((_,i) => (
            <div key={i} style={{display:'flex',gap:16,background:'#121212',borderRadius:12,padding:0,overflow:'hidden'}}>
              <div className="skeleton" style={{width:246,height:138,flexShrink:0,borderRadius:12}}></div>
              <div style={{flex:1,padding:'12px 0',display:'flex',flexDirection:'column',gap:10}}>
                <div className="skeleton" style={{height:18,width:'80%'}}></div>
                <div className="skeleton" style={{height:14,width:'40%'}}></div>
                <div className="skeleton" style={{height:14,width:'30%'}}></div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div style={{textAlign:'center',padding:60,color:'#999'}}>
          <div style={{fontSize:48,marginBottom:12}}>🔍</div>
          <p style={{fontSize:18,fontWeight:600,color:'#fff',marginBottom:4}}>No results found</p>
          <p>Try a different search term</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {results.map((song,i) => (
            <Link href={'/songs/'+song.id} key={song.id} style={{display:'flex',gap:16,background:'#121212',borderRadius:12,overflow:'hidden',cursor:'pointer',transition:'background 0.2s'}}
              onMouseEnter={e => e.currentTarget.style.background='#1a1a1a'}
              onMouseLeave={e => e.currentTarget.style.background='#121212'}>
              <div style={{position:'relative',flexShrink:0,width:246,height:138,background:'#2c2c2c',borderRadius:12,overflow:'hidden'}}>
                <img src={getThumbnail(song.id)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}
                  onError={e => {e.target.style.display='none';e.target.parentElement.innerHTML='<div style=display:flex;align-items:center;justify-content:center;height:100%;font-size:40px;background:#2c2c2c;>🎵</div>'}} />
                {song.duration ? <span style={{position:'absolute',bottom:6,right:6,background:'rgba(0,0,0,0.8)',color:'#fff',fontSize:12,fontWeight:500,padding:'2px 6px',borderRadius:4}}>{formatDuration(song.duration)}</span> : null}
              </div>
              <div style={{flex:1,padding:'8px 0',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                <div style={{fontSize:16,fontWeight:500,color:'#f1f1f1',lineHeight:1.4,marginBottom:8,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{song.title}</div>
                <div style={{fontSize:14,color:'#aaa',marginBottom:6,display:'flex',alignItems:'center',gap:6}}>
                  {song.artist}
                  {i === 0 ? <span style={{background:'#3ea6ff',color:'#0f0f0f',fontSize:10,fontWeight:'bold',padding:'0px 5px',borderRadius:12}}>✓ Official</span> : null}
                </div>
                <div style={{fontSize:13,color:'#aaa',display:'flex',gap:8,flexWrap:'wrap',marginBottom:6}}>
                  <span>{formatViews(song.views)}</span>
                  <span>•</span>
                  <span>{timeAgo()}</span>
                </div>
                {i === 1 ? (
                  <div style={{display:'inline-flex',alignItems:'center',background:'#2a2a2a',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500,color:'#e5e5e5',gap:6,width:'fit-content'}}>
                    🎵 Mix - {Math.floor(Math.random()*20)+5} songs
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
