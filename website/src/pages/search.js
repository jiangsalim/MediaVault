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

  return (
    <Layout>
      <Head><title>{q ? q+' — Search' : 'Search Music'} | MediaVault</title></Head>
      <div className="page-header"><h1>{q ? 'Results for "'+q+'"' : 'Search Music'}</h1></div>
      <div className="song-list">
        {loading ? Array.from({length:10}).map((_,i) => (
          <div className="skeleton-row" key={i}><div className="skeleton skeleton-thumb"></div><div className="skeleton-lines"><div className="skeleton skeleton-line"></div><div className="skeleton skeleton-line short"></div></div></div>
        )) : results.length === 0 ? <p style={{color:'#999',textAlign:'center',padding:40}}>No results found. Try a different search.</p> :
        results.map((song,i) => (
          <Link href={'/songs/'+song.id} key={song.id} className="song-row">
            <span className="song-num">{i+1}</span>
            <div className="song-thumb">🎵</div>
            <div className="song-info">
              <div className="song-name">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
            <span className="song-duration">{song.duration ? Math.floor(song.duration/60)+':'+String(Math.floor(song.duration%60)).padStart(2,'0') : ''}</span>
            <span className="song-dl-btn">⬇</span>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
