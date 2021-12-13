import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import Image from "next/image";
import { myLoader } from "../scripts/profileHelpers";
import Modal from "../components/Modal";
import TokenGate from "../components/TokenGate";
export default function Gallery() {
  const [address, setAddress] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [status, setStatus] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  function toggleModal(item) {
    setModal(modal == "visible" ? "invisible" : "visible");
    setModalItem(nfts[0][item]);
    console.log("TOGGLE: ", modal == "invisible" ? "visible" : "invisible");
  }

  const { gql, useQuery, handleLogin, signed, modal, setModal } =
    useContext(AppContext);
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
      try {
        const address = await getAddress();
        setAddress(address.toLowerCase());
      } catch (error) {
        console.log(error);
      }
    }
    addressSetter();
  }, []);

  useEffect(() => {
    let tempNFTs = [];
    if (data) {
      try {
        const promises = data["users"][0]["tokens"].map((token) => {
          return axios.get(token.metadataURI).then(({ data }) => {
            setStatus("Loading");
            return data;
          });
        });
      } catch (error) {
        console.log(error);
      }

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
                alt={token.description}
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
    <div className="w-full">
      <div className="w-full min-h-screen bg-gray-800">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
          <div className="text-center pb-12 sm:pb-20 sm:mt-20">
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
  console.log(
    "MODAL: ",
    modalItem,
    "MODALITEM: ",
    nfts[0] ? nfts[0][modalItem] : "no"
  );
  const addy = address;
  return (
    <>
      <title>Gallery</title>
      <div className="flex w-full h-screen justify-center items-center">
        <TokenGate
          contractAddress={"0xd7beaa6d7bd084cceb1112b996e18f3d8b266dd0"}
          signer={address}
          requiredQuantity={1}
          successClassName={"w-full"}
        >
          {page}
        </TokenGate>
      </div>

      <Modal
        item={
          modalItem && {
            image: modalItem.image,
            name: modalItem.name,
            description: modalItem.description,
            attributes: modalItem.attributes[0],
          }
        }
        visible={modal}
      />
    </>
  );
}
