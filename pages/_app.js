import "../styles/globals.css";
import Link from "next/link";
import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppContext from "../AppContext";

export function MyApp({ Component, pageProps }) {
  const [signed, setSigned] = useState();
  let Nav = (
    <>
      <nav className="border-b p-6">
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
      </nav>
    </>
  );

  const router = useRouter();
  const { pathname } = router;
  const noNav = ["/"];
  return (
    <AppContext.Provider
      value={{
        signed,
        setSigned,
      }}
    >
    
       
      <div>
        {noNav.includes(pathname) ? null : Nav}

        <Component {...pageProps} />
      </div>
    </AppContext.Provider>
  );
}

export default MyApp;
