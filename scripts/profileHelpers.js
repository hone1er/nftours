import CeramicClient from "@ceramicnetwork/http-client";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";

import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { DID } from "dids";
import { IDX } from "@ceramicstudio/idx";
const endpoint = "https://ceramic-clay.3boxlabs.com";


export async function readProfile() {
  const [address] = await connect();
  const ceramic = new CeramicClient(endpoint);
  const idx = new IDX({ ceramic });

  try {
    const data = await idx.get("basicProfile", `${address}@eip155:1`);
    console.log(address);
    return data
  } catch (error) {
    console.log("error: ", error);
    alert("No account found \n Please create a new account")
    return false
  }
}

export async function updateProfile(name, image) {
  const [address] = await connect();
  const ceramic = new CeramicClient(endpoint);
  const threeIdConnect = new ThreeIdConnect();
  const provider = new EthereumAuthProvider(window.ethereum, address);

  await threeIdConnect.connect(provider);

  const did = new DID({
    provider: threeIdConnect.getDidProvider(),
    resolver: {
      ...ThreeIdResolver.getResolver(ceramic),
    },
  });

  ceramic.setDID(did);
  await ceramic.did.authenticate();

  const idx = new IDX({ ceramic });

  await idx.set("basicProfile", {
    name,
    avatar: image,
  });
  console.log(name, image);
  console.log("Profile updated!");
  return true
}



async function connect() {
  const addresses = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return addresses;
}

export const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};