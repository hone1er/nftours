import styles from "../styles/Home.module.css";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import router from "next/router";
import { readProfile, updateProfile } from "../scripts/profileHelpers";
import { login } from "../scripts/login";

export default function Home() {
  const { signed, setSigned, name, setName, image, setImage } = useContext(AppContext);

  async function handleSignUp() {
    const updated = await updateProfile(name, image);
    if (updated) {
      setSigned(true);
    }
  }

  async function handleLogin() {
    const data = await readProfile()
    console.log("data: ", data);
    if (data.name) setName(data.name);
    if (data.avatar) setImage(data.avatar);
    const loggedIn = await login()
    if (loggedIn){
    setSigned(data ? true : false)
    }
  }

  useEffect(() => {
    
    if (signed) {
      router.push("/discover");
    }
  }, [signed]);


  
  useEffect(() => {
     console.log("name: ", name);
  }, []);

  return (
    <>
      <title>Home</title>
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>NFTours</h1>
          <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <br/>
          <input
            placeholder="Profile Image"
            onChange={(e) => setImage(e.target.value)}
          />
          <br/>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleSignUp}
          >
            Sign-up with wallet
          </button>
          <br/>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleLogin}
          >
            Login with wallet
          </button>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h2>Discover</h2>
            </div>
            <div className={styles.card}>
              <h2>Mint</h2>
            </div>
            <div className={styles.card}>
              <h2>Collect</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
