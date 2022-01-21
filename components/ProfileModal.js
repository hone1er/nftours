import { Spinner } from "@chakra-ui/react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { myLoader, updateProfile } from "../scripts/profileHelpers";

function ProfileModal(props) {
  const { setName, name, setImage, image, id, setID, setSigned, handleToggle } =
    useContext(AppContext);
  const [tempName, setTempName] = useState(name);
  const [tempImage, setTempImage] = useState(image);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    console.log("signing up");
    const updated = await updateProfile(tempName, tempImage);
    if (updated) {
      setID(tempName);
      setSigned(true);
    }
  }

  async function handleSave() {
    setLoading(true);
    await handleSignUp();
    setName(tempName);
    setImage(tempImage);
    setLoading(false);
    handleToggle();
  }

  // When the user clicks anywhere outside of the modal, close it
  useEffect(function onFirstMount() {
    function onClick(e) {
      let page = document.getElementById("page");
      if (e.target == page && props.profileModal) {
        handleToggle();
      }
    }

    window.addEventListener("click", (e) => onClick(e));
  });

  useEffect(() => {
    setTempName(name);
    setTempImage(image);
  }, [name, image]);
  return (
    <div x-data="{ show: true }" className={props.visible}>
      <div className="flex justify-center"></div>

      <div
        x-show="show"
        tabIndex="0"
        className={
          image
            ? "z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-min h-3/4  m-auto fixed"
            : "z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-min h-2/5  m-auto fixed"
        }
      >
        <div
          className="z-50 relative p-3 mx-auto my-0 max-w-full"
          style={{ width: "600px" }}
        >
          <div className="bg-white rounded shadow-lg border flex flex-col overflow-hidden">
            <button
              className="fill-current h-6 w-6 absolute right-0 top-0 m-6 font-3xl font-bold"
              onClick={props.handleToggle}
            >
              &times;
            </button>
            <div className="px-6 py-3 text-xl border-b font-bold">
              {id == "" ? "Sign-up with wallet" : "Update profile"}
            </div>
            {loading ? (
              <div className="w-full flex justify-center items-center h-96 min-h-96">
                <Spinner size="xl" className="min-h-64" />
              </div>
            ) : (
              <div className="p-6 flex-grow text-center items-center">
                {name && (
                  <h1 className="text-3xl font-semibold mt-2 mb-2">{name}</h1>
                )}
                {image && (
                  <Image
                    className="object-center object-cover h-36 w-36"
                    loader={myLoader}
                    src={image}
                    alt="Profile Picture"
                    width={275}
                    height={275}
                    placeholder="blurDataURL"
                  />
                )}
                <div className="flex flex-col mt-4">
                  <input
                    className="shadow appearance-none border rounded py-2 px-3 w-full sm:w-6/12 max-w-xs m-auto text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    placeholder="Name"
                    onChange={(e) => setTempName(e.target.value)}
                  />
                  <br />
                  <input
                    className="shadow appearance-none border rounded py-2 px-3 w-full sm:w-6/12 max-w-xs m-auto text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    placeholder="Profile Image"
                    onChange={(e) => setTempImage(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="px-6 py-3 border-t">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-700 text-gray-100 rounded px-4 py-2 mr-1"
                  onClick={props.handleToggle}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-gray-100 rounded px-4 py-2 mr-1"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
