import styles from "../styles/Home.module.css";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import router from "next/router";
import { readProfile, updateProfile } from "../scripts/profileHelpers";
import Image from "next/image";
import { myLoader } from "../scripts/profileHelpers";

export default function Home() {
  const { signed, setSigned, name, setName, image, id, setID, setImage } =
    useContext(AppContext);

  async function handleSignUp() {
    const updated = await updateProfile(name, image);
    if (updated) {
      setID(name);
      setSigned(true);
    }
  }

  async function handleLogin() {
    const data = await readProfile();
    if (!data) {
      alert("No account found \n Please create a new account");
      return;
    }
    if (data.name) setName(data.name);
    if (data.avatar) setImage(data.avatar);
    setSigned(data ? true : false);
  }

  useEffect(() => {
    if (signed) {
      router.push("/discover");
    }
  }, [signed]);
  console.log(image);
  return (
    <>
      <title>Home</title>
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>NFTours</h1>
          <br />

          <div className="flex flex-col">
            {id && (
              <div className="welcome">
                <h1 className="text-2xl">Welcome {id}!</h1>
              </div>
            )}
            {image && (
              <Image
                className="object-center pd-15 object-cover"
                loader={myLoader}
                src={image}
                alt="user profile pic"
                width={150}
                height={150}
                placeholder="blurDataURL"
              ></Image>
            )}
          </div>

          <br />
          <br />
          <input
            required
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            required
            placeholder="Profile Image"
            onChange={(e) => setImage(e.target.value)}
          />
          <br />
          <br />

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleSignUp}
          >
            {id == "" ? "Sign-up with wallet" : "Update profile"}
          </button>
          <br />
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
