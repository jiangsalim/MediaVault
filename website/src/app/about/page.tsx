import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";

export const metadata: Metadata = {
  title: "About MediaVault — Free Music Downloads",
  description: "MediaVault is a free media toolkit for East Africa. Download MP3 music, HD videos, save WhatsApp statuses, and keep private files in a vault.",
  openGraph: {
    title: "About MediaVault",
    description: "Free media toolkit for East Africa — download music, videos, save statuses, and more.",
  },
};

export default function AboutPage() {
  // FAQ Schema
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is MediaVault free to use?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, MediaVault is completely free to use with no registration required." },
      },
      {
        "@type": "Question",
        name: "How do I download music from MediaVault?",
        acceptedAnswer: { "@type": "Answer", text: "Search for your favorite song and click the Download MP3 button. The song will download directly to your device." },
      },
      {
        "@type": "Question",
        name: "What platforms does MediaVault support?",
        acceptedAnswer: { "@type": "Answer", text: "MediaVault supports YouTube, Spotify, TikTok, Instagram, Facebook, SoundCloud, and more." },
      },
      {
        "@type": "Question",
        name: "Does MediaVault work offline?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, once you download music or videos, you can play them offline anytime." },
      },
      {
        "@type": "Question",
        name: "Is MediaVault available for Android?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, MediaVault has an Android APK available for free download." },
      },
    ],
  };

  // Feature icons as SVG
  const features = [
    { title: "HD Video", desc: "Download in 360p to 4K", icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-teal"><rect x="2" y="3" width="14" height="18" rx="2"/><polygon points="22 7 16 12 22 17"/></svg>
    )},
    { title: "MP3 Audio", desc: "Extract audio from videos", icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-teal"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    )},
    { title: "Status Saver", desc: "Save WhatsApp statuses", icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-teal"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
    )},
    { title: "Private Vault", desc: "PIN-protected storage", icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-teal"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    )},
    { title: "Phone Cleaner", desc: "Free up device space", icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-teal"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    )},
    { title: "Built-in Player", desc: "Video & audio playback", icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-teal"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    )},
    { title: "Works Offline", desc: "Download & watch later", icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-teal"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    )},
    { title: "East Africa First", desc: "Optimized for local networks", icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-teal"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    )},
  ];

  return (
    <Layout>
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section className="bg-navy py-20 text-center">
        <div className="container-site">
          <h1 className="text-3xl font-bold text-white">About MediaVault</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-medium">
            A free media toolkit built for East Africa — download videos and music from your favorite platforms.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-dark">
        <div className="container-site max-w-3xl mx-auto">
          <p className="text-lg text-charcoal dark:text-gray-light leading-relaxed">
            MediaVault is a free media toolkit that lets you download videos and music from YouTube, Spotify, TikTok, Instagram, and more. Save WhatsApp statuses before they disappear. Keep private files in a PIN-protected vault.
          </p>
          <p className="mt-4 text-base text-charcoal dark:text-gray-light leading-relaxed">
            Built for East Africa — optimized for low data usage, works offline, and supports MP3 downloads.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gray-light dark:bg-navy">
        <div className="container-site">
          <h2 className="mb-8 text-center text-2xl font-bold text-navy dark:text-white">Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(f => (
              <div key={f.title} className="card-base p-6 text-center transition-all hover:shadow-cardHover hover:-translate-y-1 dark:bg-navy-dark">
                {f.icon}
                <h3 className="text-lg font-bold mb-2 text-navy dark:text-white">{f.title}</h3>
                <p className="text-sm text-charcoal dark:text-gray-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-dark">
        <div className="container-site max-w-3xl mx-auto text-center">
          <h2 className="mb-8 text-2xl font-bold text-navy dark:text-white">Supported Platforms</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["YouTube", "Spotify", "TikTok", "Instagram", "Facebook", "SoundCloud", "Twitter/X"].map(p => (
              <span key={p} className="rounded-full bg-navy/5 px-5 py-2 text-sm font-medium text-navy dark:bg-navy-light dark:text-white">{p}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-center text-white">
        <div className="container-site">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-medium mb-6">Free downloads, no ads, no registration.</p>
          <a href="/" className="inline-flex items-center justify-center rounded-md bg-teal px-6 py-3 text-sm font-semibold text-white hover:bg-teal-dark transition-colors">
            Start Searching Music
          </a>
        </div>
      </section>
    </Layout>
  );
}