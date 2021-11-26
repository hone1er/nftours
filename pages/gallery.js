import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import Image from "next/image";
import { myLoader } from "../scripts/profileHelpers";

export default function Gallery() {
  const [address, setAddress] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [status, setStatus] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const { gql, useQuery, handleLogin, signed } = useContext(AppContext);
  const TOKENS = gql`
      query UserTokens {
        users(where: {id: "${address}"}) {
          id
          tokens {
            id
            metadataURI
          }
      
        }
      }
      `;

  function toggleModal(item) {
    setModal(!modal);
    setModalItem(item);
    console.log(item);
    console.log(nfts[0]);
  }

  useEffect(() => {}, [modal]);

  async function getAddress() {
    const web3Modal = new Web3Modal({
      network: "ropsten",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return address;
  }

  const { loading, error, data } = useQuery(TOKENS);

  useEffect(() => {
    async function addressSetter() {
      const address = await getAddress();
      setAddress(address.toLowerCase());
    }
    addressSetter();
  }, []);

  useEffect(() => {
    let tempNFTs = [];
    if (data) {
      const promises = data["users"][0]["tokens"].map((token) => {
        return axios.get(token.metadataURI).then(({ data }) => {
          setStatus("Loading");
          return data;
        });
      });

      const resolveAllPromises = Promise.all(promises)
        .then((values) => {
          tempNFTs.push(values);
          setStatus("Set");
          return values;
        })
        .catch((error) => {
          setStatus("ERROR: ", error);

          console.log(error);
        });
      setNfts(tempNFTs);
    }
  }, [loading, data]);

  let nftDiv =
    nfts.length > 0 ? (
      nfts[0].map((token, idx) => {
        return (
          <button
            onClick={() => toggleModal(idx)}
            key={idx}
            className="w-full bg-gray-900 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center"
          >
            <div className="mb-8">
              <Image
                className="object-center object-cover h-36 w-36"
                loader={myLoader}
                src={token.image}
                alt="Picture of the author"
                width={500}
                height={500}
                placeholder="blurDataURL"
              />
            </div>
            <div className="text-center">
              <p className="text-xl text-white font-bold mb-2">{token.name}</p>
              <p className="text-base text-gray-300 font-normal">
                {token.description}
              </p>
            </div>
          </button>
        );
      })
    ) : (
      <h1>{status};</h1>
    );

  let page = signed ? (
    <>
      <div>
        <div className="w-full bg-gray-800">
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
            <div className="text-center pb-12">
              <h2 className="text-base font-bold text-indigo-600">Gallery</h2>
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-white">
                Your Collection
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.length > 0 && nftDiv}
              {status == "Loading" && <h1>{status};</h1>}
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
      <title>Gallery</title>
      {page}

      <div x-data="{ show: true }" className={!modal ? "invisible" : "visible"}>
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
                onClick={() => toggleModal(null)}
              >
                &times;
              </button>
              <div className="px-6 py-3 text-xl border-b font-bold">
                {modalItem && nfts[0][modalItem].name}
              </div>
              <div className="p-6 flex-grow">
                {modalItem && (
                  <Image
                    className="object-center object-cover h-36 w-36"
                    loader={myLoader}
                    src={nfts[0][modalItem].image}
                    alt="Picture of the author"
                    width={500}
                    height={500}
                    placeholder="blurDataURL"
                  />
                )}
                <p>{modalItem && nfts[0][modalItem].description}</p>
              </div>
              <div className="px-6 py-3 border-t">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-700 text-gray-100 rounded px-4 py-2 mr-1"
                    onClick={() => toggleModal(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-50"></div>
        </div>
      </div>
    </>
  );
}
