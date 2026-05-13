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
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n/1000).toFixed(0) + 'K';
    return n.toString();
  }

  return (
    <Layout>
      <Head><title>{q ? q+' — Search' : 'Search Music'} | MediaVault</title></Head>
      <div className="page-header"><h1>{q ? 'Results for "'+q+'"' : 'Search Music'}</h1></div>

      {loading ? (
        <div className="song-list">
          {Array.from({length:8}).map((_,i) => (
            <div className="skeleton-row" key={i}>
              <div className="skeleton skeleton-thumb"></div>
              <div className="skeleton-lines">
                <div className="skeleton skeleton-line"></div>
                <div className="skeleton skeleton-line short"></div>
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
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:12}}>
          {results.map((song,i) => (
            <Link href={'/songs/'+song.id} key={song.id} style={{display:'flex',gap:12,padding:10,borderRadius:10,background:'#1a1a1a',cursor:'pointer',transition:'background .15s'}}
              onMouseEnter={e => e.currentTarget.style.background='#222'}
              onMouseLeave={e => e.currentTarget.style.background='#1a1a1a'}>
              <div style={{width:100,height:56,borderRadius:6,overflow:'hidden',flexShrink:0,position:'relative',background:'#111'}}>
                <img src={getThumbnail(song.id)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e => {e.target.style.display='none';e.target.parentElement.innerHTML='<div style=display:flex;align-items:center;justify-content:center;height:100%;font-size:24px;>🎵</div>'}} />
                {song.duration ? <span style={{position:'absolute',bottom:3,right:3,background:'rgba(0,0,0,0.8)',color:'#fff',fontSize:10,padding:'1px 5px',borderRadius:3,fontWeight:600}}>{formatDuration(song.duration)}</span> : null}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:2}}>{song.title}</div>
                <div style={{fontSize:12,color:'#999'}}>{song.artist}</div>
                {song.views ? <div style={{fontSize:11,color:'#666',marginTop:2}}>{formatViews(song.views)} views</div> : null}
              </div>
              <div style={{display:'flex',alignItems:'center',flexShrink:0}}>
                <span style={{width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#999',fontSize:16}}>⬇</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
