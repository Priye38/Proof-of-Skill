const PUBLISHER  = 'https://publisher.walrus-testnet.walrus.space';
const AGGREGATOR = 'https://aggregator.walrus-testnet.walrus.space';

export async function uploadToWalrus(file, epochs = 5) {
  const buf = await file.arrayBuffer();
  const res = await fetch(`${PUBLISHER}/v1/blobs?epochs=${epochs}`, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: buf,
  });
  if (!res.ok) throw new Error(`Walrus upload failed: ${res.status}`);
  const data = await res.json();
  const blobId =
    data?.newlyCreated?.blobObject?.blobId ||
    data?.alreadyCertified?.blobId;
  if (!blobId) throw new Error('Could not parse blobId from Walrus response');
  return blobId;
}

export const walrusBlobUrl = (blobId) =>
  `${AGGREGATOR}/v1/blobs/${blobId}`;

export async function fetchBlobText(blobId) {
  const res = await fetch(walrusBlobUrl(blobId));
  if (!res.ok) throw new Error(`Blob fetch: ${res.status}`);
  return res.text();
}
