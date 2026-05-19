import { Layout } from "@/components/layout/Layout";

export default function ContactPage() {
  return (
    <Layout>
      <section className="py-16">
        <div className="container-site max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-4">Contact Us</h1>
          <p className="text-charcoal dark:text-gray-light mb-8">
            Have questions, feedback, or need support? We'd love to hear from you.
          </p>
          
          <div className="space-y-4 text-left bg-surface dark:bg-navy rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">📧</span>
              <div>
                <p className="font-semibold text-navy dark:text-white">Email</p>
                <a href="mailto:infohermansoftware@gmail.com" className="text-teal hover:underline">infohermansoftware@gmail.com</a>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">📱</span>
              <div>
                <p className="font-semibold text-navy dark:text-white">Phone / WhatsApp</p>
                <a href="https://wa.me/256772723188" className="text-teal hover:underline">+256 772 723 188</a>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-semibold text-navy dark:text-white">Location</p>
                <p className="text-charcoal dark:text-gray-light">Haji Tarmchi, Jinja, Uganda</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">🌐</span>
              <div>
                <p className="font-semibold text-navy dark:text-white">Website</p>
                <a href="https://herman-software-website.vercel.app" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">HERMAN Software Solutions</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}