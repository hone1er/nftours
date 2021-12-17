import styles from "../styles/Home.module.css";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import router from "next/router";
import { readProfile, updateProfile } from "../scripts/profileHelpers";
import Image from "next/image";
import { myLoader } from "../scripts/profileHelpers";
import ProfileModal from "../components/ProfileModal";
export default function Home() {
  const {
    signed,
    setSigned,
    name,
    setName,
    image,
    id,
    setID,
    setImage,
    handleSignUp,
    profileModal,
    setProfileModal,
  } = useContext(AppContext);

  const [visible, setVisible] = useState("invisible");

  function handleToggle() {
    setProfileModal(!profileModal);
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

  // check if user has IDX profile on load
  useEffect(() => {
    async function handleLogin() {
      const data = await readProfile();
      if (!data) {
        alert("No account found \n Please create a new account");
        return;
      }
      if (data.name) {
        setName(data.name);
        setID(data.name);
      }
      if (data.avatar) setImage(data.avatar);
    }
    handleLogin();
  }, []);

  useEffect(() => {
    if (signed) {
      router.push("/discover");
    }
  }, [signed]);
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

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleLogin}
          >
            Login with wallet
          </button>
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleToggle}
          >
            {id == "" ? "Sign-up with wallet" : "Update profile"}
          </button>
          <br />
          <br />
          <div x-data="{ show: true }" className={visible}>
            <div className="flex justify-center"></div>

            <ProfileModal
              visible={profileModal ? "visible" : "invisible"}
              handleToggle={() => handleToggle()}
              handleSignUp={() => handleSignUp()}
            ></ProfileModal>
          </div>

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
