import Link from 'next/link';
import { useRouter } from 'next/router';
export default function Layout({ children }) {
  const router = useRouter();
  const handleSearch = (e) => { e.preventDefault(); const q = e.target.q.value; if(q) router.push('/search?q='+encodeURIComponent(q)); };
  return (
    <>
      <header className="header">
        <div className="container">
          <Link href="/" style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
            <img src="/logo.svg" alt="MediaVault" style={{height:32,width:32}} />
            <span style={{fontSize:22,fontWeight:800,color:'#fff'}}>Media<span style={{color:'#FF0000'}}>Vault</span></span>
          </Link>
          <form className="search-bar" onSubmit={handleSearch}>
            <input type="text" name="q" placeholder="Search songs, artists..." />
            <button type="submit">🔍</button>
          </form>
          <div className="nav-right">
            <Link href="/trending">Trending</Link>
            <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" className="btn-get-app">Get App</a>
          </div>
        </div>
      </header>
      <main className="container">{children}</main>
      <footer className="footer">
        <p>© 2026 MediaVault · Free Music Downloads · <Link href="/about">About</Link> · <a href="https://apkpure.com/mediavault">Get the App</a></p>
      </footer>
    </>
  );
}
