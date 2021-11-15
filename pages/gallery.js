import { useContext, useEffect } from "react";
import AppContext from "../AppContext";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { login } from "../scripts/login";

export default function Gallery() {
  useEffect(() => {
    async function balances() {
      const web3Modal = new Web3Modal({
        network: "ropsten",
        cacheProvider: true,
      });

      const contract = require("/scripts/NFTour.json");
      const contractAddress = "0xd7beaa6d7bd084cceb1112b996e18f3d8b266dd0";
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress()
      const nftContract = new ethers.Contract(
        contractAddress,
        contract.abi,
        signer
      );
      console.log(await nftContract.functions.balanceOf(address));
    }
    balances();
  }, []);
  const { signed, setSigned } = useContext(AppContext);
  async function handleLogin() {
    setSigned(await login());
  }
  let page = signed ? (
    <>
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>Gallery</h1>
        </div>
      </div>
    </>
  ) : (
    <div className={styles.container}>
      <div className={styles.main}>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleLogin}
        >
          Login with wallet
        </button>
      </div>
    </div>
  );
  return (
    <>
      <title>Gallery</title>
      {page}
    </>
  );
}
