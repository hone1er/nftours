import { ethers } from "ethers";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import Web3Modal from "web3modal";
import abi from "../nftour/abis/Contract.json";

export default function TokenGate({
  children,
  contractAddress,
  requiredQuantity = 1,
  signer,
  className,
}) {
  // track token quantity in wallet
  const [tokenQuantity, setTokenQuantity] = useState();
  // connect to contract address
  async function getTokenBalance() {
    const web3Modal = new Web3Modal({
      network: "ropsten",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const balance = await contract.balanceOf(address);
    console.log(parseInt(balance, 16));
    return balance;
  }

  // check if signer owns token
  useEffect(() => {
    async function setBalance() {
      const balance = await getTokenBalance();
      setTokenQuantity(parseInt(balance, 16));
    }
    setBalance();
  }, []);

  // verify token quantity in wallet is greater than required amount(optional, defaults to 1)

  // return children within simple container(className optional)
  return tokenQuantity >= requiredQuantity ? (
    <div>{children}</div>
  ) : (
    <div>{signer}</div>
  );
}
