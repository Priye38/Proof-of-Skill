# ProofKit — Proof of Skill Portfolio

> Built for the TATUM X WALRUS HACATHON 2026  

## Live Demo
🌐 **https://proofkit-drab.vercel.app**

## What is ProofKit?

ProofKit is a decentralised skill attestation platform built on the Sui blockchain. Developers upload proof of their skills — PDFs, screenshots, project exports — which are stored permanently on Walrus decentralised storage. A Move smart contract mints a SkillBadge NFT for each attestation, recording the Walrus blob ID on-chain. An AI layer then evaluates each proof and returns a structured verdict with confidence score, skill level, strengths, and suggestions.

## How It Works

1. Users connects their Sui Wallet
2. Uploads a Proof file,CV/Portfolio → stored on Walrus → blob ID returned
3. Fills in skill name, category, and description
4. Mints a SkillBadge NFT on Sui (blob ID stored on-chain)
5. AI reviews the proof and returns a verdict
6. Portfolio is publicly viewable by searching any wallet address

## Features

- 🔗 Real Sui Wallet connection via browser extension
- 🗄️ Walrus decentralised storage for all proof files
- ⛓️ SkillBadge NFTs minted on Sui blockchain
- 🤖 AI skill review powered by Groq (llama-3.3-70b)
- 📱 Mobile responsive with hamburger navigation
- 🔍 Public portfolio viewer — search any wallet address
- ✅ No centralised server — storage and attestations are fully on-chain

## Tech Stack

LAYER & TECHNOLOGY

| Frontend | React + Vite |
| Blockchain | Sui (Move smart contract) |
| Storage | Walrus decentralised storage |
| RPC | Tatum Sui gateway |
| AI Review | Groq (llama-3.3-70b-versatile) |
| Deployment | Vercel |
| Wallet | @mysten/dapp-kit |

## Smart Contract

- **Network:** Sui Testnet
- **Package ID:** `0xf5d0cebc10c90e5b45044e5b6367e57d4bdab0dc5bf5cad6c9416890cacb6467`
- **Transaction:** `4bngKG7vh8JAwaQH9LEcbhAsErcbtMiNrcNWp8RqwNme`
- **Explorer:** [View on SuiScan](https://suiscan.xyz/testnet/object/0xf5d0cebc10c90e5b45044e5b6367e57d4bdab0dc5bf5cad6c9416890cacb6467)

## Walrus Integration

Every badge minted on ProofKit has a real Walrus blob ID stored on-chain inside the SkillBadge NFT object. Proof files are uploaded to the Walrus testnet publisher and retrieved directly from the Walrus aggregator — no centralised server is involved anywhere in the storage layer.

Retrieve any proof file directly:
