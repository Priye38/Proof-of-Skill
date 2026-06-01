# ProofKit — Proof of Skill Portfolio
> Tatum × Walrus Hackathon 2025

Mint verifiable skill attestations on **Sui**. Store proof files on **Walrus**. Get AI-reviewed by **Claude**.

## Quick Start

```bash
npm install
cp .env.example .env     # add your VITE_TATUM_API_KEY
npm run dev              # http://localhost:5173
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```
Add env vars in Vercel dashboard: VITE_TATUM_API_KEY and ANTHROPIC_API_KEY

## Deploy the Move Contract

```bash
# 1. Install Sui CLI
brew install sui          # Mac
# Windows: download from https://github.com/MystenLabs/sui/releases

# 2. Set up testnet wallet
sui client new-address ed25519
sui client switch --env testnet
# Get free SUI: https://faucet.sui.io

# 3. Deploy
cd contract
sui move build
sui client publish --gas-budget 100000000

# 4. Copy the Package ID from output and add to Vercel:
# VITE_CONTRACT_PACKAGE_ID=0x...
```

## Project Structure
```
proofkit/
├── src/
│   ├── lib/          walrus.js · sui.js · ai.js
│   ├── components/   Navbar · SkillBadgeCard
│   ├── pages/        Home · Mint · Portfolio
│   └── main.jsx      dapp-kit wallet providers
├── api/
│   └── review.js     Vercel serverless — Claude AI review
└── contract/
    └── sources/      skill_portfolio.move
```
