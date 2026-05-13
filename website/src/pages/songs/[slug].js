import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function SongPage() {
  const router = useRouter();
  const { slug } = router.query;

  function thumb(id) { return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; }

  return (
    <Layout>
      <Head><title>Download Song | MediaVault</title></Head>
      <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:4,color:'#888',fontSize:14,marginTop:16}}>← Back</Link>
      <div style={{maxWidth:450,margin:'30px auto',background:'#fff',borderRadius:16,padding:32,textAlign:'center',border:'1px solid #eee'}}>
        <div style={{width:200,height:112,borderRadius:10,overflow:'hidden',margin:'0 auto 20px',background:'#f0f0f0'}}>
          <img src={thumb(slug)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} />
        </div>
        <h2 style={{fontSize:20,fontWeight:700,marginBottom:4}}>{slug ? slug.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase()) : 'Song'}</h2>
        <p style={{color:'#888',marginBottom:20}}>MP3 Download</p>
        
        <div style={{background:'linear-gradient(135deg,#e53935,#c5303c)',borderRadius:12,padding:24,textAlign:'center',color:'#fff'}}>
          <div style={{fontSize:40,marginBottom:8}}>📱</div>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:4}}>Get the App to Download</h3>
          <p style={{fontSize:14,opacity:0.9,marginBottom:16,lineHeight:1.5}}>
            Download songs in MP3, M4A — multiple qualities.<br/>
            Also get video downloads, WhatsApp Status Saver, Private Vault & more.
          </p>
          <a href="https://apkpure.com/mediavault" target="_blank" rel="noopener" 
            style={{display:'inline-block',background:'#fff',color:'#e53935',padding:'14px 32px',borderRadius:8,fontWeight:700,fontSize:15,textDecoration:'none'}}>
            Get MediaVault App — Free
          </a>
        </div>
      </div>
    </Layout>
  );
}
