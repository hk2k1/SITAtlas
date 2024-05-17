export const COORDINATES_QUERY = `query CoordinatesQuery {
    Coordinates(limit: 1000) {
        features: docs {
            properties: FeatureID {
                id
                contact
                usage
                fillOpacity
                fill
                level
                opening_hours
                name
                colour
                block
                area
                accessibility
                strokeWidth
                indoor
                strokeOpacity
                amenities
                booking
                capacity
                room
                category
                campus
            }
            geometry
        }
    }
}
`;
