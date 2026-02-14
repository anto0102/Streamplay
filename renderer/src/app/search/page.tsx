'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchMulti, Movie } from '@/lib/tmdb';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { useLanguage } from '@/components/LanguageContext';
import InfiniteScroll from '@/components/InfiniteScroll';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { language } = useLanguage();
    const [results, setResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setPage(1);
            setHasMore(true);
            try {
                const data = await searchMulti(query, language, 1);
                setResults(data);
                if (data.length === 0) setHasMore(false);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query, language]);

    const loadMore = async () => {
        if (isFetchingMore || !hasMore || !query) return;
        setIsFetchingMore(true);
        try {
            const nextPage = page + 1;
            const moreResults = await searchMulti(query, language, nextPage);
            if (moreResults.length === 0) {
                setHasMore(false);
            } else {
                setResults((prev) => {
                    const existingIds = new Set(prev.map(r => r.id));
                    const uniqueNewResults = moreResults.filter(r => !existingIds.has(r.id));
                    return [...prev, ...uniqueNewResults];
                });
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Failed to load more search results:", error);
        } finally {
            setIsFetchingMore(false);
        }
    };

    return (
        <main className="min-h-screen bg-black pb-20 pt-24 lg:pt-32">
            <Navbar />
            <div className="px-4 lg:px-12">
                <h1 className="mb-8 text-2xl font-black text-white md:text-4xl">
                    {language === 'it-IT'
                        ? `Risultati per: "${query}"`
                        : `Results for: "${query}"`}
                </h1>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {results.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                        <InfiniteScroll
                            onLoadMore={loadMore}
                            hasMore={hasMore}
                            isLoading={isFetchingMore}
                        />
                    </>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center text-gray-500">
                        <p className="text-xl">
                            {language === 'it-IT'
                                ? 'Nessun risultato trovato.'
                                : 'No results found.'}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <SearchResults />
        </Suspense>
    );
}
