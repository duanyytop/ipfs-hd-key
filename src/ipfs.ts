import { HDKey } from "viem/accounts";
import { createLibp2p } from "libp2p";
import { keys } from "@libp2p/crypto";

const { privateKeyFromRaw } = keys;

// IPFS Default Path
// Avoid using existing derivation paths:https://github.com/satoshilabs/slips/blob/master/slip-0044.md 
const defaultPath = `m/44'/8154'/0`

const run = async () => {
  const seed = "c8215abbe6ca79553182a54f403bcf9bee415adf3f415e46661f0f5bd6d245ab";
  const seedBuffer = Uint8Array.from(Buffer.from(seed.startsWith("0x") ? seed.slice(2) : seed, "hex"));

  const hdkey = HDKey.fromMasterSeed(seedBuffer).derive(defaultPath).privateKey!;
  const ipfsKeyHex = Buffer.from(hdkey).toString("hex");
  const privateKeyBytes = Uint8Array.from(Buffer.from(ipfsKeyHex, "hex"));
  const privateKey = await privateKeyFromRaw(privateKeyBytes);

  console.log(`privateKey: ${ipfsKeyHex}`);

  const node = await createLibp2p({
    privateKey,
  });
  await node.start();

  const peers = node.getPeers();
  console.log("Libp2p node started with the following peers:", peers);
}

run().catch((err) => {
  console.error("Error starting libp2p node:", err);
  process.exit(1);
});
