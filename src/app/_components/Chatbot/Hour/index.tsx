'use client';
import { useEffect } from 'react';
import type {} from 'ldrs';
export default function Loader() {
    useEffect(() => {
        async function getLoader() {
            const { hourglass } = await import('ldrs');
            hourglass.register();
        }
        getLoader();
    }, []);
    return <l-hourglass size="20" bg-opacity="0.1" speed="1.75" color="white"></l-hourglass>;
}
