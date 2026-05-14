import { Layout } from "@/components/layout/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <section className="bg-navy py-20 text-center">
        <div className="container-site">
          <h1 className="text-white">About MediaVault</h1>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-gray-medium">
            A free media toolkit built for East Africa — download videos and music from your favorite platforms.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-dark">
        <div className="container-site max-w-3xl mx-auto">
          <p className="text-body-lg text-charcoal dark:text-gray-light leading-relaxed">
            MediaVault is a free media toolkit that lets you download videos and music from YouTube, Spotify, TikTok, Instagram, and more. Save WhatsApp statuses before they disappear. Keep private files in a PIN-protected vault.
          </p>
          <p className="mt-4 text-body text-charcoal dark:text-gray-light leading-relaxed">
            Built for East Africa — optimized for low data usage, works offline, and supports MP3 downloads.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gray-light dark:bg-navy">
        <div className="container-site">
          <h2 className="mb-8 text-center">Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🎬", title: "HD Video", desc: "Download in 360p to 4K" },
              { icon: "🎵", title: "MP3 Audio", desc: "Extract audio from videos" },
              { icon: "💬", title: "Status Saver", desc: "Save WhatsApp statuses" },
              { icon: "🔒", title: "Private Vault", desc: "PIN-protected storage" },
              { icon: "🧹", title: "Phone Cleaner", desc: "Free up device space" },
              { icon: "▶️", title: "Built-in Player", desc: "Video & audio playback" },
              { icon: "📡", title: "Works Offline", desc: "Download & watch later" },
              { icon: "🌍", title: "East Africa First", desc: "Optimized for local networks" },
            ].map(f => (
              <div key={f.title} className="card-base p-6 text-center transition-all hover:shadow-cardHover hover:-translate-y-1 dark:bg-navy-dark">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-h4 mb-2">{f.title}</h3>
                <p className="text-body-sm text-charcoal dark:text-gray-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-dark">
        <div className="container-site max-w-3xl mx-auto text-center">
          <h2 className="mb-8">Supported Platforms</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["YouTube", "Spotify", "TikTok", "Instagram", "Facebook", "SoundCloud", "Twitter/X"].map(p => (
              <span key={p} className="rounded-full bg-navy/5 px-5 py-2 text-sm font-medium text-navy dark:bg-navy-light dark:text-white">{p}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-center text-white">
        <div className="container-site">
          <h2 className="text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-medium mb-6">Free downloads, no ads, no registration.</p>
          <a href="/" className="inline-flex items-center justify-center rounded-md bg-teal px-6 py-3 text-sm font-semibold text-white hover:bg-teal-dark transition-colors">
            Start Searching Music
          </a>
        </div>
      </section>
    </Layout>
  );
}
