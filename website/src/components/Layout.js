import Link from 'next/link';
import { useRouter } from 'next/router';
export default function Layout({ children }) {
  const router = useRouter();
  const handleSearch = (e) => { e.preventDefault(); const q = e.target.q.value; if(q) router.push('/search?q='+encodeURIComponent(q)); };
  return (
    <>
      <header style={{background:'#fff',borderBottom:'1px solid #eee',padding:'16px 0',textAlign:'center'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 16px'}}>
          <Link href="/" style={{display:'inline-block',marginBottom:8}}>
            <img src="/logo.svg" alt="MediaVault" style={{height:36,width:36}} />
          </Link>
          <Link href="/" style={{display:'block',fontSize:20,fontWeight:800,color:'#1a1a1a',marginBottom:12}}>
            Media<span style={{color:'#e53935'}}>Vault</span>
          </Link>
          <form onSubmit={handleSearch} style={{maxWidth:500,margin:'0 auto',display:'flex',alignItems:'center',background:'#f5f5f5',border:'1px solid #e0e0e0',borderRadius:24,padding:'6px 14px'}}>
            <input type="text" name="q" placeholder="Search songs, artists..." style={{flex:1,background:'none',border:'none',fontSize:14,outline:'none',color:'#1a1a1a'}} />
            <button type="submit" style={{background:'none',border:'none',fontSize:16,cursor:'pointer',color:'#666'}}>🔍</button>
          </form>
          <div style={{marginTop:10,display:'flex',justifyContent:'center',gap:16}}>
            <Link href="/search" style={{color:'#555',fontSize:13,fontWeight:500}}>Browse</Link>
            <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" style={{background:'#e53935',color:'#fff',padding:'5px 14px',borderRadius:20,fontSize:12,fontWeight:600}}>Get App</a>
          </div>
        </div>
      </header>
      <main style={{maxWidth:1100,margin:'0 auto',padding:'0 16px'}}>{children}</main>
      <footer style={{borderTop:'1px solid #e5e5e5',marginTop:40,padding:'30px 16px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',flexWrap:'wrap',gap:24}}>
          <div style={{flex:'1 1 100%',minWidth:200}}>
            <h4 style={{fontSize:13,fontWeight:700,marginBottom:8,color:'#1a1a1a'}}>MediaVault</h4>
            <p style={{fontSize:12,color:'#888',lineHeight:1.5}}>Free music downloads from YouTube, Spotify, TikTok & more. Built in Uganda for East Africa.</p>
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <a href="https://youtube.com/@jaingsalim1845" target="_blank" rel="noopener" style={{width:30,height:30,borderRadius:'50%',border:'1px solid #ddd',display:'flex',alignItems:'center',justifyContent:'center',color:'#888',fontSize:13,fontWeight:700}} title="YouTube">▶</a>
              <a href="#" style={{width:30,height:30,borderRadius:'50%',border:'1px solid #ddd',display:'flex',alignItems:'center',justifyContent:'center',color:'#888',fontSize:13,fontWeight:700}} title="Spotify">S</a>
              <a href="https://www.tiktok.com/@jaingsalim1" target="_blank" rel="noopener" style={{width:30,height:30,borderRadius:'50%',border:'1px solid #ddd',display:'flex',alignItems:'center',justifyContent:'center',color:'#888',fontSize:13,fontWeight:700}} title="TikTok">T</a>
              <a href="https://www.instagram.com/jiang_salim" target="_blank" rel="noopener" style={{width:30,height:30,borderRadius:'50%',border:'1px solid #ddd',display:'flex',alignItems:'center',justifyContent:'center',color:'#888',fontSize:13,fontWeight:700}} title="Instagram">I</a>
            </div>
          </div>
          <div style={{flex:'1 1 120px',minWidth:100}}>
            <h4 style={{fontSize:13,fontWeight:700,marginBottom:8,color:'#1a1a1a'}}>Platforms</h4>
            <a href="#" style={{display:'block',fontSize:12,color:'#888',marginBottom:4}}>YouTube</a>
            <a href="#" style={{display:'block',fontSize:12,color:'#888',marginBottom:4}}>Spotify</a>
            <a href="#" style={{display:'block',fontSize:12,color:'#888',marginBottom:4}}>TikTok</a>
            <a href="#" style={{display:'block',fontSize:12,color:'#888'}}>Instagram</a>
          </div>
          <div style={{flex:'1 1 100px',minWidth:80}}>
            <h4 style={{fontSize:13,fontWeight:700,marginBottom:8,color:'#1a1a1a'}}>Links</h4>
            <Link href="/search" style={{display:'block',fontSize:12,color:'#888',marginBottom:4}}>Search</Link>
            <Link href="/about" style={{display:'block',fontSize:12,color:'#888',marginBottom:4}}>About</Link>
            <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" style={{display:'block',fontSize:12,color:'#888'}}>Get App</a>
          </div>
          <div style={{flex:'1 1 120px',minWidth:100}}>
            <h4 style={{fontSize:13,fontWeight:700,marginBottom:8,color:'#1a1a1a'}}>Contact</h4>
            <a href="mailto:jaingsalim@gmail.com" style={{display:'block',fontSize:12,color:'#888',marginBottom:4}}>Email</a>
            <p style={{fontSize:12,color:'#888'}}>Jinja, Uganda</p>
          </div>
        </div>
        <div style={{textAlign:'center',paddingTop:16,marginTop:16,borderTop:'1px solid #f0f0f0',fontSize:11,color:'#aaa',maxWidth:1100,margin:'16px auto 0'}}>
          © 2026 MediaVault. Free Music Downloads for East Africa.
        </div>
      </footer>
    </>
  );
}
