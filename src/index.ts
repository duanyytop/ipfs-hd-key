import { HDKey } from "viem/accounts";

// IPFS Default Path
// Avoid using existing derivation paths:https://github.com/satoshilabs/slips/blob/master/slip-0044.md 
const defaultPath = `m/44'/8154'/0'/0/0`

const seed = "c8215abbe6ca79553182a54f403bcf9bee415adf3f415e46661f0f5bd6d245ab";
const seedBuffer = Uint8Array.from(
  Buffer.from(seed.startsWith('0x') ? seed.slice(2) : seed, 'hex')
);

const hdkey = HDKey.fromMasterSeed(seedBuffer).derive(defaultPath).privateKey!;
const hdkeyHex = Buffer.from(hdkey).toString('hex');

console.log(`HDKey: ${hdkeyHex}`);
