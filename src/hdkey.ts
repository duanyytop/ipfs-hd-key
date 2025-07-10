import { hd } from "@ckb-lumos/lumos";

const { Keychain, Keystore, ExtendedPrivateKey, mnemonic } = hd;

const CKB_PATH = `m/44'/309'/0'/0/0`;
const IPFS_PATH = `m/1229997651'/0'/0`;
const ORBITDB_PATH = `m/1768644974'/0'/0`;

const testAcpAddress = async () => {
  const mnemonicStr = 'solar snow traffic keep blade antique hold ginger clarify flock leaf mouse';
  const seed = mnemonic.mnemonicToSeedSync(mnemonicStr);
  const extendedPrivateKey = ExtendedPrivateKey.fromSeed(seed);
  const keychain = Keychain.fromSeed(Buffer.from(extendedPrivateKey.serialize(), 'hex'));

  const ckbChildKey = keychain.derivePath(CKB_PATH);
  console.log(`CKB child key: ${`0x${Buffer.from(ckbChildKey.privateKey).toString("hex")}`}`);

  const ipfsChildKey = keychain.derivePath(IPFS_PATH);
  console.log(`IPFS child key: ${`0x${Buffer.from(ipfsChildKey.privateKey).toString("hex")}`}`);

  const orbitdbChildKey = keychain.derivePath(ORBITDB_PATH);
  console.log(`OrbitDB child key: ${`0x${Buffer.from(orbitdbChildKey.privateKey).toString("hex")}`}`);

  // export keystore
  const keystore = Keystore.create(extendedPrivateKey, 'password');
  const keystoreJson = keystore.toJson()
  // console.log(`Keystore JSON: ${JSON.stringify(keystoreJson)}`);


  // Recover key from keystore
  const recover = Keystore.fromJson(keystoreJson);
  const recoveredExtendedPrivateKey = recover.extendedPrivateKey("password");
  const recoveredKeychain = Keychain.fromSeed(
    Buffer.from(recoveredExtendedPrivateKey.serialize(), 'hex'),
  );

  const recoveredCkbChildKey = recoveredKeychain.derivePath(CKB_PATH).privateKey;
  console.log(`recovered CKB child key: ${`0x${Buffer.from(recoveredCkbChildKey).toString("hex")}`}`);

  const recoveredIpfsChildKey = recoveredKeychain.derivePath(IPFS_PATH).privateKey;
  console.log(`recovered IPFS child key: ${`0x${Buffer.from(recoveredIpfsChildKey).toString("hex")}`}`);

  const recoveredOrbitdbChildKey = recoveredKeychain.derivePath(ORBITDB_PATH).privateKey;
  console.log(`recovered OrbitDB child key: ${`0x${Buffer.from(recoveredOrbitdbChildKey).toString("hex")}`}`);
}

testAcpAddress();