import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { myLoader } from "../scripts/profileHelpers";
import styles from "../styles/Home.module.css";

function Modal(props) {
  console.log(props.item);
  const { modal, setModal } = useContext(AppContext);
  const visibility = modal;
  function toggleModal() {
    setModal(modal == "visible" ? "invisible" : "visible");
  }
  return (
    <div x-data="{ show: true }" className={visibility}>
      <div className="flex justify-center"></div>
      {props.item && (
        <div
          x-show="show"
          tabIndex="0"
          className="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed"
        >
          <div
            className="z-50 relative p-3 mx-auto my-0 max-w-full"
            style={{ width: "1000px" }}
          >
            <div className="bg-white rounded shadow-lg border flex flex-col overflow-hidden">
              <button
                className="fill-current h-6 w-6 absolute right-0 top-0 m-6 font-3xl font-bold"
                onClick={toggleModal}
              >
                &times;
              </button>
              <div className="px-6 py-3 text-xl border-b font-bold">
                {props.item.description}
              </div>
              <div className="p-6 flex-grow md:flex max-w-md text-center  max-w-full justify-around bg-gray-800">
                {props.item.image && (
                  <Image
                    className="object-center object-cover h-32 w-32 bg-white m-2"
                    loader={myLoader}
                    src={props.item.image}
                    alt="Picture of the author"
                    width={375}
                    height={375}
                    placeholder="blurDataURL"
                  />
                )}
                <div className="md:w-5/12 w-full p-5 pt-2  rounded-md bg-gray-900 shadow-md">
                  <h1 className="lg:text-4xl text-3xl font-semibold mt-2 mb-2 bg-gray-200 p-6">
                    {props.item.name}
                  </h1>
                  <div className="bg-gray-100 md:mt-8 mt-4 p-4 h-64">
                    <div className="flex border-b borer-black mt-3">
                      <p className="font-medium pr-1">Location: </p>
                      <p> {props.item.description}</p>
                    </div>
                    <div className="flex border-b borer-black mt-3">
                      <p className="font-medium pr-1">Longitude: </p>
                      <p>{props.item.attributes.longitude}</p>
                    </div>
                    <div className="flex border-b borer-black mt-3">
                      <p className="font-medium pr-1">Latitude: </p>
                      <p> {props.item.attributes.latitude}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 border-t">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-700 text-gray-100 rounded px-4 py-2 mr-1"
                    onClick={toggleModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-50"></div>
        </div>
      )}
    </div>
  );
}

export default Modal;
