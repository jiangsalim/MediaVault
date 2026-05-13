import Link from 'next/link';
import { useRouter } from 'next/router';
export default function Layout({ children }) {
  const router = useRouter();
  const handleSearch = (e) => { e.preventDefault(); const q = e.target.q.value; if(q) router.push('/search?q='+encodeURIComponent(q)); };
  return (
    <>
      <header className="header">
        <div className="container">
          <Link href="/" className="logo">⬇ MediaVault</Link>
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
