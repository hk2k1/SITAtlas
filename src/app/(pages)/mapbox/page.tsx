'use client';

import ReactMapBoxGl, { Feature, Layer } from 'react-mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

// import classes from './'

const Mapbox = () => {
    //   const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const Map = ReactMapBoxGl({
        accessToken: `${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
    });

    return (
        <Map
            style="mapbox://styles/mapbox/standard"
            containerStyle={{
                height: '100vh',
                width: '100vw',
            }}
            zoom={[17]}
            center={[103.91289, 1.413576]}
            onStyleLoad={map => {
                map.setConfigProperty('basemap', 'lightPreset', 'night');
            }}
        >
            <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                <Feature coordinates={[103.91289, 1.413576]} />
            </Layer>
        </Map>
    );
};

export default Mapbox;
