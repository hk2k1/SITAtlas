'use client';
import { useEffect } from 'react';
import type {} from 'ldrs';
export default function Loader() {
    useEffect(() => {
        async function getLoader() {
            const { newtonsCradle } = await import('ldrs');
            newtonsCradle.register();
        }
        getLoader();
    }, []);
    return <l-newtons-cradle size="78" speed="1.4" color="black"></l-newtons-cradle>;
}
