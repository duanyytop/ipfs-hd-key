import { hd, config, helpers, Script } from "@ckb-lumos/lumos";
import { bytes } from "@ckb-lumos/lumos/codec";

const { Keychain, Keystore, ExtendedPrivateKey, mnemonic, key } = hd;

const CKB_PATH = `m/44'/309'/0'/0/0`;
const IPFS_PATH = `m/1229997651'/0'/0`;
const ORBITDB_PATH = `m/1768644974'/0'/0`;

const testAcpAddress = async () => {
  mnemonic.generateMnemonic();
  const mnemonicStr = "solar snow traffic keep blade antique hold ginger clarify flock leaf mouse";
  const seed = mnemonic.mnemonicToSeedSync(mnemonicStr);
  const extendedPrivateKey = ExtendedPrivateKey.fromSeed(seed);
  const root = extendedPrivateKey.serialize();
  console.log("root", root);

  const keychain = new Keychain(
    Buffer.from(bytes.bytify(extendedPrivateKey.privateKey)),
    Buffer.from(bytes.bytify(extendedPrivateKey.chainCode))
  );
  const ckbChildKey = keychain.derivePath(CKB_PATH);
  const ckbKey = `0x${Buffer.from(ckbChildKey.privateKey).toString("hex")}`;
  console.log(`CKB child key: ${ckbKey}`);

  const args = key.privateKeyToBlake160(ckbKey);
  const lumosConfig = config.TESTNET;
  config.initializeConfig(lumosConfig);
  const secp256k1Script: Script = {
    codeHash: lumosConfig.SCRIPTS.SECP256K1_BLAKE160.CODE_HASH,
    hashType: lumosConfig.SCRIPTS.SECP256K1_BLAKE160.HASH_TYPE,
    args,
  };
  const ckbSecp256k1Address = helpers.encodeToAddress(secp256k1Script, {config: lumosConfig});
  console.log(`CKBSecp256k1 address: ${ckbSecp256k1Address}`);

  const acpScript: Script = {
    codeHash: lumosConfig.SCRIPTS.ANYONE_CAN_PAY.CODE_HASH,
    hashType: lumosConfig.SCRIPTS.ANYONE_CAN_PAY.HASH_TYPE,
    args,
  };
  const ckbAcpAddress = helpers.encodeToAddress(acpScript, {config: lumosConfig});
  console.log(`CKB ACP address: ${ckbAcpAddress}`);

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
  const masterKeyChain = new Keychain(
    Buffer.from(bytes.bytify(recoveredExtendedPrivateKey.privateKey)),
    Buffer.from(bytes.bytify(recoveredExtendedPrivateKey.chainCode))
  );

  // Generate keychain from recovered root
  // const recoveredRoot = recoveredExtendedPrivateKey.serialize();
  // console.log("Recovered root", recoveredRoot);
  // const rootKeyChain = new Keychain(
  //   Buffer.from(bytes.bytify(recoveredRoot.slice(0, -64))),
  //   Buffer.from(bytes.bytify(`0x${recoveredRoot.slice(-64)}`))
  // );

  // const recoveredKeychain = Keychain.fromSeed(Buffer.from(recoveredRoot, "hex"));
  const recoveredCkbChildKey = masterKeyChain.derivePath(CKB_PATH).privateKey;
  console.log(`recovered CKB child key: ${`0x${Buffer.from(recoveredCkbChildKey).toString("hex")}`}`);

  const recoveredIpfsChildKey = masterKeyChain.derivePath(IPFS_PATH).privateKey;
  console.log(`recovered IPFS child key: ${`0x${Buffer.from(recoveredIpfsChildKey).toString("hex")}`}`);

  const recoveredOrbitdbChildKey = masterKeyChain.derivePath(ORBITDB_PATH).privateKey;
  console.log(`recovered OrbitDB child key: ${`0x${Buffer.from(recoveredOrbitdbChildKey).toString("hex")}`}`);
}

testAcpAddress();