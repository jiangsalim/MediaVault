import { useState, useEffect } from 'react';
import { getRelatedSongs } from '../lib/api';

export default function SongModal({ song, onClose }) {
  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

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

  if (!song) return null;

  const durationSec = song.duration || 180;

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={onClose}>
      <div style={{background:'#fff',borderRadius:16,maxWidth:550,width:'100%',maxHeight:'90vh',overflow:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e => e.stopPropagation()}>
        
        <div style={{display:'flex',justifyContent:'flex-end',padding:'12px 16px 0'}}>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:'50%',border:'none',background:'#f0f0f0',fontSize:18,cursor:'pointer'}}>✕</button>
        </div>

        <div style={{textAlign:'center',padding:'0 24px 20px'}}>
          <div style={{width:200,height:112,borderRadius:10,overflow:'hidden',margin:'0 auto 16px',background:'#f0f0f0'}}>
            <img src={thumb(song.id)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} />
          </div>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:4,lineHeight:1.3}}>{song.title}</h2>
          <p style={{color:'#888',fontSize:15,marginBottom:8}}>{song.artist}</p>
          <div style={{display:'flex',gap:16,justifyContent:'center',fontSize:13,color:'#aaa'}}>
            <span>{dur(durationSec)}</span>
            <span>{vw(song.views)}</span>
          </div>
        </div>

        {/* App Download CTA */}
        <div style={{padding:'0 24px 24px'}}>
          <div style={{background:'linear-gradient(135deg,#e53935,#c5303c)',borderRadius:12,padding:24,textAlign:'center',color:'#fff'}}>
            <div style={{fontSize:40,marginBottom:8}}>📱</div>
            <h3 style={{fontSize:18,fontWeight:700,marginBottom:4}}>Get the App to Download</h3>
            <p style={{fontSize:14,opacity:0.9,marginBottom:16,lineHeight:1.5}}>
              Download this song and more — MP3, HD video, multiple qualities.<br/>
              Free on APKPure. No registration needed.
            </p>
            <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" 
              style={{display:'inline-block',background:'#fff',color:'#e53935',padding:'14px 32px',borderRadius:8,fontWeight:700,fontSize:15,textDecoration:'none'}}>
              Get MediaVault — Free
            </a>
          </div>
        </div>

        {/* Related Songs */}
        <div style={{borderTop:'1px solid #eee',padding:'20px 24px'}}>
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:12}}>Related Songs</h3>
          {loadingRelated ? [1,2,3,4].map(i => <div key={i} style={{display:'flex',gap:10,marginBottom:8}}><div className="skeleton" style={{width:48,height:48,borderRadius:6}}></div><div style={{flex:1}}><div className="skeleton" style={{height:14,width:'80%',marginBottom:6}}></div><div className="skeleton" style={{height:12,width:'40%'}}></div></div></div>)
          : related.map(s => (
            <div key={s.id} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:'1px solid #f5f5f5',alignItems:'center'}}>
              <div style={{width:48,height:48,borderRadius:6,overflow:'hidden',flexShrink:0,background:'#f0f0f0'}}><img src={thumb(s.id)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} /></div>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.title}</div><div style={{fontSize:12,color:'#888'}}>{s.artist}</div></div>
              <span style={{fontSize:12,color:'#aaa'}}>{dur(s.duration)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
