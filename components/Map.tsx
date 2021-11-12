import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { NFTlinks } from "../scripts/NFTlinks";

import React, { useContext, useState } from "react";
import AppContext from "../AppContext";

function Map(props) {
  const { latlng } = useContext(AppContext);
  console.log(latlng);
  
  const userMarker = latlng.length > 0 ?
      <Marker position={[latlng[0], latlng[1]]}>
        <Popup >
          You are here
        </Popup>
      </Marker> : null
 
  const nftMarkers = NFTlinks.map((obj, idx) => {

    return (
      <Marker key={idx} position={obj.location}>
        <Popup>
          {obj.description}
          <img src={obj.image} alt="" />
        </Popup>
      </Marker>
    );
  });
  return (
    <MapContainer
      center={userMarker ? latlng : [38.0171441, -122.2885808]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {nftMarkers}
      {userMarker ? userMarker : null}
    </MapContainer>
  );
}

export default Map;
