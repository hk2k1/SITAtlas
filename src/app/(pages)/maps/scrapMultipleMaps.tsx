'use client';

// Import React JS
import React, { useEffect, useRef, useState } from 'react';
// Import Indoor Mapping Components
import MapboxGeocoder, { Result } from '@mapbox/mapbox-gl-geocoder';
import centroid from '@turf/centroid';
// Import Mapbox Gl JS
import mapboxgl, { LngLatLike } from 'mapbox-gl';

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
    const garedelestgeojson: any = garedelest.geojson;
    const casernegeojson: any = caserne.geojson;
    const grandPlacegeojson: any = grandPlace.geojson;
    const [indoorMapEnabled, setIndoorMapEnabled] = useState(false);
    const [geojsonMaps, setGeojsonMaps] = useState([
        { data: garedelestgeojson, center: [2.3592843, 48.8767904], name: 'garedelest' },
        { data: casernegeojson, center: [5.723078, 45.183754], name: 'caserne' },
        {
            data: grandPlacegeojson,
            center: [5.732179, 45.157955],
            name: 'grandPlace',
            defaultLevel: 1,
        },
    ]);
    const [isMenuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        mapboxgl.accessToken = mapboxToken;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v10',
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
            mapRef.current.indoor.removeMap();
            setIndoorMapEnabled(false);
        } else {
            addIndoorTo(mapRef.current);

            // const geojsonMaps: any = [
            //     { data: garedelest.geojson, center: [2.3592843, 48.8767904] },
            //     { data: caserne.geojson, center: [5.723078, 45.183754] },
            //     { data: grandPlace.geojson, center: [5.732179, 45.157955], defaultLevel: 1 },
            // ];
            // geojsonMaps.forEach(({ data, center }) => createMenuButton(data, center));
            const beforeLayerId = 'housenum-label';
            const layersToHide = [
                'poi-scalerank4-l15',
                'poi-scalerank4-l1',
                'poi-scalerank3',
                'road-label-small',
            ];
            geojsonMaps.forEach(({ data, defaultLevel }) => {
                // Create indoor map from imported geojson and options
                const indoorMap = IndoorMap.fromGeojson(data, {
                    beforeLayerId,
                    defaultLevel,
                });

                // Add map to the indoor handler
                mapRef.current.indoor.addMap(indoorMap);
            });

            const customGeocoder = new MapboxGeocoder({
                localGeocoderOnly: true,
                localGeocoder: (query: string): Result[] => {
                    const matchingFeatures = [];
                    for (let i = 0; i < garedelestgeojson.features.length; i++) {
                        const feature = garedelestgeojson.features[i];
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

    // const flyToLocation = center => {
    //     mapRef.current.flyTo({
    //         center: center ? center : [2.3592843, 48.8767904],
    //         zoom: 18,
    //         speed: 3.2,
    //         curve: 1,
    //         easing: t => t,
    //     });
    // };

    const flyToLocation = center => {
        mapRef.current.flyTo({ center, zoom: 18, duration: 2000 });
    };

    // const menuContainer = document.createElement('div');
    // // Create a list element to hold the buttons
    // const menuList = document.createElement('ul');
    // menuList.className = 'menu-list';
    // menuContainer.appendChild(menuList);

    // // Function to create menu buttons
    // function createMenuButton(mapPath: string, center: LngLatLike) {
    //     const listItem = document.createElement('li');
    //     const btn = document.createElement('button');
    //     btn.innerHTML = mapPath.toString().replace(/^.*[/]/, '');
    //     btn.addEventListener('click', () => {
    //         mapRef.current.flyTo({ center, zoom: 18, duration: 2000 });
    //     });
    //     listItem.appendChild(btn);
    //     menuList.appendChild(listItem);
    // }

    return (
        <div>
            <button
                className={styles.normal}
                onClick={() => flyToLocation([2.3592843, 48.8767904])}
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
                >
                    <div
                        className={`${styles.menu} ${isMenuOpen ? styles.active : ''}`}
                        style={{ zIndex: 1000 }}
                    >
                        {geojsonMaps.map((item, index) => (
                            <button
                                className={styles.button}
                                key={index}
                                onClick={() => {
                                    flyToLocation(item.center);
                                    setMenuOpen(false);
                                }}
                                style={{ zIndex: 1000 }}
                            >
                                Fly to {item.name}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setMenuOpen(!isMenuOpen)}
                        style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}
                    >
                        Toggle Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Mapbox;
