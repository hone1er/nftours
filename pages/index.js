import styles from "../styles/Home.module.css";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import router from "next/router";
import { readProfile, updateProfile } from "../scripts/profileHelpers";
import Image from "next/image";
import { myLoader } from "../scripts/profileHelpers";
import ProfileModal from "../components/ProfileModal";
import { motion } from "framer-motion";
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
  const cards = ["discover", "mint", "collect"];
  const nftours = ["N", "F", "T", "o", "u", "r", "s"];

  const letterContainer = {
    hidden: { rotateX: 0 },
    show: {
      rotateX: 0,
      transition: {
        staggerChildren: 0.2,
        ease: "easeOut",
      },
    },
  };

  const letter = {
    hidden: { rotateX: 90 },
    show: {
      rotateX: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

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
      <div className="bg-gray-900">
        <div className={styles.container}>
          <div className={styles.main} id="page">
            {nftours && (
              <motion.h1
                className={styles.title}
                initial="hidden"
                animate="show"
                variants={letterContainer}
              >
                {nftours.map((lttr, i) => (
                  <motion.span
                    key={i}
                    className="inline-block glow"
                    variants={letter}
                  >
                    {lttr}
                  </motion.span>
                ))}
              </motion.h1>
            )}

            <div className="flex flex-col h-48">
              {id && image && (
                <motion.div
                  className="welcome"
                  initial={{ scale: 0, opacity: 0, y: 200 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.5,
                      duration: 2.15,
                      ease: "backInOut",
                    },
                  }}
                >
                  <h1 className="text-gray-300 text-2xl m-4">Welcome {id}!</h1>
                </motion.div>
              )}
              {image && (
                <motion.div
                  className="relative z-0 m-auto"
                  initial={{ opacity: 0, scale: 0, y: 200 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { dela: 0.75, duration: 1.25, ease: "easeOut" },
                  }}
                >
                  <Image
                    className="object-center pd-15 object-cover"
                    loader={myLoader}
                    src={image}
                    alt="user profile pic"
                    width={150}
                    height={150}
                    placeholder="blurDataURL"
                  />
                </motion.div>
              )}
            </div>

            <br />
            <br />

            <button
              className="relative z-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-6"
              onClick={handleLogin}
            >
              Login with wallet
            </button>
            <br />
            <button
              className="relative z-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
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
                profileModal={profileModal}
              ></ProfileModal>
            </div>
            {cards && (
              <motion.div
                className={styles.grid}
                initial={{ scale: 0.75 }}
                animate={{
                  scale: 1,
                  transition: { duration: 1.25, ease: "easeInOut" },
                }}
              >
                {cards.map((cardText, i) => {
                  let start = i == 0 ? 275 : i == 2 ? -275 : 0;
                  let rotation = i == 0 ? 90 : i == 2 ? -90 : 0;
                  let opacity = i == 0 ? 0 : i == 2 ? 0 : 1;
                  let delay = i == 0 ? 0.25 : i == 2 ? 0.25 : 0;
                  let z = i == 0 ? -10 : i == 2 ? -10 : 10;

                  return (
                    <motion.div
                      key={i}
                      className={styles.card}
                      initial={{
                        x: start,
                        z: z,
                        scale: 0,
                        opacity: opacity,
                        rotateY: rotation,

                        boxShadow: "0px 0px 0px 0px rgba(31, 45, 73, 0)",
                      }}
                      animate={{
                        x: 0,
                        scale: 1,
                        opacity: 1,
                        rotateY: 0,
                        boxShadow: "0px 0px 25px 20px rgba(31, 45, 73, 0.1)",
                      }}
                      whileHover={{
                        boxShadow: "0px 0px 25px 23px rgba(31, 45, 73, 0.25)",
                        scale: 1.05,
                        transition: { ease: "easeInOut" },
                      }}
                      whileTap={{
                        boxShadow: "0px 0px 25px 23px rgba(31, 45, 73, 0.25)",
                        scale: 1.05,
                        transition: { ease: "easeInOut" },
                      }}
                      transition={{
                        ease: "easeOut",
                        duration: 1.25,
                        delay: delay,
                      }}
                    >
                      <h2>{cardText}</h2>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
