import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import web3 from 'web3'
import axios from 'axios'
import Web3Modal from "web3modal"
import styles from '../styles/Home.module.css'



export default function Home() {
  
  async function login() {
    const web3Modal = new Web3Modal({
      network: "ropsten",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signed = await signer.signMessage("Sign message to login")
    if (signed) {
      console.log("signed")
    }

  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
      <h1 className={styles.title}>NFTours</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={login}>Login with wallet</button>
      <div className={styles.grid}>
      <div className={styles.card}><h2>Discover</h2></div>
      <div className={styles.card}><h2>Mint</h2></div>
      <div className={styles.card}><h2>Collect</h2></div>
      </div>
      </div>
    </div>
  )
}

