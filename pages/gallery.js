import { useContext } from "react";
import AppContext from "../AppContext";
import styles from "../styles/Home.module.css";
export default function Gallery() {
  const { signed, setSigned } = useContext(AppContext);
  async function handleLogin() {
    setSigned(await login());
  }
  let page = signed ? (
    <>
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>Gallery</h1>
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
      <title>Gallery</title>
      {page}
    </>
  );
}
