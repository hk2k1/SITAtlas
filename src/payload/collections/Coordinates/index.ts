import type { CollectionConfig } from 'payload/types';

export const Coordinates: CollectionConfig = {
    slug: 'coordinates',
    admin: {
        useAsTitle: 'FeatureID',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'FeatureID',
            type: 'relationship',
            relationTo: 'features',
            label: 'Feature ID',
        },
        {
            name: 'geometry',
            type: 'json',
            required: false,
            label: 'Geometry',
        },
    ],
};
