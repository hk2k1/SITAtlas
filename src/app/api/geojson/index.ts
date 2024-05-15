async function fetchGeoJSON(): Promise<any> {
    const featuresResponse = await fetch('/api/features');
    const coordinatesResponse = await fetch('/api/coordinates');

    const features = await featuresResponse.json();
    const coordinates = await coordinatesResponse.json();

    const geojson = {
        type: 'FeatureCollection',
        features: features.map(feature => {
            const featureCoordinates = coordinates.find(coord => coord.featureId === feature.id);
            return {
                type: 'Feature',
                properties: feature,
                geometry: featureCoordinates ? featureCoordinates.geometry : null,
            };
        }),
    };

    return geojson;
}
