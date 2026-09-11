import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";

export const metadata: Metadata = {
  title: "MediaVault Desktop — Free YouTube Downloader for Windows, Mac & Linux",
  description: "Download MediaVault Desktop — a full-featured YouTube download manager for Windows, Mac, and Linux. Queue downloads, pause and resume, download playlists, and get 4K support. Free & open source.",
  openGraph: {
    title: "MediaVault Desktop App",
    description: "Free YouTube downloader for Windows, Mac & Linux.",
  },
};

const GITHUB_RELEASES = "https://github.com/jiangsalim/Media-Vault-Desktop/releases/latest";

export default function DesktopPage() {
  return (
    <Layout>
      <section className="py-16 md:py-24 bg-navy text-white">
        <div className="container-site max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-teal/10 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MediaVault Desktop</h1>
          <p className="text-lg text-gray-medium mb-8 max-w-2xl mx-auto">
            A full-featured YouTube download manager for Windows, Mac, and Linux. Free, open source, and built for speed.
          </p>

          <a
            href={GITHUB_RELEASES}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-8 py-4 text-base font-semibold text-white hover:bg-teal-dark transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Latest Release
          </a>
          <p className="text-sm text-gray-medium mt-4">
            Available for Windows (.exe), macOS (.dmg), and Linux (.AppImage/.deb)
          </p>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-dark">
        <div className="container-site max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-navy dark:text-white text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "4K Video Support", desc: "Download in 144p up to 2160p (4K) and Best Available." },
              { title: "MP3 Extraction", desc: "Convert videos to MP3, M4A, FLAC, WAV at any bitrate." },
              { title: "Download Queue", desc: "Queue multiple downloads with pause, resume, and retry." },
              { title: "Playlist Support", desc: "Download entire playlists or hand-pick specific videos." },
              { title: "Thumbnails & Subtitles", desc: "Grab thumbnails in every resolution and multi-language subtitles." },
              { title: "Dark & Light Themes", desc: "Beautiful UI with glassmorphism and smooth animations." },
              { title: "Download History", desc: "Track every download with local SQLite database." },
              { title: "Auto Updates", desc: "Get new features automatically without re-downloading." },
              { title: "Privacy First", desc: "No tracking. Everything runs locally on your machine." },
            ].map((f) => (
              <div key={f.title} className="card-base p-6 hover:shadow-cardHover transition-shadow">
                <h3 className="text-lg font-bold text-navy dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-charcoal dark:text-gray-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-light dark:bg-navy">
        <div className="container-site max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-navy dark:text-white text-center mb-12">
            How to Install
          </h2>

          <div className="space-y-6">
            {[
              { step: 1, title: "Download the installer", desc: "Click the download button above to visit our GitHub Releases page." },
              { step: 2, title: "Choose your platform", desc: "Download the .exe for Windows, .dmg for Mac, or .AppImage for Linux." },
              { step: 3, title: "Run the installer", desc: "Double-click the file and follow the on-screen instructions." },
              { step: 4, title: "Start downloading", desc: "Paste any YouTube URL, choose your format, and download." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start card-base p-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-navy dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-charcoal dark:text-gray-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={GITHUB_RELEASES}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-7 py-3 text-sm font-semibold text-white hover:bg-teal-dark transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download for Free
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy text-white text-center">
        <div className="container-site">
          <h2 className="text-2xl font-bold mb-4">Also available for Android</h2>
          <p className="text-gray-medium mb-6">Get MediaVault on your phone with our Android APK.</p>
          <a
            href="https://apkpure.com/mediavault"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white hover:bg-teal-dark transition-colors"
          >
            Download APK
          </a>
        </div>
      </section>
    </Layout>
  );
}