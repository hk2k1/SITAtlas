// import Map from './Map'
import dynamic from 'next/dynamic';
// import { useMemo } from 'react';
// console.log(useMemo);

export default async function Leaflet() {
    // useMemo(()=>console.log("test"),[])
    const Map = dynamic(() => import('./Map'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
    });

    return (
        <div>
            <Map />
        </div>
    );
}
