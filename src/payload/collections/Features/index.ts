import type { CollectionConfig } from 'payload/types';

import { admins } from '../../access/admins';

export const Features: CollectionConfig = {
    slug: 'features',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'level', 'campus', 'id '],
    },
    access: {
        read: () => true,
        update: admins,
        create: admins,
        delete: admins,
    },
    fields: [
        {
            name: 'id',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'contact',
            type: 'text',
            required: false,
        },
        {
            name: 'usage',
            type: 'text',
            required: false,
        },
        {
            name: 'fillOpacity',
            type: 'text',
            required: false,
        },
        {
            name: 'fill',
            type: 'text',
            required: false,
        },
        {
            name: 'level',
            type: 'text',
            required: false,
        },
        {
            name: 'opening_hours',
            type: 'text',
        },
        {
            name: 'name',
            type: 'text',
            required: false,
        },
        {
            name: 'colour',
            type: 'text',
            required: false,
        },
        {
            name: 'block',
            type: 'text',
            required: false,
        },
        {
            name: 'area',
            type: 'text',
            required: false,
        },
        {
            name: 'accessibility',
            type: 'text',
            required: false,
        },
        {
            name: 'strokeWidth',
            type: 'text',
            required: false,
        },
        {
            name: 'indoor',
            type: 'text',
            required: false,
        },
        {
            name: 'strokeOpacity',
            type: 'text',
            required: false,
        },
        {
            name: 'amenities',
            type: 'select', // required
            hasMany: true,
            admin: {
                isClearable: true,
                isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
            },
            options: ['projector', 'whiteboard', 'snacks', 'coffee machine', 'monitor'],
            //     {
            //         label: 'projector',
            //         value: 'projector',
            //     },
            //     {
            //         label: 'whiteboard',
            //         value: 'whiteboard',
            //     },
            //     {
            //         label: 'snacks',
            //         value: 'snacks',
            //     },
            //     {
            //         label: 'coffee machine',
            //         value: 'coffee_machine',
            //     },
            //     {
            //         label: 'monitor',
            //         value: 'monitor',
            //     },
            // ],
            required: false,
        },
        {
            name: 'booking',
            type: 'text',
            required: false,
        },
        {
            name: 'capacity',
            type: 'number',
            defaultValue: 0,
            required: false,
        },
        {
            name: 'type',
            type: 'text',
            required: false,
        },
        {
            name: 'room',
            type: 'text',
            required: false,
        },
        {
            name: 'category',
            type: 'text',
            required: false,
        },
        {
            name: 'campus',
            type: 'text',
            required: false,
        },
    ],
};
