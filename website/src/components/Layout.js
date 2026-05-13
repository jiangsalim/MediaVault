import Link from 'next/link';
export default function Layout({ children }) {
  return (
    <>
      <header className="header">
        <div className="container">
          <Link href="/" className="logo">⬇ MediaVault</Link>
          <nav className="nav-links">
            <Link href="/search">Search Music</Link>
            <Link href="/trending">Trending</Link>
            <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener">Get the App</a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>MediaVault</h4>
              <p style={{color:'#999',fontSize:14}}>Free music downloads from YouTube, Spotify, TikTok & more. Built in Uganda for East Africa.</p>
            </div>
            <div className="footer-col">
              <h4>Platforms</h4>
              <a href="#">YouTube</a>
              <a href="#">Spotify</a>
              <a href="#">TikTok</a>
              <a href="#">Instagram</a>
            </div>
            <div className="footer-col">
              <h4>Links</h4>
              <Link href="/about">About</Link>
              <Link href="/search">Search</Link>
              <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener">Get the App</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="mailto:jaingsalim@gmail.com">jaingsalim@gmail.com</a>
              <p style={{color:'#999',fontSize:14}}>Jinja, Uganda</p>
            </div>
          </div>
          <p>© 2026 MediaVault. Free Music Downloads for East Africa.</p>
        </div>
      </footer>
    </>
  );
}
