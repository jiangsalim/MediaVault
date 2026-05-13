import Link from 'next/link';
import { useRouter } from 'next/router';
export default function Layout({ children }) {
  const router = useRouter();
  const handleSearch = (e) => { e.preventDefault(); const q = e.target.q.value; if(q) router.push('/search?q='+encodeURIComponent(q)); };
  return (
    <>
      <header className="header">
        <div className="container">
          <Link href="/" style={{display:'flex',alignItems:'center',gap:8}}>
            <img src="/logo.svg" alt="" style={{height:28,width:28}} />
            <span className="logo-text">Media<span>Vault</span></span>
          </Link>
          <form className="search-bar" onSubmit={handleSearch}>
            <input type="text" name="q" placeholder="Search songs, artists..." />
            <button type="submit">🔍</button>
          </form>
          <div className="nav-right">
            <Link href="/search">Browse</Link>
            <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn-app">Get App</a>
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
          <a href="#">YouTube</a>
          <a href="#">Spotify</a>
          <a href="#">TikTok</a>
          <a href="#">Instagram</a>
        </div>
        <div>
          <h4>Links</h4>
          <Link href="/search">Search</Link>
          <Link href="/about">About</Link>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener">Get App</a>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="mailto:jaingsalim@gmail.com">Email</a>
          <p>Jinja, Uganda</p>
        </div>
        <div className="footer-bottom">
          © 2026 MediaVault. Free Music Downloads for East Africa.
        </div>
      </footer>
    </>
  );
}
