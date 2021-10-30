import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">NFTours</p>
        <Link href="/">
          <a className="mr-4 text-purple-500">Home</a>
        </Link>
        <Link href="/discover">
          <a className="mr-4 text-purple-500">Discover</a>
        </Link>
        <Link href="/gallery">
          <a className="mr-4 text-purple-500">My NFTs</a>
        </Link>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
