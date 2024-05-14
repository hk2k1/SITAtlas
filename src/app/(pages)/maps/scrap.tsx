'use client';

// Import React JS
import React, { useEffect, useRef, useState } from 'react';
// Import Indoor Mapping Components
import MapboxGeocoder, { Result } from '@mapbox/mapbox-gl-geocoder';
import centroid from '@turf/centroid';
// Import Mapbox Gl JS
import mapboxgl from 'mapbox-gl';

// JSON Data
import caserne from '../../_data/caserne.json';
import garedelest from '../../_data/gare-de-l-est.json';
import gjson from '../../_data/geojson.json';
import grandPlace from '../../_data/grand-place.json';
import { addIndoorTo, IndoorControl, IndoorMap, MapboxMapWithIndoor } from '../../_indoormap';

// Mapbox CSS
// import 'mapbox-gl/dist/mapbox-gl.css';
import '../../_css/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

// Custom CSS
import styles from '../../_css/Mapbox.module.scss';

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Mapbox = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null); // To store the map instance
    const geojson: any = gjson.geojson;
    const [indoorMapEnabled, setIndoorMapEnabled] = useState(false);

    useEffect(() => {
        mapboxgl.accessToken = mapboxToken;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/hk2k1/clvi65o5j001201qu5rp73mzb',
            center: [103.91289, 1.413576],
            zoom: 17,
        }) as MapboxMapWithIndoor;

        mapRef.current = map; // Assign the map instance to the ref

        // Add controls to the map
        map.addControl(new mapboxgl.FullscreenControl());
        map.addControl(new mapboxgl.GeolocateControl());

        // Load and add GeoJSON as a source and layer
        // map.on('load', () => {
        //     map.addSource('3d-building', {
        //         type: 'geojson',
        //         data: geojson,
        //     });

        //     map.addLayer({
        //         id: 'room',
        //         type: 'fill-extrusion',
        //         source: '3d-building',
        //         paint: {
        //             'fill-extrusion-color': ['get', 'color'],
        //             'fill-extrusion-height': ['get', 'height'],
        //             'fill-extrusion-base': ['get', 'base_height'],
        //             'fill-extrusion-opacity': 0.5,
        //         },
        //     });
        // });

        return () => map.remove(); // Cleanup on unmount
    }, []);

    const toggleIndoorMap = () => {
        if (indoorMapEnabled) {
            mapRef.current.indoor.removeMap(IndoorMap.fromGeojson(geojson));
            setIndoorMapEnabled(false);
        } else {
            addIndoorTo(mapRef.current);
            mapRef.current.indoor.addMap(IndoorMap.fromGeojson(geojson));
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
                    mapRef.current.indoor.setLevel(parseInt(geocoder.result.properties.level));
                }
            });
            mapRef.current.addControl(customGeocoder, 'top-left');
            mapRef.current.addControl(new IndoorControl());
            setIndoorMapEnabled(true);
        }
    };

    const flyToLocation = () => {
        mapRef.current.flyTo({
            center: [2.3596569, 48.8765734],
            zoom: 18,
            speed: 3.2,
            curve: 1,
            easing: t => t,
        });
    };

    return (
        <div>
            <button
                className={styles.normal}
                onClick={flyToLocation}
                style={{ position: 'absolute', top: 60, left: 20 }}
            >
                Fly
            </button>
            <button
                className={styles.normal}
                onClick={toggleIndoorMap}
                style={{ position: 'absolute', top: 60, left: 100 }}
            >
                {indoorMapEnabled ? 'Disable Indoor Map' : 'Enable Indoor Map'}
            </button>
            <div className={styles.mapContainer}>
                <div
                    className="map-container"
                    ref={mapContainerRef}
                    style={{ height: '90vh', width: '90vw' }}
                ></div>

                {/* <button onClick={flyToLocation} style={{ position: 'absolute', top: 60, left: 10 }}>
                Fly
            </button> */}
                <div className="menu">
                    {geojsonMaps.map((item, index) => (
                        <button
                            className={styles.normal}
                            key={index}
                            onClick={() => flyToLocation(item.center)}
                        >
                            Fly to {item.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Mapbox;
