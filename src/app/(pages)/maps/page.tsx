'use client';

// Import React JS
import React, { useEffect, useRef, useState } from 'react';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
// Import Indoor Mapping Components
import MapboxGeocoder, { Result } from '@mapbox/mapbox-gl-geocoder';
import centroid from '@turf/centroid';
// Import Mapbox Gl JS
import mapboxgl, { LngLatLike } from 'mapbox-gl';

import { GRAPHQL_API_URL } from '../../_api/shared';
import Sidebar from '../../_components/Sidebar';
import { COORDINATES_QUERY } from '../../_graphql/features';
import { addIndoorTo, IndoorControl, IndoorMap, MapboxMapWithIndoor } from '../../_indoormap';

// Mapbox CSS
// import 'mapbox-gl/dist/mapbox-gl.css';
import '../../_css/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import '../../_css/sidebar.scss';

// Custom CSS
import styles from '../../_css/Mapbox.module.scss';

interface FeatureProperties {
    id: string;
    contact: string;
    usage: string;
    fillOpacity: number;
    fill: string;
    level: string;
    opening_hours?: string | null;
    name: string;
    colour: string;
    block: string;
    area: string;
    accessibility: string;
    strokeWidth: number;
    indoor: string;
    strokeOpacity: number;
    amenities: string[];
    booking: string;
    capacity: number;
    room: string;
    category: string;
    campus: string;
}

interface Coordinate {
    geometry: {
        coordinates: number[][][];
        type: string;
    };
    properties: FeatureProperties;
}

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const fetchGeoJSONData = async () => {
    const response = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: COORDINATES_QUERY,
        }),
    });
    const data = await response.json();
    return data.data.Coordinates.features;
};

