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
  const { gql, useQuery, handleLogin } =
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
      const address = await getAddress();
      setAddress(address.toLowerCase());
    }
    addressSetter();
  }, []);
 


  useEffect(() => {
    let tempNFTs = [];
    if (data) {
      const promises = data['users'][0]['tokens'].map(token => {
        return axios
        .get(token.metadataURI)
        .then(({ data }) => {
          setStatus("Loading")
          return data
        });
      });
    
      const resolveAllPromises = Promise.all(promises)
      .then(values => {
        tempNFTs.push(values);
        setStatus("Set")
        return values
      }).catch(error => {
        setStatus("ERROR: ", error)

        console.log(error);
      });
      setNfts(tempNFTs);
    }
    console.log("DATA: ", data);
  }, [loading, data]);

  
  console.log(loading, data, status);
  let nftDiv = nfts.length > 0 ? nfts[0].map((token, idx) => {
    console.log(token);
      return (
        <div
          key={idx}
          className="w-full bg-gray-900 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center"
        >
          <div className="mb-8">
          <Image
              className="object-center object-cover rounded-full h-36 w-36"
              loader={myLoader}
              src={token.image}
              alt="Picture of the author"
              width={500}
              height={500}
              placeholder="blurDataURL"
            />
          </div>
          <div className="text-center">
            <p className="text-xl text-white font-bold mb-2">
              {token.name}
            </p>
            <p className="text-base text-gray-300 font-normal">
              {token.description}
            </p>
          </div>
        </div>
      );
      }) : <h1>{status};</h1>
  return (
    <>
      <title>Gallery</title>
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
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
