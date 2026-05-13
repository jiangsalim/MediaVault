import Link from 'next/link';
import { useRouter } from 'next/router';
export default function Layout({ children }) {
  const router = useRouter();
  const handleSearch = (e) => { e.preventDefault(); const q = e.target.q.value; if(q) router.push('/search?q='+encodeURIComponent(q)); };
  return (
    <>
      <header style={{background:'#fff',borderBottom:'1px solid #eee',padding:'24px 0 16px',textAlign:'center'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px'}}>
          <Link href="/" style={{display:'inline-block',marginBottom:12}}>
            <img src="/logo.svg" alt="MediaVault" style={{height:48,width:48}} />
          </Link>
          <Link href="/" style={{display:'block',fontSize:24,fontWeight:800,color:'#1a1a1a',marginBottom:16}}>
            Media<span style={{color:'#e53935'}}>Vault</span>
          </Link>
          <form onSubmit={handleSearch} style={{maxWidth:500,margin:'0 auto',display:'flex',alignItems:'center',background:'#f5f5f5',border:'1px solid #e0e0e0',borderRadius:24,padding:'8px 16px'}}>
            <input type="text" name="q" placeholder="Search songs, artists..." style={{flex:1,background:'none',border:'none',fontSize:15,outline:'none',color:'#1a1a1a'}} />
            <button type="submit" style={{background:'none',border:'none',fontSize:18,cursor:'pointer',color:'#666'}}>🔍</button>
          </form>
          <div style={{marginTop:12,display:'flex',justifyContent:'center',gap:20}}>
            <Link href="/search" style={{color:'#555',fontSize:14,fontWeight:500}}>Browse</Link>
            <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" style={{background:'#e53935',color:'#fff',padding:'6px 16px',borderRadius:20,fontSize:13,fontWeight:600}}>Get App</a>
          </div>
        </div>
      </header>
      <main className="container">{children}</main>
      <footer style={{borderTop:'1px solid #e5e5e5',marginTop:60,padding:'40px 0',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:32,maxWidth:1100,margin:'60px auto 0',padding:'40px 20px'}}>
        <div>
          <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>MediaVault</h4>
          <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>Free music downloads from YouTube, Spotify, TikTok & more. Built in Uganda for East Africa.</p>
        </div>
        <div>
          <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>Platforms</h4>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <a href="#" title="YouTube" style={{fontSize:20,opacity:0.7}}>▶️</a>
            <a href="#" title="Spotify" style={{fontSize:20,opacity:0.7}}>🟢</a>
            <a href="#" title="TikTok" style={{fontSize:20,opacity:0.7}}>🎵</a>
            <a href="#" title="Instagram" style={{fontSize:20,opacity:0.7}}>📷</a>
          </div>
        </div>
        <div>
          <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>Links</h4>
          <Link href="/search" style={{display:'block',fontSize:13,color:'#888',marginBottom:6}}>Search</Link>
          <Link href="/about" style={{display:'block',fontSize:13,color:'#888',marginBottom:6}}>About</Link>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" style={{display:'block',fontSize:13,color:'#888'}}>Get App</a>
        </div>
        <div>
          <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>Contact</h4>
          <a href="mailto:jaingsalim@gmail.com" style={{display:'block',fontSize:13,color:'#888',marginBottom:6}}>Email</a>
          <p style={{fontSize:13,color:'#888'}}>Jinja, Uganda</p>
        </div>
        <div style={{gridColumn:'1/-1',textAlign:'center',paddingTop:20,borderTop:'1px solid #f0f0f0',fontSize:13,color:'#aaa'}}>
          © 2026 MediaVault. Free Music Downloads for East Africa.
        </div>
      </footer>
    </>
  );
}
