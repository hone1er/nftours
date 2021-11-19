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

  function handleModal(idx) {
    var openmodal = document.querySelectorAll('.modal-open')
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener('click', function(event){
    	event.preventDefault()
    	toggleModal()
      })
      setModal(true)
    }
    
    const overlay = document.querySelector('.modal-overlay')
    overlay.addEventListener('click', toggleModal)
    
    var closemodal = document.querySelectorAll('.modal-close')
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener('click', toggleModal)
    }
    
    document.onkeydown = function(evt) {
      evt = evt || window.event
      var isEscape = false
      if ("key" in evt) {
    	isEscape = (evt.key === "Escape" || evt.key === "Esc")
      } else {
    	isEscape = (evt.keyCode === 27)
      }
      if (isEscape && document.body.classList.contains('modal-active')) {
    	toggleModal()
      }
    };
    
    
    function toggleModal () {
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      modal.classList.toggle('opacity-0')
      modal.classList.toggle('pointer-events-none')
      body.classList.toggle('modal-active')
    }
  }

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
    console.log("DATA: ", data);
  }, [loading, data]);

  console.log(loading, data, status);
  let nftDiv =
    nfts.length > 0 ? (
      nfts[0].map((token, idx) => {
        console.log(token);
        return (
          <button
            onClick={handleModal}
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
    
        <div className="modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center">
          <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
              <svg
                className="fill-current text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
              <span className="text-sm">(Esc)</span>
            </div>

            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">Simple Modal!</p>
                <div className="modal-close cursor-pointer z-50">
                  <svg
                    className="fill-current text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                  >
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                  </svg>
                </div>
              </div>

              <p>Modal content can go here</p>
              <p>...</p>
              <p>...</p>
              <p>...</p>
              <p>...</p>

              <div className="flex justify-end pt-2">
                <button className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2">
                  Action
                </button>
                <button className="modal-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
    
    </>
  );
}
