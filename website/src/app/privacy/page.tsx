import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";

export const metadata: Metadata = {
  title: "Privacy Policy | MediaVault",
  description: "MediaVault Privacy Policy — Learn how we collect, use, and protect your data. We don't sell your information.",
  openGraph: {
    title: "Privacy Policy | MediaVault",
    description: "Learn how MediaVault handles your data and privacy.",
  },
};

export default function PrivacyPage() {
  // FAQ Schema for Privacy
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does MediaVault collect personal information?",
        acceptedAnswer: { "@type": "Answer", text: "MediaVault does not collect personal information unless you voluntarily provide it through our contact form." },
      },
      {
        "@type": "Question",
        name: "Does MediaVault use cookies?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, we use cookies for Google Analytics and AdSense to understand site traffic and show relevant ads." },
      },
      {
        "@type": "Question",
        name: "Does MediaVault share user data?",
        acceptedAnswer: { "@type": "Answer", text: "No, we never sell or share your personal data with third parties." },
      },
    ],
  };

  return (
    <Layout>
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section className="py-16">
        <div className="container-site max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-medium mb-8">Last updated: May 19, 2026</p>
          
          <div className="space-y-8 text-charcoal dark:text-gray-light">
            <section>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-3">1. Information We Collect</h2>
              <p className="leading-relaxed">We collect information you provide when using our search feature, including search queries. We do not collect personal information unless you voluntarily provide it through our contact form.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-3">2. How We Use Information</h2>
              <p className="leading-relaxed">Search queries are used to fetch results from YouTube and TikTok APIs. We use Google Analytics to understand site traffic and improve user experience. We do not sell or share your data.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-3">3. Cookies</h2>
              <p className="leading-relaxed">We use cookies for Google Analytics and AdSense. You can disable cookies in your browser settings at any time. Essential cookies are required for the site to function properly.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-3">4. Third-Party Services</h2>
              <p className="leading-relaxed">We use YouTube, TikTok, and Google services. Their privacy policies apply when you interact with embedded content or advertisements. Please review their policies for more information.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-3">5. Data Security</h2>
              <p className="leading-relaxed">We take reasonable measures to protect your data. All traffic is encrypted using HTTPS. We do not store your search history on our servers — it's stored locally in your browser.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-3">6. Contact</h2>
              <p className="leading-relaxed">
                For privacy concerns, contact us at{" "}
                <a href="mailto:infohermansoftware@gmail.com" className="text-teal hover:underline">
                  infohermansoftware@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
}