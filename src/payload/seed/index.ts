/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import type { Payload } from 'payload';

import type { Coordinate, Feature } from '../payload-types'; // Import the generated types

function simpleHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export const seed = async (payload: Payload): Promise<void> => {
    payload.logger.info('Seeding database...');

    // Read the GeoJSON file
    const filePath = path.join(__dirname, 'punggol.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const geojson = JSON.parse(data);
    const featurePromises = geojson.features?.map(async (feature: any) => {
        const { geometry, properties } = feature;
        const coordinates = geometry.coordinates;
        const coordinatesString = coordinates.join(','); // Convert array of numbers to a string
        const hash = simpleHash(coordinatesString);
        const featureId = properties.id || `default${hash}`;
        // const amenity = properties.amenities ? Object.values(properties.amenities) : [];
        // const amenityArray = Object.keys(properties.amenities || []).map(
        //     key => properties.amenities[key],
        // );
        // payload.logger.info(amenityArray);
        // Insert feature properties
        const existingFeature = await payload.find({
            collection: 'features',
            where: { id: { equals: featureId } },
        });
        // payload.logger.info(existingFeature);

        if (existingFeature.totalDocs === 0) {
            const featureData: Feature = {
                id: featureId,
                amenities: [],
                capacity: properties?.capacity || 0,
                contact: properties?.contact || '',
                usage: properties?.usage || '',
                fillOpacity: properties?.fillOpacity || '',
                fill: properties?.fill || '',
                level: properties?.level || '',
                name: properties?.name || '',
                colour: properties?.colour || '',
                block: properties?.block || '',
                area: properties?.area || '',
                accessibility: properties?.accessibility || '',
                strokeWidth: properties?.strokeWidth || '',
                indoor: properties?.indoor || '',
                strokeOpacity: properties?.strokeOpacity || '',
                booking: properties?.booking || '',
                type: properties?.type || '',
                room: properties?.room || '',
                category: properties?.category || '',
                campus: properties?.campus || '',
                updatedAt: '',
                createdAt: '',
            };
            await payload.create({
                collection: 'features',
                data: featureData,
            });
        }

        // Insert feature geometry
        const existingGeometry = await payload.find({
            collection: 'coordinates',
            where: { id: { equals: featureId } },
        });

        if (existingGeometry.totalDocs === 0) {
            const geometryData: Coordinate = {
                FeatureID: featureId,
                geometry,
                id: '',
                updatedAt: '',
                createdAt: '',
            };
            // payload.logger.info(geometryData);
            await payload.create({
                collection: 'coordinates',
                data: geometryData,
            });
        }
    });

    await Promise.all(featurePromises);
    payload.logger.info('Database seeded successfully!');
};

export default seed;
