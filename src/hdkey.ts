import { hd } from "@ckb-lumos/lumos";

const { Keychain, Keystore, ExtendedPrivateKey, mnemonic } = hd;

const CKB_PATH = `m/44'/309'/0'/0/0`;
const IPFS_PATH = `m/1229997651'/0'/0`;
const ORBITDB_PATH = `m/1768644974'/0'/0`;

const testAcpAddress = async () => {
  mnemonic.generateMnemonic()
  const mnemonicStr = "solar snow traffic keep blade antique hold ginger clarify flock leaf mouse";
  const seed = mnemonic.mnemonicToSeedSync(mnemonicStr);
  const extendedPrivateKey = ExtendedPrivateKey.fromSeed(seed);
  const root = extendedPrivateKey.serialize()
  console.log("root", root);

  const keychain = Keychain.fromSeed(Buffer.from(root, "hex"));
  const ckbChildKey = keychain.derivePath(CKB_PATH);
  console.log(`CKB child key: ${`0x${Buffer.from(ckbChildKey.privateKey).toString("hex")}`}`);

  const ipfsChildKey = keychain.derivePath(IPFS_PATH);
  console.log(`IPFS child key: ${`0x${Buffer.from(ipfsChildKey.privateKey).toString("hex")}`}`);

  const orbitdbChildKey = keychain.derivePath(ORBITDB_PATH);
  console.log(`OrbitDB child key: ${`0x${Buffer.from(orbitdbChildKey.privateKey).toString("hex")}`}`);

  // export keystore
  /**
   {
    "version": 3,
    "crypto": {
        "ciphertext": "a313e280590f786190604a550f1e476d8c6a9ecf3c23724bfc3ffd42af98496649d909ea4ba0bfb1e2d6d74ac5adf86412ba4bc1698686eb2a284eb15d815d8e",
        "cipherparams": {
            "iv": "3c763f0627b6b3dc4a1ed75ef171e310"
        },
        "cipher": "aes-128-ctr",
        "kdf": "scrypt",
        "kdfparams": {
            "dklen": 32,
            "salt": "95f3ab0eb3768027df551fb29a0d942c9571974afb370f95ed14f2e59229cfe0",
            "n": 262144,
            "r": 8,
            "p": 1
        },
        "mac": "c977004f5f9b59d0d59964e3e09acd0e12bbe67587921084dded9408b50b9b7c"
      },
      "id": "fe5fb210-335f-4439-ae41-152b9f1da703"
    }
   */
  const keystore = Keystore.create(extendedPrivateKey, "password");
  const keystoreJson = keystore.toJson();
  console.log(`Keystore JSON: ${keystoreJson}`);

  // Recover key from keystore
  const recover = Keystore.fromJson(keystoreJson);
  const recoveredExtendedPrivateKey = recover.extendedPrivateKey("password");
  const recoveredRoot = recoveredExtendedPrivateKey.serialize();
  console.log("Recovered root", recoveredRoot);

  const recoveredKeychain = Keychain.fromSeed(Buffer.from(recoveredRoot, "hex"));
  const recoveredCkbChildKey = recoveredKeychain.derivePath(CKB_PATH).privateKey;
  console.log(`recovered CKB child key: ${`0x${Buffer.from(recoveredCkbChildKey).toString("hex")}`}`);

  const recoveredIpfsChildKey = recoveredKeychain.derivePath(IPFS_PATH).privateKey;
  console.log(`recovered IPFS child key: ${`0x${Buffer.from(recoveredIpfsChildKey).toString("hex")}`}`);

  const recoveredOrbitdbChildKey = recoveredKeychain.derivePath(ORBITDB_PATH).privateKey;
  console.log(`recovered OrbitDB child key: ${`0x${Buffer.from(recoveredOrbitdbChildKey).toString("hex")}`}`);
}

testAcpAddress();