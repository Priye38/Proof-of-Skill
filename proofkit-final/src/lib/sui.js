import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

export const NETWORK = 'testnet';
export const CLOCK   = '0x6';
export const PKG     = import.meta.env.VITE_CONTRACT_PACKAGE_ID || '';
const TATUM_KEY      = import.meta.env.VITE_TATUM_API_KEY || '';

export const suiClient = new SuiClient({
  url: TATUM_KEY
    ? `https://sui-${NETWORK}.gateway.tatum.io`
    : `https://fullnode.${NETWORK}.sui.io`,
  fetch: TATUM_KEY
    ? (url, opts = {}) => fetch(url, {
        ...opts,
        headers: { ...opts.headers, 'x-api-key': TATUM_KEY, 'Content-Type': 'application/json' },
      })
    : undefined,
});

export function buildMintTx({ skillName, category, blobId, description, githubUrl }) {
  const tx  = new Transaction();
  const enc = (s) => Array.from(new TextEncoder().encode(s));
  tx.moveCall({
    target: `${PKG}::skill_portfolio::mint_badge`,
    arguments: [
      tx.pure.vector('u8', enc(skillName)),
      tx.pure.vector('u8', enc(category)),
      tx.pure.vector('u8', enc(blobId)),
      tx.pure.vector('u8', enc(description)),
      tx.pure.vector('u8', enc(githubUrl || '')),
      tx.object(CLOCK),
    ],
  });
  tx.setGasBudget(10_000_000);
  return tx;
}

export async function fetchBadges(address) {
  if (!PKG) return [];
  const res = await suiClient.getOwnedObjects({
    owner: address,
    filter: { StructType: `${PKG}::skill_portfolio::SkillBadge` },
    options: { showContent: true },
  });
  return res.data
    .filter(o => o.data?.content?.dataType === 'moveObject')
    .map(o => {
      const f = o.data.content.fields;
      return {
        id: o.data.objectId,
        skillName:   f.skill_name    || '',
        category:    f.category      || 'Other',
        blobId:      f.walrus_blob_id|| '',
        description: f.description   || '',
        githubUrl:   f.github_url    || '',
        mintedAt:    f.minted_at     || Date.now(),
        owner:       address,
        aiReview:    null,
      };
    });
}