const Mapbox = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null); // To store the map instance
    const [indoorMapEnabled, setIndoorMapEnabled] = useState(false);
    const [geojsonMaps, setGeojsonMaps] = useState(null);
    // const [isMenuOpen, setMenuOpen] = useState(false);
    const [locationInfo, setLocationInfo] = useState(null);

    useEffect(() => {
        const initializeMap = async () => {
            mapboxgl.accessToken = mapboxToken;

            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v10',
                center: [103.91289, 1.413576],
                zoom: 17,
            }) as MapboxMapWithIndoor;

            map.setMaxBounds([
                [103.53341384952012, 1.1613787806303861],
                [104.13268465729226, 1.522317784758073],
            ]);

            mapRef.current = map; // Assign the map instance to the ref
            const fetchedData = await fetchGeoJSONData();
            const transformedData = {
                type: 'FeatureCollection',
                features: fetchedData.map((doc: any) => ({
                    ...doc,
                    type: 'Feature',
                })),
            };

            setGeojsonMaps(transformedData);

            // Add controls to the map
            map.addControl(new mapboxgl.FullscreenControl());
            map.addControl(new mapboxgl.GeolocateControl());

            return () => map.remove(); // Cleanup on unmount
        };
        initializeMap();
    }, []);

    const toggleIndoorMap = () => {
        if (indoorMapEnabled) {
            mapRef.current.indoor.removeMap();
            setIndoorMapEnabled(false);
            window.location.reload();
        } else {
            addIndoorTo(mapRef.current);

            // const geojsonMaps: any = [
            //     { data: garedelest.geojson, center: [2.3592843, 48.8767904] },
            //     { data: caserne.geojson, center: [5.723078, 45.183754] },
            //     { data: grandPlace.geojson, center: [5.732179, 45.157955], defaultLevel: 1 },
            // ];
            // geojsonMaps.forEach(({ data, center }) => createMenuButton(data, center));
            const beforeLayerId = 'housenum-label';
            const layersToHide = ['housenum-label'];
            const indoorMap = IndoorMap.fromGeojson(geojsonMaps, {
                beforeLayerId,
                layersToHide,
                defaultLevel: 1,
            });
            mapRef.current.indoor.addMap(indoorMap);

            // Add map to the indoor handler
            // mapRef.current.indoor.addMap(indoorMap);

            const customGeocoder = new MapboxGeocoder({
                localGeocoderOnly: true,
                localGeocoder: (query: string): Result[] => {
                    const matchingFeatures = [];
                    for (let i = 0; i < geojsonMaps.features.length; i++) {
                        const feature = geojsonMaps.features[i];
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
                zoom: 22,
                placeholder: '      Enter search e.g. Room',
                marker: true,
            });
            // An event listener is added to the customGeocoder object for the 'result' event.
            // When a search result is selected, if the result has a properties object and a level property, the indoor level of the map is set to the value of the level property.
            customGeocoder.on('result', (geocoder: any) => {
                if (geocoder.result.properties && geocoder.result.properties.level) {
                    // console.log(geocoder.result.properties.level);
                    mapRef.current.indoor.setLevel(parseInt(geocoder.result.properties.level));
                    const properties = geocoder.result.properties;
                    if (geocoder.result.properties) {
                        const newLocationInfo = {
                            name: geocoder.result.properties || 'Unknown Location',
                            // campus: properties.campus || 'N/A',
                            // area: properties.area || 'N/A',
                            // level: properties.level ? parseInt(properties.level) : 'N/A',
                            // description: properties.description || 'No description available.',
                            // amenities: properties.amenities
                            //     ? properties.amenities.split(',').map((a: string) => a.trim())
                            //     : [],
                        };
                        setLocationInfo(geocoder.result.properties);
                    }
                }
            });
            // mapRef.current.addControl(customGeocoder, 'top-left');
            mapRef.current.addControl(new IndoorControl());
            setIndoorMapEnabled(true);
            // mapRef.current.addControl(
            //     new MapboxDirections({
            //         accessToken: mapboxgl.accessToken,
            //         unit: 'metric',
            //     }),
            //     'top-left',
            // );
            document
                .querySelector('.sidebar-content')
                // .appendChild(customGeocoder.onAdd(mapRef.current));
                .insertBefore(
                    new MapboxDirections({
                        accessToken: mapboxgl.accessToken,
                        unit: 'metric',
                    }).onAdd(mapRef.current),
                    document.querySelector('.sidebar-content').firstChild,
                );
            document
                .querySelector('.sidebar-content')
                // .appendChild(customGeocoder.onAdd(mapRef.current));
                .insertBefore(
                    customGeocoder.onAdd(mapRef.current),
                    document.querySelector('.sidebar-content').firstChild,
                );
        }
    };

    const flyToLocation = center => {
        mapRef.current.flyTo({ center, zoom: 22, duration: 2000 });
    };

    const hardcodedLocationInfo = {
        name: 'Main Library',
        campus: 'North Campus',
        area: 'Academic Zone',
        level: '2nd Floor',
        description:
            'The main library houses over 1 million books and provides quiet study areas for students.',
        amenities: [
            'Silent Study Rooms',
            'Group Study Areas',
            'Computer Lab',
            'Printing Services',
            'Cafeteria',
        ],
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <button
                className={styles.normal}
                onClick={() => flyToLocation([103.911942, 1.413465])}
                style={{ position: 'relative', top: 20, left: 70 }}
            >
                Fly
            </button>
            <button
                className={styles.normal}
                onClick={toggleIndoorMap}
                style={{ position: 'relative', top: 20, left: 100 }}
            >
                {indoorMapEnabled ? 'Disable Indoor Map' : 'Enable Indoor Map'}
            </button>

            <div id="main-container" className={styles.mapContainer}>
                <div
                    className="map-container"
                    ref={mapContainerRef}
                    style={{ height: '90vh', width: '90vw' }}
                >
                    {/* <div className={styles.dropdown}>
                        <button
                            className={styles.dropbtn}
                            onClick={() => setMenuOpen(!isMenuOpen)}
                            style={{ position: 'absolute', top: 50, left: 10, zIndex: 1000 }}
                        >
                            Locations <i className="fa fa-caret-down"></i>
                        </button>
                    </div> */}
                    {/* <div
                        className={`${styles.dropdownContent} ${isMenuOpen ? styles.show : ''}`}
                        style={{ zIndex: 1000 }}
                    >
                        {geojsonMaps.map((item, index) => (
                            <button
                                className={styles.dropbtn}
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
                    </div> */}
                    {/* <button
                        className={styles.dropbtn}
                        onClick={() => setMenuOpen(!isMenuOpen)}
                        style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}
                    >
                        Toggle Menu
                    </button> */}
                    <Sidebar
                        locationInfo={locationInfo}
                        isOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                    />
                </div>
            </div>
        </div>
    );
};

export default Mapbox;
