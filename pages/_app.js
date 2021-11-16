import "../styles/globals.css";
import Link from "next/link";
import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import AppContext from "../AppContext";
import { myLoader, readProfile } from "../scripts/profileHelpers";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

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

  async function handleLogin() {
    const data = await readProfile();
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

  let img = image ? (
    <Image
      className="object-center object-cover rounded-full h-36 w-36"
      loader={myLoader}
      src={image}
      alt="Picture of the author"
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
        <div className="ml-auto account-wrap">
          <h1>{name}</h1>
          {img}
        </div>
      </nav>
    </>
  );

  const router = useRouter();
  const { pathname } = router;
  const noNav = ["/"];
  return (
    <ApolloProvider client={client}>
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
        }}
      >
        <div>
          {noNav.includes(pathname) ? null : Nav}

          <Component {...pageProps} />
        </div>
      </AppContext.Provider>
    </ApolloProvider>
  );
}

export default MyApp;
