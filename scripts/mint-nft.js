import { ethers } from "ethers";
import Web3Modal from "web3modal";
const API_URL = process.env.API_URL

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)
const contract = require("/scripts/NFTour.json")
const contractAddress = "0xd7BEaA6D7BD084cCEb1112b996e18f3d8b266dd0"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

export async function mintNFT(tokenURI) {
  const web3Modal = new Web3Modal({
    network: "ropsten",
    cacheProvider: true,
  });
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const nonce = await signer.getTransactionCount()
  const pubKey = await signer.getAddress();
  const gasPrice = await signer.getGasPrice();
  //the transaction
  const tx = {
    from: pubKey,
    to: contractAddress,
    nonce: nonce,
    gasPrice: gasPrice,
    data: nftContract.methods.mintNFT(pubKey, tokenURI).encodeABI(),
  }

  const signPromise = await signer.sendTransaction(tx)
  const hash = await signPromise.hash
  console.log(hash)
}
