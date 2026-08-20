import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";

export const metadata: Metadata = {
  title: "Contact MediaVault — Free Music Downloads",
  description: "Contact MediaVault for support, feedback, or business inquiries. Email us at infohermansoftware@gmail.com or reach us on WhatsApp.",
  keywords: ["contact MediaVault", "support", "music downloader help", "MediaVault Uganda"],
};

export default function ContactPage() {
  const contactLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MediaVault",
    url: "https://media-vault-website.vercel.app/contact",
    mainEntity: {
      "@type": "Organization",
      name: "MediaVault",
      email: "infohermansoftware@gmail.com",
      telephone: "+256772723188",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Haji Tarmchi",
        addressLocality: "Jinja",
        addressCountry: "UG",
      },
    },
  };

  const contacts = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      label: "Email",
      value: "infohermansoftware@gmail.com",
      href: "mailto:infohermansoftware@gmail.com",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      label: "Phone / WhatsApp",
      value: "+256 772 723 188",
      href: "https://wa.me/256772723188",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      label: "Location",
      value: "Haji Tarmchi, Jinja, Uganda",
      href: null,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
      label: "Website",
      value: "HERMAN Software Solutions",
      href: "https://herman-software-website.vercel.app",
    },
  ];

  return (
    <Layout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />

      <section className="py-16">
        <div className="container-site max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-4">Contact Us</h1>
          <p className="text-charcoal dark:text-gray-light mb-8">
            Have questions, feedback, or need support? We'd love to hear from you.
          </p>

          <div className="space-y-4 text-left bg-surface dark:bg-navy rounded-xl p-6 shadow-sm">
            {contacts.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="flex-shrink-0">{c.icon}</span>
                <div>
                  <p className="font-semibold text-navy dark:text-white">{c.label}</p>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-teal hover:underline"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-charcoal dark:text-gray-light">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}