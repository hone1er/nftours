import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { NFTlinks } from "../scripts/NFTlinks";
import React, { useContext, useState } from "react";
import AppContext from "../AppContext";
import { motion } from "framer-motion";

function Map() {
  const { latlng } = useContext(AppContext);

  const userMarker =
    latlng.length > 0 ? (
      <Marker position={[latlng[0], latlng[1]]}>
        <Popup>You are here</Popup>
      </Marker>
    ) : null;

  return (
    <MapContainer
      className=""
      center={userMarker ? latlng : [38.0171441, -122.2885808]}
      zoom={5}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {latlng.length > 0 && NFTlinks && (
        <div className="block">
          {NFTlinks?.map((obj, idx) => (
            <Marker key={idx} position={obj.location}>
              <Popup>
                {obj.description}
                <img src={obj.image} alt="" />
              </Popup>
            </Marker>
          ))}
          ;{userMarker ? userMarker : null}
        </div>
      )}
    </MapContainer>
  );
}

export default Map;
