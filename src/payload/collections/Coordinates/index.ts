import type { CollectionConfig } from 'payload/types';

import { admins } from '../../access/admins';

export const Coordinates: CollectionConfig = {
    slug: 'coordinates',
    admin: {
        useAsTitle: 'FeatureID',
    },
    access: {
        read: () => true,
        update: admins,
        create: admins,
        delete: admins,
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
