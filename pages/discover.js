import { useContext, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import AppContext from "../AppContext";
import { login } from "../scripts/login";
import dynamic from "next/dynamic";
import { mintNFT } from "../scripts/mint-nft";
import { get } from "window-size";

export default function Discover() {
  const { signed, setSigned } = useContext(AppContext);
  console.log("signed: ", signed);
  async function handleLogin() {
    setSigned(await login());
  }

  const MapWithNoSSR = dynamic(() => import("../components/Map.tsx"), {
    ssr: false,
  });

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);
  const [distance, setDistance] = useState(null);
  function handleMint() {
    console.log("minting");
    console.log(distance, distance < 3);
    mintNFT(
      "https://gateway.pinata.cloud/ipfs/QmYcgS5RSiscwL1J7355vkDDJY5Y4Gmd7Ergd1JY3STFX1"
    );
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  };

  useEffect(() => {
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1); // deg2rad below
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const dist = getDistanceFromLatLonInKm(lat, lng, 38.0171441, -122.2885808);
    setDistance(dist);
    console.log("dist: ", distance);
  }, 
  [lng, lat]);

  let page = signed ? (
    <>
      <MapWithNoSSR />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={getLocation}
      >
        Get Coordinates
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleMint}
      >
        Mint NFT
      </button>
      <h1>Coordinates</h1>
      <p>{status}</p>
      {lat && <p>Latitude: {lat}</p>}
      {lng && <p>Longitude: {lng}</p>}
    </>
  ) : (
    <div className={styles.container}>
      <div className={styles.main}>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleLogin}
        >
          Login with wallet
        </button>
      </div>
    </div>
  );
  return (
    <>
      <title>Discover</title>
      {page}
    </>
  );
}
