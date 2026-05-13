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
          <form className="search-bar" onSubmit={handleSearch} style={{maxWidth:500,margin:'0 auto',display:'flex',alignItems:'center',background:'#f5f5f5',border:'1px solid #e0e0e0',borderRadius:24,padding:'8px 16px'}}>
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
      <footer className="footer container">
        <div>
          <h4>MediaVault</h4>
          <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>Free music downloads from YouTube, Spotify, TikTok & more. Built in Uganda for East Africa.</p>
        </div>
        <div>
          <h4>Platforms</h4>
          <a href="#">YouTube</a><a href="#">Spotify</a><a href="#">TikTok</a><a href="#">Instagram</a>
        </div>
        <div>
          <h4>Links</h4>
          <Link href="/search">Search</Link><Link href="/about">About</Link>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener">Get App</a>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="mailto:jaingsalim@gmail.com">Email</a>
          <p>Jinja, Uganda</p>
        </div>
        <div className="footer-bottom">© 2026 MediaVault. Free Music Downloads for East Africa.</div>
      </footer>
    </>
  );
}
