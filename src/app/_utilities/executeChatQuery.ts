// lib/payloadCMS.ts

import { GRAPHQL_API_URL } from '../_api/shared';

export async function executeGraphQLQuery(query: string): Promise<any[]> {
    try {
        const response = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `${query}`,
            }),
        });
        const data = await response.json();
        // console.log('Data:', data);
        return data.data;
    } catch (error: unknown) {
        throw error;
    }
}
