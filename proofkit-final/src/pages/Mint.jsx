import { useState, useRef } from 'react';
import { Upload, CheckCircle, Loader, AlertCircle, ChevronRight, FileText } from 'lucide-react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';
import { uploadToWalrus } from '../lib/walrus';
import { buildMintTx, PKG } from '../lib/sui';

const CATS = ['Smart Contracts','Frontend','Backend','DevOps','AI/ML','Other'];

function Step({ n, label, current }) {
  const done = n < current;
  const active = n === current;
  return (
    <div style={{display:'flex',alignItems:'center'}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
        <div style={{
          width:34,height:34,borderRadius:'50%',display:'flex',
          alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,
          background: done?'var(--teal)':active?'var(--accent)':'var(--bg3)',
          border: active?'2px solid var(--accent)':'1px solid var(--border)',
          color: (done||active)?'#fff':'var(--dim)', transition:'all 0.3s',
        }}>
          {done ? <CheckCircle size={16}/> : n+1}
        </div>
        <span style={{fontSize:11,fontWeight:active?700:400,color:active?'var(--text)':'var(--dim)',whiteSpace:'nowrap'}}>
          {label}
        </span>
      </div>
    </div>
  );
}

function StepBar({ current }) {
  const steps = ['Upload proof','Skill details','Mint on Sui'];
  return (
    <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:44}}>
      {steps.map((s,i) => (
        <div key={s} style={{display:'flex',alignItems:'center'}}>
          <Step n={i} label={s} current={current}/>
          {i < steps.length-1 && (
            <div style={{
              width:70,height:1,margin:'0 6px',marginBottom:22,
              background: i<current ? 'var(--teal)' : 'var(--border)',
              transition:'background 0.4s',
            }}/>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Mint() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [step,      setStep]      = useState(0);
  const [file,      setFile]      = useState(null);
  const [blobId,    setBlobId]    = useState('');
  const [uploading, setUploading] = useState(false);
  const [upErr,     setUpErr]     = useState('');
  const [form,      setForm]      = useState({ skillName:'', category:'Frontend', description:'', githubUrl:'' });
  const [minting,   setMinting]   = useState(false);
  const [mintErr,   setMintErr]   = useState('');
  const [txDigest,  setTxDigest]  = useState('');
  const fileRef = useRef();

  const contractReady = !!PKG;

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f); setUpErr(''); setUploading(true);
    try {
      const id = await uploadToWalrus(f);
      setBlobId(id);
      setStep(1);
    } catch(e) {
      setUpErr(e.message);
    } finally { setUploading(false); }
  };

  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer?.files?.[0]); };
  const handleInput = (e) => handleFile(e.target.files?.[0]);

  const handleMint = () => {
    if (!contractReady) {
      // Demo mode — contract not deployed yet
      setMinting(true);
      setTimeout(() => {
        setTxDigest('DEMO_' + Math.random().toString(36).slice(2,14).toUpperCase());
        setMinting(false);
      }, 1800);
      return;
    }

    setMinting(true); setMintErr('');
    const tx = buildMintTx({ ...form, blobId });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          setTxDigest(result.digest);
          setMinting(false);
        },
        onError: (e) => {
          setMintErr(e.message || 'Transaction failed');
          setMinting(false);
        },
      }
    );
  };

  if (!account) return (
    <div style={{maxWidth:480,margin:'110px auto',textAlign:'center',padding:'0 24px'}}>
      <h2 style={{fontSize:26,fontWeight:800,letterSpacing:'-0.04em',marginBottom:12}}>
        Connect your wallet
      </h2>
      <p style={{color:'var(--muted)',marginBottom:32,fontSize:15}}>
        You need a Sui wallet to mint skill badges on-chain.
        Install the <a href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
          target="_blank" rel="noreferrer" style={{color:'var(--accent)'}}>Sui Wallet extension</a> if you haven't.
      </p>
      <ConnectButton style={{
        padding:'13px 32px',borderRadius:10,fontSize:15,fontWeight:700,
        background:'var(--accent)',color:'#fff',border:'none',cursor:'pointer',fontFamily:'var(--font)',
      }}/>
    </div>
  );

  if (txDigest) return (
    <div style={{maxWidth:520,margin:'80px auto',textAlign:'center',padding:'0 24px'}}>
      <CheckCircle size={56} color="var(--teal)" style={{margin:'0 auto 20px'}}/>
      <h2 style={{fontSize:28,fontWeight:800,letterSpacing:'-0.04em',marginBottom:12}}>Badge minted!</h2>
      <p style={{color:'var(--muted)',marginBottom:28,fontSize:15}}>
        Your skill attestation is on-chain and your proof is stored on Walrus.
      </p>
      {!txDigest.startsWith('DEMO') && (
        <a href={`https://suiscan.xyz/testnet/tx/${txDigest}`} target="_blank" rel="noreferrer"
          style={{display:'block',marginBottom:24,fontSize:12,color:'var(--teal)',fontFamily:'var(--mono)'}}>
          tx: {txDigest}
        </a>
      )}
      {txDigest.startsWith('DEMO') && (
        <p style={{fontSize:12,color:'var(--amber)',marginBottom:24}}>
          Demo mode — deploy the Move contract to mint for real.
        </p>
      )}
      <a href={`/portfolio`} style={{
        display:'inline-block',padding:'12px 28px',background:'var(--accent)',
        color:'#fff',borderRadius:10,fontWeight:700,fontSize:14,
      }}>View my portfolio →</a>
    </div>
  );

  return (
    <div style={{maxWidth:580,margin:'0 auto',padding:'60px 24px'}}>
      <h1 style={{fontSize:30,fontWeight:800,letterSpacing:'-0.04em',marginBottom:8}}>Mint a skill badge</h1>
      <p style={{color:'var(--muted)',fontSize:14,marginBottom:40}}>
        Upload proof → store on Walrus → mint on Sui.
        {!contractReady && <span style={{color:'var(--amber)'}}> (Demo mode — contract not yet deployed)</span>}
      </p>

      <StepBar current={step}/>

      {/* STEP 0 */}
      {step===0 && (
        <div>
          <div
            onDragOver={e=>e.preventDefault()} onDrop={handleDrop}
            onClick={()=>fileRef.current?.click()}
            style={{
              border:`2px dashed ${uploading?'var(--accent)':'var(--border-h)'}`,
              borderRadius:'var(--rl)', padding:'64px 24px', textAlign:'center',
              cursor:'pointer', background:uploading?'var(--accent-d)':'var(--bg2)',
              transition:'all 0.2s',
            }}
          >
            <input ref={fileRef} type="file" style={{display:'none'}}
              accept=".pdf,.png,.jpg,.jpeg,.md,.txt,.zip" onChange={handleInput}/>
            {uploading ? (
              <>
                <Loader size={34} color="var(--accent)" className="spin" style={{margin:'0 auto'}}/>
                <p style={{marginTop:18,color:'var(--accent)',fontWeight:700,fontSize:15}}>
                  Uploading to Walrus…
                </p>
              </>
            ) : (
              <>
                <Upload size={34} color="var(--dim)" style={{margin:'0 auto'}}/>
                <p style={{marginTop:18,fontWeight:700,fontSize:16}}>Drop your proof file here</p>
                <p style={{color:'var(--muted)',fontSize:13,marginTop:6}}>
                  PDF, PNG, JPG, MD, TXT, ZIP · max 10 MB
                </p>
              </>
            )}
          </div>
          {upErr && (
            <div style={{marginTop:14,padding:'12px 16px',background:'var(--red-g)',
              border:'1px solid rgba(248,113,113,0.25)',borderRadius:8,
              display:'flex',gap:10,alignItems:'center'}}>
              <AlertCircle size={15} color="var(--red)"/>
              <span style={{fontSize:13,color:'var(--red)'}}>{upErr}</span>
            </div>
          )}
          <p style={{marginTop:18,fontSize:12,color:'var(--dim)',textAlign:'center'}}>
            Files are stored on Walrus decentralised storage. The blob ID is recorded on-chain.
          </p>
        </div>
      )}

      {/* STEP 1 */}
      {step===1 && (
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          <div style={{
            padding:'12px 16px',background:'var(--teal-g)',
            border:'1px solid rgba(45,212,170,0.22)',borderRadius:8,
            display:'flex',gap:8,alignItems:'flex-start',
          }}>
            <FileText size={14} color="var(--teal)" style={{marginTop:2,flexShrink:0}}/>
            <div>
              <div style={{fontSize:11,color:'var(--teal)',fontWeight:700,marginBottom:3}}>
                Walrus blob ID — proof uploaded
              </div>
              <div style={{fontSize:12,color:'var(--teal)',fontFamily:'var(--mono)',wordBreak:'break-all'}}>
                {blobId}
              </div>
            </div>
          </div>

          <div>
            <label style={{fontSize:13,color:'var(--muted)',display:'block',marginBottom:6}}>Skill name *</label>
            <input value={form.skillName} onChange={e=>setForm({...form,skillName:e.target.value})}
              placeholder="e.g. Solidity, React, Move, Rust"/>
          </div>
          <div>
            <label style={{fontSize:13,color:'var(--muted)',display:'block',marginBottom:6}}>Category</label>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
              style={{background:'var(--bg3)',border:'1px solid var(--border)',color:'var(--text)',
                borderRadius:8,padding:'10px 14px',fontSize:14,width:'100%',outline:'none'}}>
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:13,color:'var(--muted)',display:'block',marginBottom:6}}>Description</label>
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
              placeholder="Describe what you built or learned to demonstrate this skill…"
              rows={4} style={{resize:'vertical'}}/>
          </div>
          <div>
            <label style={{fontSize:13,color:'var(--muted)',display:'block',marginBottom:6}}>GitHub URL (optional)</label>
            <input value={form.githubUrl} onChange={e=>setForm({...form,githubUrl:e.target.value})}
              placeholder="https://github.com/you/project"/>
          </div>
          <button onClick={()=>setStep(2)} disabled={!form.skillName} style={{
            padding:13,background:'var(--bg3)',border:'1px solid var(--border-h)',
            color:form.skillName?'var(--text)':'var(--dim)',borderRadius:10,
            fontSize:15,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            opacity:form.skillName?1:0.5,
          }}>
            Continue to mint <ChevronRight size={16}/>
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step===2 && (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--rl)',padding:'22px 24px'}}>
            <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Badge summary</h3>
            {[
              ['Skill',       form.skillName],
              ['Category',    form.category],
              ['Walrus blob', blobId.slice(0,28)+'…'],
              ['Wallet',      account.address.slice(0,18)+'…'],
            ].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',
                borderBottom:'1px solid var(--border)',fontSize:14}}>
                <span style={{color:'var(--muted)'}}>{k}</span>
                <span style={{fontFamily:k==='Skill'||k==='Category'?'inherit':'var(--mono)',fontSize:13}}>
                  {v}
                </span>
              </div>
            ))}
          </div>

          {mintErr && (
            <div style={{padding:'12px 16px',background:'var(--red-g)',
              border:'1px solid rgba(248,113,113,0.25)',borderRadius:8,
              fontSize:13,color:'var(--red)'}}>
              {mintErr}
            </div>
          )}

          <button onClick={handleMint} disabled={minting} style={{
            padding:14,background:'var(--accent)',color:'#fff',borderRadius:10,
            fontSize:15,fontWeight:700,display:'flex',alignItems:'center',
            justifyContent:'center',gap:8,opacity:minting?0.7:1,
            boxShadow:'0 0 28px rgba(124,106,247,0.30)',
          }}>
            {minting
              ? <><Loader size={16} className="spin"/> Minting on Sui…</>
              : contractReady ? 'Mint badge on Sui' : 'Mint badge (demo mode)'
            }
          </button>
          <button onClick={()=>setStep(1)} style={{
            padding:'10px',background:'transparent',border:'1px solid var(--border)',
            color:'var(--muted)',borderRadius:10,fontSize:13,
          }}>← Back</button>
        </div>
      )}
    </div>
  );
}
