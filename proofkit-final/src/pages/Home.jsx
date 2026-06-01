import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Database, Brain, Hexagon, Zap } from 'lucide-react';

const features = [
  { icon:<Shield size={22} color="var(--accent)"/>, title:'On-chain attestations',
    desc:'Skill badges minted as Sui NFT objects — immutable, verifiable, and fully owned by you.' },
  { icon:<Database size={22} color="var(--teal)"/>, title:'Walrus storage',
    desc:'Proof files (PDFs, screenshots, repos) live on decentralised Walrus storage, not a server.' },
  { icon:<Brain size={22} color="var(--amber)"/>, title:'AI-powered review',
    desc:'Claude evaluates your proof and returns a confidence score, skill level, and honest feedback.' },
  { icon:<Zap size={22} color="#a78bfa"/>, title:'Tatum RPC',
    desc:'Reliable Sui blockchain reads and writes via Tatum — no node setup required.' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        minHeight:'84vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'80px 24px', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        {/* grid bg */}
        <div style={{
          position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
          backgroundImage:`linear-gradient(rgba(124,106,247,0.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(124,106,247,0.04) 1px,transparent 1px)`,
          backgroundSize:'52px 52px',
        }}/>
        {/* glow */}
        <div style={{
          position:'absolute', top:'35%', left:'50%', transform:'translate(-50%,-50%)',
          width:700, height:350, pointerEvents:'none', zIndex:0,
          background:'radial-gradient(ellipse,rgba(124,106,247,0.09) 0%,transparent 70%)',
        }}/>

        <div style={{position:'relative',zIndex:1,maxWidth:700}}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'5px 16px', borderRadius:24, marginBottom:32,
            background:'var(--accent-d)', border:'1px solid rgba(124,106,247,0.22)',
            fontSize:12, color:'var(--accent)', fontWeight:700, letterSpacing:'0.06em',
          }}>
            <Hexagon size={12} strokeWidth={2}/> TATUM × WALRUS HACKATHON 2025
          </div>

          <h1 style={{
            fontSize:'clamp(44px,8vw,76px)', fontWeight:800,
            letterSpacing:'-0.045em', lineHeight:1.04, marginBottom:24,
          }}>
            Your skills,<br/>
            <span style={{color:'var(--accent)'}}>verified on-chain.</span>
          </h1>

          <p style={{
            fontSize:18, color:'var(--muted)', lineHeight:1.75,
            maxWidth:540, margin:'0 auto 44px',
          }}>
            Mint skill attestations on Sui. Store proof files on Walrus.
            Let AI validate your work. Share a portfolio no one can fake.
          </p>

          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/mint" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'13px 30px', borderRadius:10, fontSize:15, fontWeight:700,
              background:'var(--accent)', color:'#fff', letterSpacing:'-0.01em',
              boxShadow:'0 0 32px rgba(124,106,247,0.35)',
            }}>
              Mint your first badge <ArrowRight size={16}/>
            </Link>
            <Link to="/portfolio" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'13px 30px', borderRadius:10, fontSize:15, fontWeight:600,
              background:'transparent', color:'var(--muted)',
              border:'1px solid var(--border-h)',
            }}>
              View portfolios
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{
        maxWidth:960, margin:'0 auto', padding:'0 24px 100px',
        display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16,
      }}>
        {features.map(f => (
          <div key={f.title} style={{
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'var(--rl)', padding:'26px 24px',
          }}>
            <div style={{marginBottom:14}}>{f.icon}</div>
            <h3 style={{fontSize:15,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>{f.title}</h3>
            <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.7}}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Tech bar */}
      <div style={{
        borderTop:'1px solid var(--border)', padding:'24px',
        display:'flex', justifyContent:'center', gap:36, flexWrap:'wrap',
      }}>
        {['Sui Blockchain','Walrus Storage','Tatum RPC','Claude AI','Move Language'].map(t=>(
          <span key={t} style={{fontSize:11,color:'var(--dim)',fontFamily:'var(--mono)',letterSpacing:'0.05em'}}>{t}</span>
        ))}
      </div>
    </div>
  );
}
