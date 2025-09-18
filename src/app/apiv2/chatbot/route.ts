// pages/api/chat.ts

// import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { executeGraphQLQuery } from '../../_utilities/executeChatQuery';

// import { executeGraphQLQuery } from '../../_utilities/executeChatQuery';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// interface ResponseData {
//     message: string;
//     // threadId?: string;
// }

function processGeneratedQuery(rawQuery: string): string {
    // Remove any backticks, newline characters, and escape characters
    let cleanedQuery = rawQuery.replace(/`|\\n|\\"/g, '');

    // Remove any leading/trailing whitespace
    cleanedQuery = cleanedQuery.trim();

    // If the query is wrapped in quotes, remove them
    if (cleanedQuery.startsWith('"') && cleanedQuery.endsWith('"')) {
        cleanedQuery = cleanedQuery.slice(1, -1);
    }

    // Parse the query to extract only the necessary parts
    const parsedQuery = cleanedQuery.match(/query\s+\w+\s*{[\s\S]*}/);

    if (parsedQuery) {
        cleanedQuery = parsedQuery[0];

        // Remove any empty lines and excessive whitespace
        cleanedQuery = cleanedQuery
            .replace(/^\s*[\r\n]/gm, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*{\s*/g, ' { ')
            .replace(/\s*}\s*/g, ' } ');

        // Ensure proper formatting
        cleanedQuery = cleanedQuery.replace(/} }/g, '} }');
    } else {
        throw new Error('Failed to parse the generated query');
    }

    return cleanedQuery;
}

export async function POST(req: Request): Promise<NextResponse> {
    if (req.method !== 'POST') {
        return NextResponse.json(
            { error: 'Method not allowed' },
            { status: 405, statusText: 'Method not allowed' },
        );
    }
    try {
        // console.log('Request body:', req.body);
        const { message, threadId } = await req.json();
        // Step 1: Generate GraphQL query
        const queryCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an assistant that will only write GraphQL queries based on the example schema provided that will answer the user's question
                    query Features {
                    Features {
                        hasNextPage
                        hasPrevPage
                        limit
                        nextPage
                        offset
                        page
                        pagingCounter
                        prevPage
                        totalDocs
                        totalPages
                        docs {
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
                            type
                            room
                            category
                            campus
                            updatedAt
                            createdAt
                        } } }
                        An example query would look like:
                        query Features {
                            Features(where: { name: { contains: "Foogle" } }) {
                                hasNextPage
                                hasPrevPage
                                limit
                                nextPage
                                offset
                                page
                                pagingCounter
                                prevPage
                                totalDocs
                                totalPages
                                docs {
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
                                    type
                                    room
                                    category
                                    campus
                                    updatedAt
                                    createdAt
                                }
                            }
                        }
                    Return ONLY the GraphQL query, without any markdown formatting or explanation
                        `,
                },
                { role: 'user', content: `User message: ${message}` },
            ],
            model: 'gpt-4o',
        });

        const generatedQuery = queryCompletion.choices[0].message.content?.trim();
        // const processedQuery = String(
        //     generatedQuery.replace('graphql', ' ').replaceAll('```', ' ').replaceAll('\n', ' '),
        // );
        const processedQuery = processGeneratedQuery(
            generatedQuery.replace('graphql', ' ').replaceAll('`', ' '),
        );
        // console.log('Generated query:', processedQuery);
        // Step 2: Execute GraphQL query
        const queryResults = await executeGraphQLQuery(processedQuery);
        // console.log('Generated query:', queryResults);

        // Step 3: Create or retrieve thread
        let thread;
        if (!threadId) {
            thread = await openai.beta.threads.create();
        } else {
            thread = { id: threadId };
        }
        // Step 4: Add user message and context to the thread
        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: `User question: "${message}" - Search Results: ${JSON.stringify(
                queryResults,
            )}`,
        });

        // Step 5: Run the assistant
        const ASSISTANT_ID = process.env.ASSISTANT_API_KEY;
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: ASSISTANT_ID,
            instructions:
                'You are a university campus maps assistant. Answer questions about room locations and building information using only the provided search results as context.',
        });

        // Step 6: Wait for the run to complete
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        while (runStatus.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        // Step 7: Retrieve the assistant's messages
        const messages = await openai.beta.threads.messages.list(thread.id);
        // console.log('Messages:', messages.data);
        // Get the last assistant message
        const lastAssistantMessage = messages.data.filter(msg => msg.role === 'assistant')[0];
        // console.log('Last assistant message:', lastAssistantMessage);

        // Send the response
        return NextResponse.json({
            message: lastAssistantMessage?.content[0],
            // message: lastAssistantMessage?.content[0],
            threadId: thread.id,
        });
    } catch (error: unknown) {
        // console.error('Error processing chat request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500, statusText: 'Internal server error' },
        );
    }
}
