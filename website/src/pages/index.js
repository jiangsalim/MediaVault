import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { searchMusic } from '../lib/api';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const genres = ['Gospel','Dancehall','Afrobeat','Hip Hop','Reggae','Bongo Flava','Zouk','R&B','Amapiano','Singeli'];

  useEffect(() => {
    const queries = ['Eddy Kenzo Tweyagale','Sheebah Beera Nange','John Blaq Jambole','Vinka Chips Na Ketchup','Spice Diana'];
    Promise.all(queries.map(q => searchMusic(q, 'youtube'))).then(results => {
      const allSongs = results.flatMap(r => (r.data?.videos || []).slice(0, 2));
      setTrending(allSongs.slice(0, 15));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Head>
        <title>MediaVault — Free Music Downloads | Uganda MP3</title>
        <meta name="description" content="Download free music MP3 from YouTube, Spotify, TikTok. Latest Ugandan songs." />
      </Head>
      <div className="hero">
        <h1>🔥 Trending Music</h1>
        <p>Free MP3 downloads — no registration needed</p>
      </div>
      <div className="genre-scroll">
        {genres.map(g => <Link href={'/genre/'+g.toLowerCase()} key={g} className="genre-chip">{g}</Link>)}
      </div>
      <div className="section">
        <div className="section-title">🎵 Top Downloads in Uganda</div>
        <div className="song-list">
          {loading ? Array.from({length:8}).map((_,i) => (
            <div className="skeleton-row" key={i}><div className="skeleton skeleton-thumb"></div><div className="skeleton-lines"><div className="skeleton skeleton-line"></div><div className="skeleton skeleton-line short"></div></div></div>
          )) : trending.map((song,i) => (
            <Link href={'/songs/'+song.id} key={song.id} className="song-row">
              <span className={'song-num' + (i<3?' top':'')}>{i+1}</span>
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
      </div>
      <div className="app-banner">
        <div className="app-banner-text"><h3>📱 Get the Full App</h3><p>Video downloads, WhatsApp status saver, private vault & more</p></div>
        <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn">Get App — Free</a>
      </div>
    </Layout>
  );
}
