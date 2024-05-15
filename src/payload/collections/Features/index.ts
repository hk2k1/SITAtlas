import type { CollectionConfig } from 'payload/types';

export const Features: CollectionConfig = {
    slug: 'features',
    fields: [
        {
            name: 'contact',
            type: 'text',
            required: true,
        },
        {
            name: 'usage',
            type: 'text',
            required: true,
        },
        {
            name: 'fillOpacity',
            type: 'number',
            required: true,
        },
        {
            name: 'fill',
            type: 'text',
            required: true,
        },
        {
            name: 'level',
            type: 'text',
            required: true,
        },
        {
            name: 'opening_hours',
            type: 'text',
        },
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'colour',
            type: 'text',
            required: true,
        },
        {
            name: 'block',
            type: 'text',
            required: true,
        },
        {
            name: 'area',
            type: 'text',
            required: true,
        },
        {
            name: 'accessibility',
            type: 'text',
            required: true,
        },
        {
            name: 'strokeWidth',
            type: 'number',
            required: true,
        },
        {
            name: 'indoor',
            type: 'text',
            required: true,
        },
        {
            name: 'strokeOpacity',
            type: 'number',
            required: true,
        },
        {
            name: 'amenities',
            type: 'array',
            fields: [
                {
                    name: 'amenity',
                    type: 'text',
                },
            ],
        },
        {
            name: 'booking',
            type: 'text',
            required: true,
        },
        {
            name: 'capacity',
            type: 'number',
            required: true,
        },
        {
            name: 'type',
            type: 'text',
            required: true,
        },
        {
            name: 'room',
            type: 'text',
            required: true,
        },
        {
            name: 'id',
            type: 'text',
            required: true,
        },
        {
            name: 'category',
            type: 'text',
            required: true,
        },
        {
            name: 'campus',
            type: 'text',
            required: true,
        },
    ],
};
