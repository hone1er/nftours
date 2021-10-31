import { ethers } from "ethers";
import router from "next/router";
import { useContext } from "react";
import Web3Modal from "web3modal";
export async function login() {
  const web3Modal = new Web3Modal({
    network: "ropsten",
    cacheProvider: true,
  });
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const signed = await signer.signMessage("Sign message to login");
  if (signed) {
    return true;
  }
}
