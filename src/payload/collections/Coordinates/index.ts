import type { CollectionConfig } from 'payload/types';

export const Coordinates: CollectionConfig = {
    slug: 'coordinates',
    fields: [
        {
            name: 'featureId',
            type: 'text',
            required: true,
            label: 'Feature ID',
        },
        {
            name: 'geometry',
            type: 'json',
            required: true,
            label: 'Geometry',
        },
    ],
};
