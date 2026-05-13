import Layout from '../components/Layout';
export default function About() {
  return (
    <Layout>
      <div className="container" style={{padding:'40px 0',maxWidth:700}}>
        <h1 style={{fontSize:28,marginBottom:20}}>About MediaVault</h1>
        <p style={{color:'#999',lineHeight:1.8,marginBottom:16}}>MediaVault is a free media toolkit that lets you download videos and music from YouTube, Spotify, TikTok, Instagram, and more. Save WhatsApp statuses before they disappear. Keep private files in a PIN-protected vault.</p>
        <p style={{color:'#999',lineHeight:1.8,marginBottom:16}}>Built for East Africa — optimized for low data usage, works offline, and supports MP3 downloads.</p>
        <h2 style={{fontSize:20,margin:'24px 0 12px'}}>Features</h2>
        <ul style={{color:'#999',lineHeight:2,listStyle:'inside'}}>
          <li>Download videos in HD (360p to 4K)</li>
          <li>Extract audio as MP3/M4A</li>
          <li>Save WhatsApp statuses</li>
          <li>Private vault with PIN protection</li>
          <li>Phone cleaning tools</li>
          <li>Built-in video & audio player</li>
          <li>Works offline</li>
        </ul>
      </div>
    </Layout>
  );
}
