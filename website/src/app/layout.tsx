import type { Metadata, Viewport } from "next";
import { SongProvider } from "@/lib/song-context";
import { MiniPlayer } from "@/components/layout/MiniPlayer";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const siteUrl = "https://media-vault-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MediaVault — Free Music Downloads | Uganda",
    template: "%s | MediaVault",
  },
  description: "Download free MP3 music, videos, and trending songs from YouTube, TikTok, and more. Fast, free, and reliable music downloads in Uganda and East Africa.",
  keywords: [
    "free music downloads",
    "download MP3",
    "YouTube to MP3",
    "Uganda music",
    "East African music",
    "afrobeat downloads",
    "bongo flava",
    "dancehall MP3",
    "gospel music Uganda",
    "amapiano downloads",
    "TikTok songs",
    "music downloader",
  ],
  authors: [{ name: "MediaVault", url: siteUrl }],
  creator: "HERMAN Software Solutions",
  publisher: "MediaVault",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "MediaVault — Free Music Downloads",
    description: "Download free MP3 music, videos, and trending songs from YouTube, TikTok, and more. Built in Uganda for East Africa.",
    siteName: "MediaVault",
    locale: "en_UG",
    images: [
      {
        url: `${siteUrl}/logo.svg`,
        width: 512,
        height: 512,
        alt: "MediaVault Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediaVault — Free Music Downloads",
    description: "Download free MP3 music, videos, and trending songs from YouTube, TikTok, and more.",
    site: "@MediaVault",
    creator: "@jaingsalim1",
    images: [`${siteUrl}/logo.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googlee083547305f9a958",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0E21" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MediaVault",
    url: siteUrl,
    description: "Free music downloads from YouTube, TikTok, and more. Built in Uganda for East Africa.",
    publisher: {
      "@type": "Organization",
      name: "MediaVault",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.svg`,
      },
    },
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MediaVault",
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    sameAs: [
      "https://x.com/JiangSalim1",
      "https://www.tiktok.com/@jaingsalim1",
      "https://www.facebook.com/jiangsalim1",
      "https://www.instagram.com/jiang_salim",
      "https://youtube.com/@jaingsalim1845",
    ],
  };

  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />

        {/* Structured Data - Organization with Social Links */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />

        {/* Theme */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');})();`,
          }}
        />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NPHMPBV309" />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-NPHMPBV309');`,
          }}
        />

        {/* AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3729484048636616"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-charcoal dark:bg-navy-dark dark:text-gray-light transition-colors">
        <SongProvider>
          {children}
          <MiniPlayer />
        </SongProvider>
        <Analytics />
      </body>
    </html>
  );
}