import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "MediaVault — Free Music Downloads | Uganda",
  description: "Download videos and music from YouTube, Spotify, TikTok, and more. Free, fast, and reliable.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');})();` }} />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-charcoal dark:bg-navy-dark dark:text-gray-light transition-colors">
        {children}
      </body>
    </html>
  );
}
