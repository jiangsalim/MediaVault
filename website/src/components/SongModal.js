import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRelatedSongs, downloadAudio } from '../lib/api';

export default function SongModal({ song, onClose }) {
  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [format, setFormat] = useState('mp3-128');
  const [downloading, setDownloading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [playing, setPlaying] = useState(false);

  function thumb(id) { return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; }
  function dur(s) { if(!s)return''; const m=Math.floor(s/60),sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); }
  function vw(n) { if(!n)return''; if(n>=1e6)return (n/1e6).toFixed(1)+'M views'; if(n>=1e3)return (n/1e3).toFixed(0)+'K views'; return n+' views'; }

  useEffect(() => {
    if (!song) return;
    setLoadingRelated(true);
    getRelatedSongs(song.title, song.artist).then(data => {
      setRelated((data.data?.videos || []).filter(s => s.id !== song.id).slice(0, 8));
      setLoadingRelated(false);
    }).catch(() => setLoadingRelated(false));
  }, [song]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const url = 'https://youtube.com/watch?v=' + song.id;
      const blob = await downloadAudio(url, 'mp3');
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = (song.title || 'song').substring(0,50) + '.mp3';
      a.click();
    } catch(e) { alert('Download failed. Please try again.'); }
    setDownloading(false);
  };

  if (!song) return null;

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={onClose}>
      <div style={{background:'#fff',borderRadius:16,maxWidth:600,width:'100%',maxHeight:'90vh',overflow:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e => e.stopPropagation()}>
        
        {/* Close button */}
        <div style={{display:'flex',justifyContent:'flex-end',padding:'12px 16px 0'}}>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:'50%',border:'none',background:'#f0f0f0',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
        </div>

        {/* Song Header */}
        <div style={{textAlign:'center',padding:'0 24px 20px'}}>
          <div style={{width:120,height:68,borderRadius:8,overflow:'hidden',margin:'0 auto 16px',background:'#f0f0f0'}}>
            <img src={thumb(song.id)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} />
          </div>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:4,lineHeight:1.3}}>{song.title}</h2>
          <p style={{color:'#888',fontSize:15,marginBottom:8}}>{song.artist}</p>
          <div style={{display:'flex',gap:16,justifyContent:'center',fontSize:13,color:'#aaa'}}>
            <span>{dur(song.duration)}</span>
            <span>{vw(song.views)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{display:'flex',gap:12,justifyContent:'center',padding:'0 24px 20px'}}>
          <button onClick={() => setPlaying(!playing)} style={{padding:'12px 24px',borderRadius:24,fontWeight:600,fontSize:15,border:'none',cursor:'pointer',background:playing?'#e53935':'#f0f0f0',color:playing?'#fff':'#333',display:'flex',alignItems:'center',gap:6}}>
            {playing ? '⏸ Pause' : '▶ Play Preview'}
          </button>
          <button onClick={() => setShowDownload(!showDownload)} style={{padding:'12px 24px',borderRadius:24,fontWeight:600,fontSize:15,border:'none',cursor:'pointer',background:showDownload?'#e53935':'#f0f0f0',color:showDownload?'#fff':'#333',display:'flex',alignItems:'center',gap:6}}>
            ⬇ Download
          </button>
        </div>

        {/* Download Options — show when tapped */}
        {showDownload && (
          <div style={{padding:'0 24px 20px'}}>
            <div style={{background:'#fafafa',borderRadius:12,padding:16}}>
              <p style={{fontWeight:600,fontSize:14,marginBottom:12}}>Choose Quality:</p>
              {[
                { id:'mp3-128', name:'MP3 128kbps', size:'~3.5 MB', desc:'Standard quality' },
                { id:'mp3-256', name:'MP3 256kbps', size:'~7.8 MB', desc:'High quality' },
                { id:'m4a-128', name:'M4A 128kbps', size:'~3.5 MB', desc:'Fast download' },
              ].map(f => (
                <label key={f.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',marginBottom:4,borderRadius:8,cursor:'pointer',border:format===f.id?'2px solid #e53935':'2px solid transparent',background:format===f.id?'#fde8e8':'#fff'}}>
                  <input type="radio" name="fmt" checked={format===f.id} onChange={()=>setFormat(f.id)} style={{accentColor:'#e53935'}} />
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{f.name}</div><div style={{fontSize:12,color:'#888'}}>{f.desc} · {f.size}</div></div>
                </label>
              ))}
              <button onClick={handleDownload} disabled={downloading} style={{width:'100%',marginTop:12,padding:'12px',borderRadius:8,fontWeight:600,fontSize:15,border:'none',cursor:'pointer',background:'#e53935',color:'#fff'}}>
                {downloading ? 'Downloading...' : '⬇ Download MP3'}
              </button>
            </div>
          </div>
        )}

        {/* Playing indicator */}
        {playing && (
          <div style={{padding:'0 24px 16px',textAlign:'center'}}>
            <div style={{background:'#fafafa',borderRadius:12,padding:16}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:4,marginBottom:8}}>
                {[1,2,3,4,5].map(i => <div key={i} style={{width:3,height:20+(i%3)*10,background:'#e53935',borderRadius:2,animation:'equalizer 1s ease infinite',animationDelay:(i*0.15)+'s'}}></div>)}
              </div>
              <p style={{fontSize:13,color:'#888'}}>Preview playing — 30 second sample</p>
              <style>{`@keyframes equalizer{0%,100%{height:10px}50%{height:30px}}`}</style>
            </div>
          </div>
        )}

        {/* Related Songs */}
        <div style={{borderTop:'1px solid #eee',padding:'20px 24px'}}>
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:12}}>Related Songs</h3>
          {loadingRelated ? (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[1,2,3,4].map(i => <div key={i} style={{display:'flex',gap:10}}><div className="skeleton" style={{width:48,height:48,borderRadius:6}}></div><div style={{flex:1}}><div className="skeleton" style={{height:14,width:'80%',marginBottom:6}}></div><div className="skeleton" style={{height:12,width:'40%'}}></div></div></div>)}
            </div>
          ) : (
            related.map(s => (
              <div key={s.id} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:'1px solid #f5f5f5',alignItems:'center'}}>
                <div style={{width:48,height:48,borderRadius:6,overflow:'hidden',flexShrink:0,background:'#f0f0f0'}}>
                  <img src={thumb(s.id)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} />
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.title}</div>
                  <div style={{fontSize:12,color:'#888'}}>{s.artist}</div>
                </div>
                <span style={{fontSize:12,color:'#aaa'}}>{dur(s.duration)}</span>
                <button onClick={() => {}} style={{width:28,height:28,borderRadius:'50%',border:'none',background:'#f0f0f0',cursor:'pointer',fontSize:13,color:'#888'}}>⬇</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
