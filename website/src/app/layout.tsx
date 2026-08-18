import type { Metadata } from "next";
import { SongProvider } from "@/lib/song-context";
import { MiniPlayer } from "@/components/layout/MiniPlayer";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "MediaVault — Free Music Downloads | Uganda",
  description: "Download videos and music from YouTube, Spotify, TikTok, and more. Free, fast, and reliable.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Theme — must run first, before any rendering */}
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