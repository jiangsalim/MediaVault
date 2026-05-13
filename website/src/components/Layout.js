import Link from 'next/link';
export default function Layout({ children }) {
  return (
    <>
      <header className="header">
        <div className="container">
          <Link href="/" className="logo">⬇ MediaVault</Link>
          <div className="search-bar">
            <input type="text" placeholder="Search for songs..." id="searchInput" onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = '/search?q=' + encodeURIComponent(e.target.value); }} />
            <button onClick={() => { const q = document.getElementById('searchInput').value; if (q) window.location.href = '/search?q=' + encodeURIComponent(q); }}>🔍</button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container">
          <p>© 2026 MediaVault · <Link href="/about">About</Link> · <Link href="/feedback">Feedback</Link></p>
          <p style={{marginTop:4}}>Free music downloads from Uganda and East Africa</p>
        </div>
      </footer>
    </>
  );
}
