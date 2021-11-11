import { useContext, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import AppContext from "../AppContext";
import { login } from "../scripts/login";
import dynamic from "next/dynamic";
import { mintNFT } from "../scripts/mint-nft";
import { NFTlinks } from "../scripts/NFTlinks";
import Image from "next/image";
import { getDistanceFromLatLonInKm } from "../scripts/distanceFormula";
import { myLoader, readProfile } from "../scripts/profileHelpers";

export default function Discover() {
  const { signed, setSigned, setName, setImage } = useContext(AppContext);
  const [locations, setLocations] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);
  const [distance, setDistance] = useState(null);
  
  
  console.log("signed: ", signed);
  
  const MapWithNoSSR = dynamic(() => import("../components/Map.tsx"), {
    ssr: false,
  });
  
  async function handleLogin() {
    const data = await readProfile()
    console.log("data: ", data);
    if (data.name) setName(data.name);
    if (data.avatar) setImage(data.avatar);
    setSigned(data ? true : false);
  }
  
  function handleMint(tokenURI) {
    console.log("minting: ", tokenURI);
    console.log(distance, distance < 3);
    mintNFT(tokenURI);
  }

  useEffect(() => {
    setLocations(NFTlinks);
  }, []);

  useEffect(() => {
    const dist = getDistanceFromLatLonInKm(lat, lng, 38.0171441, -122.2885808);
    setDistance(dist);
    console.log("dist: ", distance);
  }, [lng, lat]);


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



  let locationDiv = locations.map((obj, idx) => {
    console.log(obj);
    const distance = getDistanceFromLatLonInKm(obj.location[0], obj.location[1], lat, lng);
    return (
        <div key={idx} className="w-full bg-gray-900 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center">
          <div className="mb-8">
            <Image
              className="object-center object-cover rounded-full h-36 w-36"
              loader={myLoader}
              src={obj.image}
              alt="Picture of the author"
              width={500}
              height={500}
            />
          </div>
          <div className="text-center">
            <p className="text-xl text-white font-bold mb-2">{obj.name}</p>
            <p className="text-base text-gray-400 font-normal">
              {obj.description}
            </p>
            <p className="text-base text-gray-400 font-normal">{distance} km</p>
          </div>
          <br />
          {distance < 20 ? <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => handleMint(obj.tokenURI)}
          >
            Mint NFT
          </button>
          : <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full" disabled>Too Far</button>}
        </div>
    );
  });
  let page = signed ? (
    <>
      <MapWithNoSSR />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={getLocation}
      >
        Get Coordinates
      </button>

      <h1>Coordinates</h1>
      <p>{status}</p>
      {lat && <p>Latitude: {lat}</p>}
      {lng && <p>Longitude: {lng}</p>}
      <div>
        <div className="w-full bg-gray-800">
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
            <div className="text-center pb-12">
              <h2 className="text-base font-bold text-indigo-600">Discover</h2>
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-white">
                Location Based NFTs
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locationDiv}
            </div>
          </section>
        </div>
      </div>
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
