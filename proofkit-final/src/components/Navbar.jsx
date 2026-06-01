import { Link, useLocation } from 'react-router-dom';
import { ConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { Hexagon, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const short = (a) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : '';

  const links = [
    { to: '/', label: 'Home' },
    { to: '/mint', label: 'Mint badge' },
    { to: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <nav style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'16px 32px', borderBottom:'1px solid var(--border)',
      background:'rgba(9,9,14,0.90)', backdropFilter:'blur(14px)',
      position:'sticky', top:0, zIndex:200,
    }}>
      <Link to="/" style={{display:'flex',alignItems:'center',gap:9}}>
        <Hexagon size={20} color="var(--accent)" strokeWidth={1.5} />
        <span style={{fontWeight:800,fontSize:15,letterSpacing:'-0.03em'}}>ProofKit</span>
      </Link>

      <div style={{display:'flex',gap:2}}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            padding:'6px 14px', borderRadius:8, fontSize:13, fontWeight:500,
            color: pathname===l.to ? 'var(--text)' : 'var(--muted)',
            background: pathname===l.to ? 'var(--bg3)' : 'transparent',
            transition:'all 0.15s',
          }}>{l.label}</Link>
        ))}
      </div>

      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {account ? (
          <>
            <a href={`https://suiscan.xyz/testnet/account/${account.address}`}
              target="_blank" rel="noreferrer"
              style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'var(--teal)',fontFamily:'var(--mono)'}}>
              {short(account.address)} <ExternalLink size={10}/>
            </a>
            <button onClick={()=>disconnect()} style={{
              padding:'7px 16px',borderRadius:8,fontSize:13,fontWeight:600,
              background:'transparent',border:'1px solid var(--border-h)',color:'var(--muted)',
            }}>Disconnect</button>
          </>
        ) : (
          <ConnectButton style={{
            padding:'8px 20px',borderRadius:8,fontSize:13,fontWeight:700,
            background:'var(--accent)',color:'#fff',border:'none',
            cursor:'pointer',fontFamily:'var(--font)',
          }}/>
        )}
      </div>
    </nav>
  );
}
