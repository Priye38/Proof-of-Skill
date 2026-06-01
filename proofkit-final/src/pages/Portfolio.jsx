import { useState } from 'react';
import { Search, Loader, UserCircle, Hexagon, ArrowRight } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Link } from 'react-router-dom';
import SkillBadgeCard from '../components/SkillBadgeCard';
import { fetchBadges } from '../lib/sui';
import { fetchBlobText } from '../lib/walrus';
import { reviewSkillProof } from '../lib/ai';

export default function Portfolio() {
  const account = useCurrentAccount();
  const [input,       setInput]       = useState('');
  const [badges,      setBadges]      = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [searched,    setSearched]    = useState(false);
  const [error,       setError]       = useState('');
  const [reviewingId, setReviewingId] = useState(null);

  const search = async (addr) => {
    const target = (addr || input).trim();
    if (!target) return;
    setLoading(true); setError(''); setSearched(false);
    try {
      const result = await fetchBadges(target);
      setBadges(result);
      setSearched(true);
    } catch(e) {
      setError('Could not fetch badges: ' + e.message);
      setBadges([]);
      setSearched(true);
    } finally { setLoading(false); }
  };

  const loadMine = () => {
    if (!account) return;
    setInput(account.address);
    search(account.address);
  };

  const handleReview = async (badge) => {
    setReviewingId(badge.id);
    try {
      let proofText = `Skill: ${badge.skillName}\nDescription: ${badge.description}`;
      if (badge.blobId) {
        try { proofText += '\n\n' + await fetchBlobText(badge.blobId); } catch {}
      }
      const review = await reviewSkillProof({ proofText, skillName: badge.skillName, description: badge.description });
      setBadges(prev => prev.map(b => b.id===badge.id ? {...b, aiReview:review} : b));
    } catch(e) {
      alert('AI review failed: ' + e.message);
    } finally { setReviewingId(null); }
  };

  const groups = badges.reduce((acc,b) => {
    (acc[b.category] = acc[b.category]||[]).push(b); return acc;
  }, {});

  const confirmed = badges.filter(b=>b.aiReview?.verdict==='confirmed').length;

  return (
    <div style={{maxWidth:920,margin:'0 auto',padding:'60px 24px'}}>
      <div style={{marginBottom:40}}>
        <h1 style={{fontSize:30,fontWeight:800,letterSpacing:'-0.04em',marginBottom:8}}>
          Skill portfolios
        </h1>
        <p style={{color:'var(--muted)',fontSize:14}}>
          Enter any Sui wallet address to view their verified skill badges.
        </p>
      </div>

      {/* Search */}
      <div style={{display:'flex',gap:10,marginBottom:44,flexWrap:'wrap'}}>
        <div style={{position:'relative',flex:1,minWidth:200}}>
          <Search size={15} color="var(--dim)" style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)'}}/>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&search()}
            placeholder="0x… Sui wallet address"
            style={{paddingLeft:38,fontFamily:'var(--mono)',fontSize:13}}/>
        </div>
        {account && (
          <button onClick={loadMine} style={{
            padding:'10px 16px',borderRadius:8,fontSize:13,fontWeight:600,
            background:'var(--bg3)',border:'1px solid var(--border-h)',
            color:'var(--muted)',display:'flex',alignItems:'center',gap:6,
          }}>
            <UserCircle size={14}/> Mine
          </button>
        )}
        <button onClick={()=>search()} disabled={loading} style={{
          padding:'10px 22px',borderRadius:8,fontSize:14,fontWeight:700,
          background:'var(--accent)',color:'#fff',
        }}>
          {loading ? <Loader size={15} className="spin"/> : 'Search'}
        </button>
      </div>

      {error && (
        <div style={{padding:'11px 16px',background:'var(--amber-g)',
          border:'1px solid rgba(240,160,64,0.25)',borderRadius:8,
          fontSize:13,color:'var(--amber)',marginBottom:28}}>
          {error}
        </div>
      )}

      {/* Stats — only show when badges exist */}
      {badges.length > 0 && (
        <div style={{display:'flex',gap:14,marginBottom:38,flexWrap:'wrap'}}>
          {[
            {label:'Total badges',  val:badges.length},
            {label:'AI reviewed',   val:badges.filter(b=>b.aiReview).length},
            {label:'Confirmed',     val:confirmed},
            {label:'Categories',    val:Object.keys(groups).length},
          ].map(s=>(
            <div key={s.label} style={{
              flex:'1 1 120px',background:'var(--bg2)',
              border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'16px 20px',
            }}>
              <div style={{fontSize:28,fontWeight:800,letterSpacing:'-0.05em'}}>{s.val}</div>
              <div style={{fontSize:12,color:'var(--muted)',marginTop:3}}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Badge groups */}
      {badges.length > 0 && Object.entries(groups).map(([cat,catBadges])=>(
        <div key={cat} style={{marginBottom:42}}>
          <div style={{
            fontSize:11,fontWeight:800,letterSpacing:'0.1em',color:'var(--dim)',
            marginBottom:16,paddingBottom:8,borderBottom:'1px solid var(--border)',
            textTransform:'uppercase',
          }}>{cat}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
            {catBadges.map(b=>(
              <SkillBadgeCard key={b.id} badge={b}
                onReview={handleReview} reviewing={reviewingId===b.id}/>
            ))}
          </div>
        </div>
      ))}

      {/* Empty states */}
      {!searched && badges.length===0 && (
        <div style={{
          textAlign:'center',padding:'80px 24px',
          border:'1px dashed var(--border)',borderRadius:'var(--rl)',
          background:'var(--bg2)',
        }}>
          <Search size={36} color="var(--dim)" style={{margin:'0 auto 16px'}}/>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:8,letterSpacing:'-0.03em'}}>
            Search a wallet
          </h3>
          <p style={{color:'var(--muted)',fontSize:14,marginBottom:24,maxWidth:360,margin:'0 auto 24px'}}>
            Enter any Sui wallet address above to view their skill badges,
            or connect your wallet and click "Mine".
          </p>
          {!account && (
            <p style={{fontSize:13,color:'var(--dim)'}}>
              No wallet connected — <Link to="/mint" style={{color:'var(--accent)'}}>
                connect and mint your first badge →
              </Link>
            </p>
          )}
        </div>
      )}

      {searched && badges.length===0 && !error && (
        <div style={{
          textAlign:'center',padding:'80px 24px',
          border:'1px dashed var(--border)',borderRadius:'var(--rl)',
          background:'var(--bg2)',
        }}>
          <Hexagon size={36} color="var(--dim)" strokeWidth={1} style={{margin:'0 auto 16px'}}/>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:8,letterSpacing:'-0.03em'}}>
            No badges yet
          </h3>
          <p style={{color:'var(--muted)',fontSize:14,marginBottom:28,maxWidth:360,margin:'0 auto 28px'}}>
            This wallet hasn't minted any skill badges yet.
            Be the first — upload a proof file and mint on Sui.
          </p>
          <Link to="/mint" style={{
            display:'inline-flex',alignItems:'center',gap:8,
            padding:'11px 24px',background:'var(--accent)',color:'#fff',
            borderRadius:10,fontWeight:700,fontSize:14,
          }}>
            Mint your first badge <ArrowRight size={14}/>
          </Link>
        </div>
      )}
    </div>
  );
}
