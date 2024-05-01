'use client';

// Import React JS and Mapbox Gl JS
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// JSON Data
import gjson from '../../_data/geojson.json';

// Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

// Custom CSS
import styles from '../../_css/Mapbox.module.scss';

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Mapbox = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null); // To store the map instance
    const geojson: any = gjson.geojson;

    useEffect(() => {
        mapboxgl.accessToken = mapboxToken;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/hk2k1/clvi65o5j001201qu5rp73mzb',
            center: [103.91289, 1.413576],
            zoom: 17,
        });

        mapRef.current = map; // Assign the map instance to the ref

        // Add controls to the map
        map.addControl(new mapboxgl.FullscreenControl());
        map.addControl(new mapboxgl.GeolocateControl());

        // Load and add GeoJSON as a source and layer
        map.on('load', () => {
            map.addSource('3d-building', {
                type: 'geojson',
                data: geojson,
            });

            map.addLayer({
                id: 'room',
                type: 'fill-extrusion',
                source: '3d-building',
                paint: {
                    'fill-extrusion-color': ['get', 'color'],
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'base_height'],
                    'fill-extrusion-opacity': 0.5,
                },
            });
        });

        return () => map.remove(); // Cleanup on unmount
    }, []);

    const flyToLocation = () => {
        mapRef.current.flyTo({
            center: [-122.4, 37.8],
            zoom: 14,
            speed: 1.2,
            curve: 1,
            easing: t => t,
        });
    };

    return (
        <div className={styles.mapContainer}>
            <div
                className="map-container"
                ref={mapContainerRef}
                style={{ height: '90vh', width: '90vw' }}
            >
                <button onClick={flyToLocation} style={{ position: 'absolute', top: 10, left: 10 }}>
                    Fly
                </button>
            </div>
        </div>
    );
};

export default Mapbox;
