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
  const { signed, setSigned, gql, useQuery, setName, setImage, handleLogin } =
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
  async function metadata(obj) {
    let data = await axios.get(obj.metadataURI).then((res)=>{return res;})
    return data;
  }

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  
  

  console.log(data['users'][0]['tokens']);
  let nftDiv = data['users'][0]['tokens'].map((res) =>  {
    console.log("res: ", res);
    <div
        className="w-full bg-gray-900 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center"
      >
        <div className="mb-8">
          <Image
            className="object-center object-cover rounded-full h-36 w-36"
            loader={myLoader}
            src={res[0].image}
            alt="Picture of the author"
            width={500}
            height={500}
            placeholder="blurDataURL"
          />
        </div>
        <div className="text-center">
          <p className="text-xl text-white font-bold mb-2">{res[0].name}</p>
          <p className="text-base text-gray-300 font-normal">
            {res[0].description}
          </p>
    
        </div>
       
      </div>
  })
  return (
    <>
      <title>Gallery</title>
      
    </>
  );
}
