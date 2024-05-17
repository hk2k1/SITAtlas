import React from 'react';
import { Metadata } from 'next';

import { AdminBar } from './_components/AdminBar';
import { Footer } from './_components/Footer';
import { Header } from './_components/Header';
import { Providers } from './_providers';
import { InitTheme } from './_providers/Theme/InitTheme';
import { mergeOpenGraph } from './_utilities/mergeOpenGraph';

import './_css/app.scss';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <InitTheme />
                <meta
                    name="viewport"
                    content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
                ></meta>
                <link rel="icon" href="/favicon.ico" sizes="32x32" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                {/* <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        /> */}
                {/* Mapbox */}
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css"
                    rel="stylesheet"
                />
            </head>
            <body>
                <Providers>
                    <AdminBar />
                    {/* @ts-expect-error */}
                    <Header />
                    {children}
                    {/* @ts-expect-error */}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
    twitter: {
        card: 'summary_large_image',
        creator: '@payloadcms',
    },
    openGraph: mergeOpenGraph(),
};
