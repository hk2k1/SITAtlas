'use client';

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
// import MarkerIcon from '../../../../../node_modules/leaflet/dist/images/marker-icon.png';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';

// import MarkerIcon from 'leafletdistimagesmarker-icon.png';
// import MarkerShadow from 'leafletdistimagesmarker-shadow.png';
// import { MarkerIcon, MarkerShadow } from 'leaflet';
// import MarkerShadow from '../../../../../node_modules/leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// function MyComponent(position) {
//     const map = useMap();
//     useEffect(() => {
//         map.flyTo(position);
//     }, [position]);

//     return null;
// }

const Map = () => {
    var latlng = new LatLng(1.4126690459532725, 103.91086249919728);
    const [coord, setCoord] = useState(latlng);

    // const SearchLocation = () => {
    //     return (
    //         <div className="search-location">
    //             <input type="text" placeholder="Search Location" />
    //         </div>
    //     );
    // };

    // const GetMyLocation = () => {
    //     const getMyLocation = () => {
    //         if (navigator.geolocation) {
    //             navigator.geolocation.getCurrentPosition(position => {
    //                 setCoord(new LatLng(position.coords.latitude, position.coords.longitude));
    //                 console.log(coord);
    //                 const map = useMap();
    //                 useEffect(() => {
    //                     map.flyTo(coord);
    //                 }, [coord]);
    //             });
    //         } else {
    //             console.log('Geolocation is not supported by this browser.');
    //         }
    //     };
    //     return (
    //         <div className="get-my-location">
    //             <button onClick={getMyLocation}>Get My Location</button>
    //         </div>
    //     );
    // };

    return (
        <div>
            {/* <SearchLocation />
            <GetMyLocation /> */}
            <MapContainer
                style={{ height: '100%', width: '100%', position: 'absolute' }}
                center={coord}
                zoom={13}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxNativeZoom={19}
                    maxZoom={25}
                />
                <Marker
                    icon={
                        new L.Icon({
                            iconUrl: MarkerIcon.src,
                            iconRetinaUrl: MarkerIcon.src,
                            iconSize: [25, 41],
                            iconAnchor: [12.5, 41],
                            popupAnchor: [0, -41],
                            shadowUrl: MarkerShadow.src,
                            shadowSize: [41, 41],
                        })
                    }
                    position={coord}
                >
                    <Popup>
                        A pretty CSS3. <br /> Easily Customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default Map;
