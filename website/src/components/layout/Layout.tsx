"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "About", href: "/about" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-light bg-white/95 backdrop-blur-sm dark:bg-navy-dark/95 dark:border-navy-light">
        <div className="container-site flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex md:items-center md:gap-1">
            {NAV.map(link => (
              <Link key={link.href} href={link.href} className={cn("rounded-md px-3 py-2 text-sm font-medium transition-colors", isActive(link.href) ? "text-teal" : "text-charcoal hover:text-teal dark:text-gray-light dark:hover:text-teal")}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button onClick={() => setOpen(!open)} className="rounded-md p-2 text-navy dark:text-white md:hidden" aria-label="Toggle menu">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 top-16 z-[9999] bg-white dark:bg-navy-dark md:hidden overflow-y-auto">
          <div className="container-site flex flex-col gap-1 py-4">
            {NAV.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn("rounded-md px-4 py-3 text-base font-medium transition-colors", isActive(link.href) ? "bg-gray-light dark:bg-navy-light text-teal" : "text-charcoal dark:text-white hover:bg-gray-light dark:hover:bg-navy-light hover:text-teal")}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-navy-dark text-white py-10">
        <div className="container-site">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal text-sm font-bold text-white">MV</div>
                <span className="font-bold text-white">MediaVault</span>
              </div>
              <p className="text-xs text-gray-medium">Free music downloads from YouTube, Spotify, TikTok & more. Built in Uganda for East Africa.</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Links</h4>
              <ul className="space-y-1.5">
                <li><a href="/" className="text-xs text-gray-medium hover:text-teal transition-colors">Home</a></li>
                <li><a href="/search" className="text-xs text-gray-medium hover:text-teal transition-colors">Search</a></li>
                <li><a href="/about" className="text-xs text-gray-medium hover:text-teal transition-colors">About</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Contact</h4>
              <ul className="space-y-1.5">
                <li><a href="mailto:infohermansoftware@gmail.com" className="text-xs text-gray-medium hover:text-teal transition-colors">infohermansoftware@gmail.com</a></li>
                <li><a href="https://herman-software-website.vercel.app" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-medium hover:text-teal transition-colors">HERMAN Software Solutions</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Follow</h4>
              <div className="flex gap-2">
                {/* X (Twitter) */}
                <a href="https://x.com/JiangSalim1" target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-gray-medium hover:bg-navy hover:text-white transition-colors" aria-label="X">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* TikTok */}
                <a href="https://www.tiktok.com/@jaingsalim1" target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-gray-medium hover:bg-navy hover:text-white transition-colors" aria-label="TikTok">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
                {/* Facebook */}
                <a href="https://www.facebook.com/jiangsalim1" target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-gray-medium hover:bg-navy hover:text-white transition-colors" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/jiang_salim" target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-gray-medium hover:bg-navy hover:text-white transition-colors" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                {/* YouTube */}
                <a href="https://youtube.com/@jaingsalim1845" target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-gray-medium hover:bg-navy hover:text-white transition-colors" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-navy mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs text-gray-medium">© {new Date().getFullYear()} MediaVault. Built by <a href="https://herman-software-website.vercel.app" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">HERMAN Software Solutions</a>.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
