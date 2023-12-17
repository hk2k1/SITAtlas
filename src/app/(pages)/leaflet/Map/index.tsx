'use client'
import { useEffect } from 'react';
import * as ReactLeaflet from 'react-leaflet';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
// import Leaflet from 'leaflet';
import Leaflet from 'leaflet'
import styles from './map.module.scss';
import 'leaflet/dist/leaflet.css'
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

// function LocationMarker() {
//     const [position, setPosition] = useState(null)
//     const map = useMapEvents({
//       click() {
//         map.locate()
//       },
//       locationfound(e) {
//         setPosition(e.latlng)
//         map.flyTo(e.latlng, map.getZoom())
//       },
//     })
  
//     return position === null ? null : (
//       <Marker position={position}>
//         <Popup>You are here</Popup>
//       </Marker>
//     )
//   }
    // useEffect(() => {
    //     (async function init() {
    //     // delete Leaflet.Icon.Default.prototype._getIconUrl;
    //         delete Leaflet.Icon.Default.prototype;
    //         Leaflet.Icon.Default.mergeOptions({
    //             iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    //             iconUrl: require('leaflet/dist/images/marker-icon.png'),
    //             shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    //         });
    //     // Leaflet.Icon.Default.mergeOptions({
    //     //     iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
    //     //     iconUrl: 'leaflet/images/marker-icon.png',
    //     //     shadowUrl: 'leaflet/images/marker-shadow.png',
    //     // });
    //     })();
    // }, []);

const Map = () => {
    // let mapClassName = styles.map
    // const ResizeMap = () => {
    //     const map = useMap();
    //     // map._onResize();
    //     return null;
    //   };

    return ( 
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} >
            {/* <ResizeMap /> */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
     );
}
 
export default Map;