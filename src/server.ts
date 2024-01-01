import dotenv from 'dotenv';
// import helmet from 'helmet';
import next from 'next';
import nextBuild from 'next/dist/build';
import open from 'open';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
});

import express from 'express';
import payload from 'payload';

import { seed } from './payload/seed';

const app = express();
const PORT = process.env.PORT || 3000;

const start = async (): Promise<void> => {
    // Initialize payload
    await payload.init({
        secret: process.env.PAYLOAD_SECRET || '',
        express: app,
        onInit: () => {
            payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
        },
    });

    // Custom Express Routes
    // CSP policy via helmet
    // app.use(function (req, res, next) {
    //   let middleware
    //   // If we've mounted Payload CMS on /admin - change the CSP to suit.
    //   if (req.path.startsWith('/admin')) {
    //     middleware = helmet({
    //       contentSecurityPolicy: {
    //         directives: {
    //           'script-src': [
    //               "'self'"
    //             ],
    //             'img-src': ["'self'", 'data:', 'https://raw.githubusercontent.com'],
    //             'media-src': ["'self'", 'data:', 'https://raw.githubusercontent.com'],
    //             'default-src': ["'self'"]
    //         },
    //       },
    //     })
    //   } else {
    //     middleware = helmet({
    //       crossOriginEmbedderPolicy: false,
    //       contentSecurityPolicy: {
    //         // NOTE: Remove reportOnly when you're ready to enforce this CSP
    //         // reportOnly: true,
    //         directives: {
    //           'connect-src': [
    //             process.env.NEXT_BUILD === 'development' ? 'ws:' : null,
    //             "'self'",
    //           ].filter(Boolean),
    //           'script-src': [
    //             "'strict-dynamic'",
    //             "'self'", // Ignored by CSP 3 compliant browsers when strict-dynamic - here for backwards compat.
    //             "'unsafe-inline'", // Ignored by CSP 3 compliant browsers when strict-dynamic - here for backwards compat.
    //             'https:', // Ignored by CSP 3 compliant browsers when strict-dynamic - here for backwards compat.
    //             'http:', // Ignored by CSP 3 compliant browsers when strict-dynamic - here for backwards compat.
    //             (_, res) => `'nonce-${res.locals.cspNonce}'`
    //           ],
    //           'script-src-attr': [
    //             (_, res) => `'nonce-${res.locals.cspNonce}'`
    //           ],
    //           'font-src': ["'self'"],
    //           'frame-src': ["'self'"],
    //           'img-src': ["'self'", 'data:', 'https://raw.githubusercontent.com'],
    //           'media-src': ["'self'", 'data:', 'https://raw.githubusercontent.com'],
    //           'default-src': ["'self'"],
    //           'upgrade-insecure-requests': null
    //         }
    //       }
    //     })
    //   }

    //   middleware(req, res, next)
    // })

    // Seed data from payload/seed
    if (process.env.PAYLOAD_SEED === 'true') {
        await seed(payload);
        process.exit();
    }

    // if NEXT_BUILD variable is set, start Express for the api -> then build Next
    // if not set at the end we build next and start express by default
    if (process.env.NEXT_BUILD) {
        app.listen(PORT, async () => {
            payload.logger.info(`Next.js is now building...`);
            // @ts-expect-error
            await nextBuild(path.join(__dirname, '../'));
            process.exit();
        });

        return;
    }

    // Build production Next if env set
    const nextApp = next({
        dev: process.env.NODE_ENV !== 'production',
    });

    // Pass express handlers to NextJS
    const nextHandler = nextApp.getRequestHandler();
    app.use((req, res) => nextHandler(req, res));

    // Build Next -> then start Express
    // Open URL
    nextApp.prepare().then(() => {
        payload.logger.info('Starting Next.js...');

        app.listen(PORT, async () => {
            payload.logger.info(`Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`);
            open(process.env.PAYLOAD_PUBLIC_SERVER_URL);
        });
    });
};

start();
