import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { Hexagon, ExternalLink, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  const short = (a) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : '';

  const links = [
    { to: '/', label: 'Home' },
    { to: '/mint', label: 'Mint badge' },
    { to: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <>
      <nav style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 20px', borderBottom:'1px solid var(--border)',
        background:'rgba(9,9,14,0.95)', backdropFilter:'blur(14px)',
        position:'sticky', top:0, zIndex:200,
      }}>
        {/* Logo */}
        <Link to="/" onClick={()=>setMenuOpen(false)}
          style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
          <Hexagon size={20} color="var(--accent)" strokeWidth={1.5}/>
          <span style={{fontWeight:800,fontSize:15,letterSpacing:'-0.03em'}}>ProofKit</span>
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <div style={{display:'flex',gap:2}} className="desktop-nav">
          {links.map(l=>(
            <Link key={l.to} to={l.to} style={{
              padding:'6px 14px',borderRadius:8,fontSize:13,fontWeight:500,
              color:pathname===l.to?'var(--text)':'var(--muted)',
              background:pathname===l.to?'var(--bg3)':'transparent',
              transition:'all 0.15s',whiteSpace:'nowrap',
            }}>{l.label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
          {/* Wallet — desktop only */}
          <div className="desktop-nav">
            {account ? (
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <a href={`https://suiscan.xyz/testnet/account/${account.address}`}
                  target="_blank" rel="noreferrer"
                  style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'var(--teal)',fontFamily:'var(--mono)'}}>
                  {short(account.address)}<ExternalLink size={10}/>
                </a>
                <button onClick={()=>disconnect()} style={{
                  padding:'6px 14px',borderRadius:8,fontSize:12,fontWeight:600,
                  background:'transparent',border:'1px solid var(--border-h)',color:'var(--muted)',
                }}>Disconnect</button>
              </div>
            ) : (
              <ConnectButton style={{
                padding:'7px 18px',borderRadius:8,fontSize:13,fontWeight:700,
                background:'var(--accent)',color:'#fff',border:'none',
                cursor:'pointer',fontFamily:'var(--font)',
              }}/>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="mobile-menu-btn"
            onClick={()=>setMenuOpen(!menuOpen)}
            style={{
              display:'none',background:'var(--bg3)',border:'1px solid var(--border)',
              borderRadius:8,padding:'7px',color:'var(--text)',
              alignItems:'center',justifyContent:'center',
            }}>
            {menuOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position:'fixed',top:53,left:0,right:0,zIndex:199,
          background:'rgba(9,9,14,0.98)',backdropFilter:'blur(14px)',
          borderBottom:'1px solid var(--border)',
          padding:'16px 20px 24px',
          display:'flex',flexDirection:'column',gap:4,
        }}>
          {links.map(l=>(
            <Link key={l.to} to={l.to}
              onClick={()=>setMenuOpen(false)}
              style={{
                padding:'13px 16px',borderRadius:10,fontSize:15,fontWeight:600,
                color:pathname===l.to?'var(--text)':'var(--muted)',
                background:pathname===l.to?'var(--bg3)':'transparent',
                borderLeft:pathname===l.to?'3px solid var(--accent)':'3px solid transparent',
                transition:'all 0.15s',
              }}>{l.label}</Link>
          ))}

          {/* Wallet in mobile menu */}
          <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid var(--border)'}}>
            {account ? (
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <a href={`https://suiscan.xyz/testnet/account/${account.address}`}
                  target="_blank" rel="noreferrer"
                  style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--teal)',fontFamily:'var(--mono)',padding:'0 16px'}}>
                  {short(account.address)}<ExternalLink size={11}/>
                </a>
                <button onClick={()=>{disconnect();setMenuOpen(false);}} style={{
                  padding:'12px 16px',borderRadius:10,fontSize:14,fontWeight:600,
                  background:'transparent',border:'1px solid var(--border-h)',
                  color:'var(--muted)',textAlign:'left',
                }}>Disconnect wallet</button>
              </div>
            ) : (
              <ConnectButton style={{
                width:'100%',padding:'13px',borderRadius:10,fontSize:14,fontWeight:700,
                background:'var(--accent)',color:'#fff',border:'none',
                cursor:'pointer',fontFamily:'var(--font)',textAlign:'center',
              }}/>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 641px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  );
}
