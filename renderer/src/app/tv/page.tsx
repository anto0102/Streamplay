'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TVClient from './TVClient';

function TVPageContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || '';
    const category = searchParams.get('category') || '';

    return <TVClient id={id} category={category} />;
}

export default function TVPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <TVPageContent />
        </Suspense>
    );
}
