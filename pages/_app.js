import "../styles/globals.css";
import Link from "next/link";
import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import AppContext from "../AppContext";
import { ChakraProvider } from "@chakra-ui/react";
import {
  myLoader,
  readProfile,
  updateProfile,
} from "../scripts/profileHelpers";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import ProfileModal from "../components/ProfileModal";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/hone1er/nftour",
  cache: new InMemoryCache(),
});

export function MyApp({ Component, pageProps }) {
  const [signed, setSigned] = useState();
  const [name, setName] = useState("");
  const [id, setID] = useState("");
  const [image, setImage] = useState("");

  const [markers, setMarkers] = useState([]);
  const [latlng, setLatlng] = useState([]);

  const [modal, setModal] = useState("invisible");
  const [accountWindow, setAccountWindow] = useState(false);
  const [profileModal, setProfileModal] = useState(false);

  async function handleLogin() {
    const data = await readProfile();
    if (data.name) setName(data.name);
    if (data.avatar) setImage(data.avatar);
    setSigned(data ? true : false);
  }

  function handleAccountWindow() {
    setAccountWindow(!accountWindow);
  }

  function openProfileModal() {
    setAccountWindow(!accountWindow);
    setProfileModal(!profileModal);
  }

  function handleToggle() {
    setProfileModal(!profileModal);
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

  let img = image ? (
    <Image
      className="object-center object-cover rounded-full h-36 w-36"
      loader={myLoader}
      src={image}
      alt=" Profile Picture"
      width={50}
      height={50}
    ></Image>
  ) : null;
  let Nav = (
    <>
      <nav className="border-b flex p-6">
        <div className="nav-wrap">
          <p className="text-4xl font-bold">NFTours</p>

          {/* <Link href="/">
          <a className="mr-4 text-purple-500">Home</a>
        </Link> */}
          <Link href="/discover">
            <a className="mr-4 text-purple-500">Discover</a>
          </Link>
          <Link href="/gallery">
            <a className="mr-4 text-purple-500">My NFTs</a>
          </Link>
        </div>
        <div className="absolute top-8 right-0 ml-auto text-center account-wrap">
          <button onClick={handleAccountWindow}>{img}</button>
          <div
            className={
              accountWindow
                ? "relative w-max h-fit p-auto mt-2 bg-gray-100 flex-wrap z-50 arrow_box"
                : "relative w-max h-fit bg-gray-100 flex-wrap z-50 invisible"
            }
          >
            <h1 className="md:text-xl text-md">{name}</h1>
            <button
              className="bg-white p-4 w-full hover:shadow"
              onClick={openProfileModal}
            >
              Edit account
            </button>
          </div>
        </div>
      </nav>
      <ProfileModal
        visible={profileModal ? "visible" : "invisible"}
        handleToggle={() => handleToggle()}
      ></ProfileModal>
    </>
  );

  const router = useRouter();
  const { pathname } = router;
  const noNav = ["/"];
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <AppContext.Provider
          value={{
            signed,
            setSigned,
            name,
            setName,
            image,
            setImage,
            markers,
            setMarkers,
            latlng,
            setLatlng,
            useQuery,
            gql,
            handleLogin,
            id,
            setID,
            modal,
            setModal,
            profileModal,
            setProfileModal,
            handleToggle,
            setSigned,
          }}
        >
          <div>
            {noNav.includes(pathname) ? null : Nav}

            <Component {...pageProps} />
          </div>
        </AppContext.Provider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
