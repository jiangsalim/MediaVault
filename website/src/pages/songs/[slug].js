import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getDownloadUrl } from '../../lib/api';

export default function SongPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [format, setFormat] = useState('mp3');

  function thumb(id) { return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; }

  return (
    <Layout>
      <Head><title>Download MP3 | MediaVault</title></Head>
      <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:4,color:'#888',fontSize:14,marginTop:16}}>← Back</Link>
      <div style={{maxWidth:450,margin:'30px auto',background:'#fff',borderRadius:16,padding:32,textAlign:'center',border:'1px solid #eee'}}>
        <div style={{width:200,height:112,borderRadius:10,overflow:'hidden',margin:'0 auto 20px',background:'#f0f0f0'}}>
          <img src={thumb(slug)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} />
        </div>
        <h2 style={{fontSize:20,fontWeight:700,marginBottom:4}}>{slug ? slug.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase()) : 'Song'}</h2>
        <p style={{color:'#888',marginBottom:20}}>MP3 Download</p>
        
        <div style={{background:'#fafafa',borderRadius:12,padding:16,textAlign:'left',marginBottom:20}}>
          <p style={{fontWeight:600,fontSize:14,marginBottom:12}}>Download Options:</p>
          {[
            {id:'mp3',name:'MP3 128kbps',size:'~3.5 MB',desc:'Standard quality'},
            {id:'m4a',name:'M4A 128kbps',size:'~3.5 MB',desc:'Fast download'},
          ].map(f => (
            <label key={f.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',marginBottom:6,borderRadius:8,cursor:'pointer',border:format===f.id?'2px solid #e53935':'2px solid #eee',background:format===f.id?'#fde8e8':'#fff'}}>
              <input type="radio" name="fmt" checked={format===f.id} onChange={()=>setFormat(f.id)} style={{accentColor:'#e53935'}} />
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{f.name}</div><div style={{fontSize:12,color:'#888'}}>{f.desc} · {f.size}</div></div>
            </label>
          ))}
          <a href={getDownloadUrl(slug, format)} target="_blank" rel="noopener" style={{display:'block',width:'100%',marginTop:12,padding:'14px',borderRadius:8,fontWeight:600,fontSize:15,border:'none',cursor:'pointer',background:'#e53935',color:'#fff',textAlign:'center',textDecoration:'none'}}>
            ⬇ Download Now
          </a>
        </div>
      </div>
      <div className="app-banner"><div style={{flex:1}}><h3>📱 Want videos too?</h3><p>Get the MediaVault app for video downloads, WhatsApp status saver, private vault, and more!</p><a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn btn-primary" style={{marginTop:16}}>Get MediaVault App — Free</a></div></div>
    </Layout>
  );
}
