import styles from "../styles/Home.module.css";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import router from "next/router";
import { readProfile, updateProfile } from "../scripts/profileHelpers";
import Image from "next/image";
import { myLoader } from "../scripts/profileHelpers";

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
  } = useContext(AppContext);

  const [visible, setVisible] = useState("invisible");

  function handleToggle() {
    setVisible(visible == "invisible" ? "visible" : "invisible");
    console.log(!visible);
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

            <div
              x-show="show"
              tabIndex="0"
              className="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed"
            >
              <div
                className="z-50 relative p-3 mx-auto my-0 max-w-full"
                style={{ width: "600px" }}
              >
                <div className="bg-white rounded shadow-lg border flex flex-col overflow-hidden">
                  <button
                    className="fill-current h-6 w-6 absolute right-0 top-0 m-6 font-3xl font-bold"
                    onClick={handleToggle}
                  >
                    &times;
                  </button>
                  <div className="px-6 py-3 text-xl border-b font-bold">
                    {id == "" ? "Sign-up with wallet" : "Update profile"}
                  </div>
                  <div className="p-6 flex-grow text-center items-center">
                    {name && (
                      <h1 className="text-3xl font-semibold mt-2 mb-2">
                        {name}
                      </h1>
                    )}
                    {image && (
                      <Image
                        className="object-center object-cover h-36 w-36"
                        loader={myLoader}
                        src={image}
                        alt="Profile Picture"
                        width={275}
                        height={275}
                        placeholder="blurDataURL"
                      />
                    )}
                    <div className="flex flex-col mt-4">
                      <input
                        className="shadow appearance-none border rounded py-2 px-3 w-full sm:w-6/12 max-w-xs m-auto text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                      />
                      <br />
                      <input
                        className="shadow appearance-none border rounded py-2 px-3 w-full sm:w-6/12 max-w-xs m-auto text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        placeholder="Profile Image"
                        onChange={(e) => setImage(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="px-6 py-3 border-t">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-700 text-gray-100 rounded px-4 py-2 mr-1"
                        onClick={handleToggle}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-gray-100 rounded px-4 py-2 mr-1"
                        onClick={handleSignUp}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-50"></div>
            </div>
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
