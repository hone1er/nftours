import { ethers } from "ethers";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import Web3Modal from "web3modal";
import abi from "../nftour/abis/Contract.json";
import { Spinner } from "@chakra-ui/react";
export default function TokenGate({
  children,
  contractAddress,
  requiredQuantity = 1,
  successClassName,
  deniedClassName,
  loadingClassName,
}) {
  // token quantity in wallet
  const [tokenQuantity, setTokenQuantity] = useState();
  const [loadedStatus, setloadedStatus] = useState(false);
  // connect to contract address to get balance
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
    try {
      const balance = await contract.balanceOf(address);
      setloadedStatus(true);
      console.log(parseInt(balance, 16));
      return balance;
    } catch (error) {
      console.log(error);
    }
    return;
  }

  useEffect(() => {
    async function setBalance() {
      const balance = await getTokenBalance();
      setTokenQuantity(parseInt(balance, 16));
    }
    setBalance();
  }, []);

  // return children within simple container(className optional)
  return loadedStatus ? (
    // verify token quantity in wallet is greater than required amount(optional, defaults to 1)
    tokenQuantity >= requiredQuantity ? (
      <div className={successClassName}>{children}</div>
    ) : (
      <div className={deniedClassName}>
        {/* maybe make the below line an optional message? If left out returns null or empty div */}
        {requiredQuantity} tokens required to access this content
      </div>
    )
  ) : (
    <div className={loadingClassName}></div>
  );
}
