import { useContext, useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import AppContext from "../AppContext";
import { login } from "../scripts/login";
import dynamic from "next/dynamic";


export default function Discover() {
  const { signed, setSigned } = useContext(AppContext);
  console.log(signed)
  async function handleLogin() {
    setSigned(await login());
  }

  const MapWithNoSSR = dynamic(() => import("../components/Map.tsx"), {
    ssr: false
  });


  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        setStatus(null);
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      }, () => {
        setStatus('Unable to retrieve your location');
      });
    }
  }

  let page = signed ? 
  (
    <>
        <MapWithNoSSR/>
        <button onClick={getLocation}>Get Location</button>
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
