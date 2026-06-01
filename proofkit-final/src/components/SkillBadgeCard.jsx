import { ExternalLink, Link2, FileText, Brain, Loader } from 'lucide-react';
import { walrusBlobUrl } from '../lib/walrus';

const CAT_STYLE = {
  'Smart Contracts': { bg:'rgba(124,106,247,0.12)', color:'#a89af9', border:'rgba(124,106,247,0.25)' },
  'Frontend':        { bg:'rgba(45,212,170,0.10)',  color:'#2dd4aa', border:'rgba(45,212,170,0.22)' },
  'Backend':         { bg:'rgba(240,160,64,0.10)',  color:'#f0a040', border:'rgba(240,160,64,0.22)' },
  'DevOps':          { bg:'rgba(248,113,113,0.10)', color:'#f87171', border:'rgba(248,113,113,0.22)' },
  'AI/ML':           { bg:'rgba(96,165,250,0.10)',  color:'#60a5fa', border:'rgba(96,165,250,0.22)' },
  'Other':           { bg:'rgba(100,99,122,0.12)',  color:'#8b8aa0', border:'rgba(100,99,122,0.25)' },
};

const VERDICT = {
  confirmed:  { label:'✓ AI Confirmed', color:'var(--teal)' },
  partial:    { label:'~ AI Partial',   color:'var(--amber)' },
  unverified: { label:'? Unverified',   color:'var(--muted)' },
};

const LEVEL_N = { beginner:1, intermediate:2, advanced:3, expert:4 };

export default function SkillBadgeCard({ badge, onReview, reviewing }) {
  const cat  = CAT_STYLE[badge.category] || CAT_STYLE['Other'];
  const v    = badge.aiReview ? VERDICT[badge.aiReview.verdict] : null;
  const dots = badge.aiReview ? (LEVEL_N[badge.aiReview.skillLevel] || 0) : 0;
  const date = new Date(Number(badge.mintedAt)).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });

  return (
    <div className="fade-in" style={{
      background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--rl)',
      padding:'22px 24px', display:'flex', flexDirection:'column', gap:14,
      transition:'border-color 0.2s',
    }}
      onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-h)'}
      onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
    >
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
        <div>
          <span style={{
            display:'inline-block', padding:'3px 10px', borderRadius:20, fontSize:11,
            fontWeight:700, letterSpacing:'0.04em', marginBottom:8,
            background:cat.bg, color:cat.color, border:`1px solid ${cat.border}`,
          }}>{badge.category}</span>
          <h3 style={{fontSize:19,fontWeight:800,letterSpacing:'-0.03em',lineHeight:1.2}}>
            {badge.skillName}
          </h3>
        </div>
        {v && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5,flexShrink:0}}>
            <span style={{fontSize:11,color:v.color,fontWeight:700}}>{v.label}</span>
            <div style={{display:'flex',gap:3}}>
              {[1,2,3,4].map(i=>(
                <div key={i} style={{
                  width:7,height:7,borderRadius:'50%',
                  background: i<=dots ? v.color : 'var(--bg4)',
                  border:`1px solid ${i<=dots ? v.color : 'var(--border)'}`,
                }}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {badge.description && (
        <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.65,margin:0}}>
          {badge.description}
        </p>
      )}

      {/* AI review box */}
      {badge.aiReview?.summary && (
        <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,padding:'10px 14px'}}>
          <div style={{fontSize:11,color:'var(--accent)',fontWeight:700,marginBottom:5,display:'flex',alignItems:'center',gap:5}}>
            <Brain size={11}/> AI review
          </div>
          <p style={{fontSize:12,color:'var(--muted)',lineHeight:1.65,margin:0}}>{badge.aiReview.summary}</p>
        </div>
      )}

      {/* Confidence bar */}
      {badge.aiReview?.confidence != null && (
        <div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--dim)',marginBottom:5}}>
            <span>Confidence</span><span>{badge.aiReview.confidence}%</span>
          </div>
          <div style={{height:3,background:'var(--bg4)',borderRadius:2,overflow:'hidden'}}>
            <div style={{
              height:'100%',borderRadius:2,transition:'width 0.8s ease',
              width:`${badge.aiReview.confidence}%`,
              background: badge.aiReview.confidence>70 ? 'var(--teal)' : 'var(--amber)',
            }}/>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'auto',paddingTop:4,flexWrap:'wrap',gap:8}}>
        <div style={{display:'flex',gap:12}}>
          {badge.blobId && !badge.blobId.startsWith('demo') && (
            <a href={walrusBlobUrl(badge.blobId)} target="_blank" rel="noreferrer"
              style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'var(--muted)'}}>
              <FileText size={12}/> Walrus proof
            </a>
          )}
          {badge.githubUrl && (
            <a href={badge.githubUrl} target="_blank" rel="noreferrer"
              style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'var(--muted)'}}>
              <Link2 size={12}/> GitHub
            </a>
          )}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:11,color:'var(--dim)',fontFamily:'var(--mono)'}}>{date}</span>
          {!badge.aiReview && onReview && (
            <button onClick={()=>onReview(badge)} disabled={reviewing} style={{
              fontSize:11,padding:'5px 12px',borderRadius:6,fontWeight:700,
              background:'var(--accent-d)',border:'1px solid rgba(124,106,247,0.3)',
              color:'var(--accent)',display:'flex',alignItems:'center',gap:5,
              cursor: reviewing ? 'wait' : 'pointer',
            }}>
              {reviewing ? <Loader size={11} className="spin"/> : <Brain size={11}/>}
              {reviewing ? 'Reviewing…' : 'AI review'}
            </button>
          )}
        </div>
      </div>

      {badge.id && !badge.id.startsWith('demo') && (
        <a href={`https://suiscan.xyz/testnet/object/${badge.id}`}
          target="_blank" rel="noreferrer"
          style={{fontSize:10,color:'var(--dim)',fontFamily:'var(--mono)',display:'flex',alignItems:'center',gap:4}}>
          <ExternalLink size={10}/>{badge.id.slice(0,20)}…{badge.id.slice(-6)}
        </a>
      )}
    </div>
  );
}
