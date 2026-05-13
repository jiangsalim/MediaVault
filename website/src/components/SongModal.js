import { useState, useEffect, useRef } from 'react';
import { getRelatedSongs, downloadAudio, getAudioStreamUrl } from '../lib/api';

export default function SongModal({ song, onClose }) {
  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [format, setFormat] = useState('mp3-128');
  const [showDownload, setShowDownload] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  function thumb(id) { return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; }
  function dur(s) { if(!s)return''; const m=Math.floor(s/60),sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); }
  function vw(n) { if(!n)return''; if(n>=1e6)return (n/1e6).toFixed(1)+'M views'; if(n>=1e3)return (n/1e3).toFixed(0)+'K views'; return n+' views'; }
  function fmtTime(s) { const m=Math.floor(s/60),sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); }

  useEffect(() => {
    if (!song) return;
    setLoadingRelated(true);
    getRelatedSongs(song.title, song.artist).then(data => {
      setRelated((data.data?.videos || []).filter(s => s.id !== song.id).slice(0, 8));
      setLoadingRelated(false);
    }).catch(() => setLoadingRelated(false));
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnd);
    };
  }, [audioUrl]);

  const handlePlay = async () => {
    if (audioUrl) {
      if (playing) { audioRef.current?.pause(); setPlaying(false); }
      else { audioRef.current?.play(); setPlaying(true); }
      return;
    }
    setLoadingAudio(true);
    try {
      const url = await getAudioStreamUrl(song.id);
      setAudioUrl(url);
      setPlaying(true);
      setTimeout(() => { audioRef.current?.play(); setLoadingAudio(false); }, 500);
    } catch(e) {
      setLoadingAudio(false);
      alert('Could not load audio. Please try again.');
    }
  };

  const handleSeek = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  const handleDownload = () => {
    downloadAudio(song.id, format);
  };

  const skip = (sec) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + sec));
    }
  };

  if (!song) return null;

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={onClose}>
      <div style={{background:'#fff',borderRadius:16,maxWidth:600,width:'100%',maxHeight:'90vh',overflow:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e => e.stopPropagation()}>

        <div style={{display:'flex',justifyContent:'flex-end',padding:'12px 16px 0'}}>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:'50%',border:'none',background:'#f0f0f0',fontSize:18,cursor:'pointer'}}>✕</button>
        </div>

        <div style={{textAlign:'center',padding:'0 24px 20px'}}>
          <div style={{width:120,height:68,borderRadius:8,overflow:'hidden',margin:'0 auto 16px',background:'#f0f0f0'}}>
            <img src={thumb(song.id)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} />
          </div>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:4,lineHeight:1.3}}>{song.title}</h2>
          <p style={{color:'#888',fontSize:15,marginBottom:8}}>{song.artist}</p>
          <div style={{display:'flex',gap:16,justifyContent:'center',fontSize:13,color:'#aaa'}}>
            <span>{dur(song.duration)}</span><span>{vw(song.views)}</span>
          </div>
        </div>

        {/* Audio element */}
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}

        {/* Progress Bar with seek */}
        {playing && (
          <div style={{padding:'0 24px 16px'}}>
            <div ref={progressRef} onClick={handleSeek} style={{width:'100%',height:20,padding:'8px 0',cursor:'pointer'}}>
              <div style={{width:'100%',height:4,background:'#e0e0e0',borderRadius:2,position:'relative'}}>
                <div style={{width:(duration?(currentTime/duration)*100:0)+'%',height:'100%',background:'#e53935',borderRadius:2}}></div>
                <div style={{position:'absolute',top:-6,left:(duration?(currentTime/duration)*100:0)+'%',width:16,height:16,background:'#e53935',borderRadius:'50%',transform:'translateX(-50%)'}}></div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#aaa'}}>
              <span>{fmtTime(currentTime)}</span><span>{fmtTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:20,padding:'0 24px 20px'}}>
          <button onClick={() => skip(-10)} style={{width:36,height:36,borderRadius:'50%',border:'none',background:'#f0f0f0',fontSize:16,cursor:'pointer'}}>⏮</button>
          <button onClick={handlePlay} disabled={loadingAudio} style={{width:56,height:56,borderRadius:'50%',border:'none',background:'#e53935',color:'#fff',fontSize:22,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {loadingAudio ? '⏳' : playing ? '⏸' : '▶'}
          </button>
          <button onClick={() => skip(10)} style={{width:36,height:36,borderRadius:'50%',border:'none',background:'#f0f0f0',fontSize:16,cursor:'pointer'}}>⏭</button>
        </div>

        {/* Download button */}
        <div style={{textAlign:'center',padding:'0 24px 8px'}}>
          <button onClick={() => setShowDownload(!showDownload)} style={{padding:'10px 20px',borderRadius:24,fontWeight:600,fontSize:14,border:'none',cursor:'pointer',background:showDownload?'#e53935':'#f0f0f0',color:showDownload?'#fff':'#333'}}>
            ⬇ Download
          </button>
        </div>

        {showDownload && (
          <div style={{padding:'0 24px 20px'}}>
            <div style={{background:'#fafafa',borderRadius:12,padding:16}}>
              <p style={{fontWeight:600,fontSize:14,marginBottom:12}}>Choose Quality:</p>
              {[
                { id:'mp3-128', name:'MP3 128kbps', size:'~3.5 MB' },
                { id:'mp3-256', name:'MP3 256kbps', size:'~7.8 MB' },
                { id:'m4a-128', name:'M4A 128kbps', size:'~3.5 MB' },
              ].map(f => (
                <label key={f.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',marginBottom:4,borderRadius:8,cursor:'pointer',border:format===f.id?'2px solid #e53935':'2px solid transparent',background:format===f.id?'#fde8e8':'#fff'}}>
                  <input type="radio" name="fmt" checked={format===f.id} onChange={()=>setFormat(f.id)} style={{accentColor:'#e53935'}} />
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{f.name}</div><div style={{fontSize:12,color:'#888'}}>{f.size}</div></div>
                </label>
              ))}
              <button onClick={handleDownload} style={{width:'100%',marginTop:12,padding:'12px',borderRadius:8,fontWeight:600,fontSize:15,border:'none',cursor:'pointer',background:'#e53935',color:'#fff'}}>
                ⬇ Download MP3
              </button>
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
