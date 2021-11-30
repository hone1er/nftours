import Image from "next/image";
import React, { useContext } from "react";
import AppContext from "../AppContext";
import { myLoader, updateProfile } from "../scripts/profileHelpers";
function ProfileModal(props) {
  const { setName, name, setImage, image, id } = useContext(AppContext);

  async function handleSignUp() {
    const updated = await updateProfile(name, image);
    if (updated) {
      setID(name);
      setSigned(true);
    }
  }
  return (
    <div x-data="{ show: true }" className={props.visible}>
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
              onClick={props.handleToggle}
            >
              &times;
            </button>
            <div className="px-6 py-3 text-xl border-b font-bold">
              {id == "" ? "Sign-up with wallet" : "Update profile"}
            </div>
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
                  onChange={(e) => setName(e.target.value)}
                />
                <br />
                <input
                  className="shadow appearance-none border rounded py-2 px-3 w-full sm:w-6/12 max-w-xs m-auto text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  placeholder="Profile Image"
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>
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
                  onClick={props.handleSignUp}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-50"></div>
      </div>
    </div>
  );
}

export default ProfileModal;
