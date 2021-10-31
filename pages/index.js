import styles from "../styles/Home.module.css";
import { login } from "../scripts/login";
import { useContext, useEffect } from "react";
import AppContext from "../AppContext";
import router from "next/router";

export default function Home() {
  const {signed, setSigned} = useContext(AppContext)

  async function handleLogin() {
    setSigned(await login())
    
  }

  useEffect(() => {
    if (signed) {
      router.push("/discover");
      }
  }, [signed]);
  console.log(signed)
  return (
    <>
      <title>Home</title>
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>NFTours</h1>
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
