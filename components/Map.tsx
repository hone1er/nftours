import { MapContainer, TileLayer,Marker,Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import { NFTlinks } from '../scripts/NFTlinks';

const Map = () => {
  
  
  let markers = NFTlinks.map((obj)=> {
    console.log(obj);
    
    return (
    <>
    <Marker position={obj.location}>
    <Popup>
      {obj.description}
      <img src={obj.image} alt="" />
    </Popup>
    </Marker>
    </>
    )
  })
  return (
    <MapContainer center={[38.0171441,-122.2885808]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {markers}
  </MapContainer>
  )
}

export default Map