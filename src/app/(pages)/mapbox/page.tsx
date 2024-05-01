'use client';

// import ReactMapBoxGl, { Feature, Layer } from 'react-mapbox-gl';

import { useRef } from 'react';
import type { FillExtrusionLayer, FillLayer } from 'react-map-gl';
import Map, { FullscreenControl, GeolocateControl, Layer, Source, useMap } from 'react-map-gl';
import MapboxGeocoder, { Result } from '@mapbox/mapbox-gl-geocoder';
import centroid from '@turf/centroid';

import gjson from '../../_data/geojson.json';
import { addIndoorTo, IndoorControl, IndoorMap } from '../../_indoormap';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import styles from '../../_css/Mapbox.module.scss';

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// const Mapbox = () => {
//     //   const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
//     const Map = ReactMapBoxGl({
//         accessToken: `${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
//     });

//     return (
//         <Map
//             style="mapbox://styles/mapbox/standard"
//             containerStyle={{
//                 height: '100vh',
//                 width: '100vw',
//             }}
//             zoom={[17]}
//             center={[103.91289, 1.413576]}
//             onStyleLoad={map => {
//                 map.setConfigProperty('basemap', 'lightPreset', 'night');
//             }}
//         >
//             <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
//                 <Feature coordinates={[103.91289, 1.413576]} />
//             </Layer>
//         </Map>
//     );
// };

// const geojson: any = {
//     type: 'Feature',
//     properties: {
//         level: 1,
//         name: 'Bird Exhibit',
//         height: 40,
//         base_height: 0,
//         color: 'red',
//     },
//     geometry: {
//         coordinates: [
//             [
//                 [103.91178, 1.413886],
//                 [103.912187, 1.413889],
//                 [103.912304, 1.413484],
//                 [103.912299, 1.41344],
//                 [103.911883, 1.413438],
//                 [103.91178, 1.41383],
//                 [103.91178, 1.413886],
//             ],
//         ],
//         type: 'Polygon',
//     },
// };

// const geojson: any = gjson.geojson;
const layerStyle: FillExtrusionLayer = {
    id: 'room',
    type: 'fill-extrusion',
    source: '3d-building',
    paint: {
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'base_height'],
        'fill-extrusion-opacity': 0.5,
    },
};

const Mapbox = () => {
    const mapRef = useRef(null);

    const flyToLocation = () => {
        const map = mapRef.current.getMap(); // Access the native Mapbox GL JS map instance
        map.flyTo({
            center: [2.3596569, 48.8765734],
            zoom: 14,
            speed: 1.2,
            curve: 1,
            easing: t => t,
        });
        addIndoorTo(map);
        const geojson: any = gjson.geojson;
        map.indoor.addMap(IndoorMap.fromGeojson(geojson));
        const customGeocoder = new MapboxGeocoder({
            localGeocoderOnly: true,
            localGeocoder: (query: string): Result[] => {
                const matchingFeatures = [];
                for (let i = 0; i < geojson.features.length; i++) {
                    const feature = geojson.features[i];
                    if (
                        feature.properties.name &&
                        feature.properties.name.toLowerCase().search(query.toLowerCase()) !== -1
                    ) {
                        feature['place_name'] = feature.properties.name;
                        feature['center'] = centroid(feature).geometry.coordinates;
                        feature['place_type'] = ['park'];
                        matchingFeatures.push(feature);
                    }
                }
                return matchingFeatures;
            },
            mapboxToken,
            zoom: 20,
            placeholder: 'Enter search e.g. Room',
            marker: false,
        });
        customGeocoder.on('result', (geocoder: any) => {
            if (geocoder.result.properties && geocoder.result.properties.level) {
                map.indoor.setLevel(parseInt(geocoder.result.properties.level));
            }
        });
        map.addControl(customGeocoder, 'top-left');
        map.addControl(new IndoorControl());
    };
    return (
        <div className={styles.mapContainer}>
            <Map
                ref={mapRef}
                mapboxAccessToken={mapboxToken}
                initialViewState={{
                    longitude: 103.91289,
                    latitude: 1.413576,
                    zoom: 17,
                }}
                style={{ width: '90vw', height: '90vh' }}
                mapStyle="mapbox://styles/hk2k1/clvi65o5j001201qu5rp73mzb"
            >
                <button onClick={flyToLocation} style={{ position: 'absolute', top: 10, left: 10 }}>
                    Fly
                </button>
                <FullscreenControl />
                <GeolocateControl />
                {/* <Source id="3d-building" type="geojson" data={geojson}>
                    <Layer {...layerStyle} />
                </Source> */}
            </Map>
        </div>
    );
};

export default Mapbox;
