'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieClient from './MovieClient';

function MoviePageContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || '';
    const genre = searchParams.get('genre') || '';
    const category = searchParams.get('category') || '';

    return <MovieClient id={id} genre={genre} category={category} />;
}

export default function MoviePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <MoviePageContent />
        </Suspense>
    );
}
