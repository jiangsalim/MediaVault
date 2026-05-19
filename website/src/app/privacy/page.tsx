import { Layout } from "@/components/layout/Layout";

export default function PrivacyPage() {
  return (
    <Layout>
      <section className="py-16">
        <div className="container-site max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-medium mb-8">Last updated: May 19, 2026</p>
          
          <div className="space-y-6 text-charcoal dark:text-gray-light">
            <div>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-2">1. Information We Collect</h2>
              <p>We collect information you provide when using our search feature, including search queries. We do not collect personal information unless you voluntarily provide it.</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-2">2. How We Use Information</h2>
              <p>Search queries are used to fetch results from YouTube and TikTok APIs. We use Google Analytics to understand site traffic. We do not sell or share your data.</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-2">3. Cookies</h2>
              <p>We use cookies for Google Analytics and AdSense. You can disable cookies in your browser settings.</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-2">4. Third-Party Services</h2>
              <p>We use YouTube, TikTok, and Google services. Their privacy policies apply when you interact with embedded content.</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-navy dark:text-white mb-2">5. Contact</h2>
              <p>For privacy concerns, contact us at <a href="mailto:infohermansoftware@gmail.com" className="text-teal hover:underline">infohermansoftware@gmail.com</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}