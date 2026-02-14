'use client';

import { useState, useEffect } from 'react';
import { getTrendingAll, Movie } from '@/lib/tmdb';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { useLanguage } from '@/components/LanguageContext';
import InfiniteScroll from '@/components/InfiniteScroll';

export default function PopularPage() {
    const { language } = useLanguage();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setPage(1);
            setHasMore(true);
            const data = await getTrendingAll(language, 1);
            setMovies(data);
            if (data.length === 0) setHasMore(false);
            setLoading(false);
        };
        fetchMovies();
    }, [language]);

    const loadMore = async () => {
        if (isFetchingMore || !hasMore) return;
        setIsFetchingMore(true);
        try {
            const nextPage = page + 1;
            const moreMovies = await getTrendingAll(language, nextPage);
            if (moreMovies.length === 0) {
                setHasMore(false);
            } else {
                setMovies((prev) => {
                    const existingIds = new Set(prev.map(m => m.id));
                    const uniqueNewMovies = moreMovies.filter(m => !existingIds.has(m.id));
                    return [...prev, ...uniqueNewMovies];
                });
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Failed to load more popular content:", error);
        } finally {
            setIsFetchingMore(false);
        }
    };

    return (
        <main className="relative min-h-screen bg-black pb-24">
            <Navbar />

            <div className="pt-32 px-4 lg:px-12">
                <h1 className="text-3xl font-black text-white md:text-4xl flex items-center gap-3 mb-12">
                    <span className="h-10 w-1.5 bg-primary rounded-full" />
                    {language === 'it-IT' ? 'Nuovi e Popolari' : 'New & Popular'}
                </h1>

                {loading ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-72 w-full animate-pulse rounded-3xl bg-white/5 md:h-80" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                        <InfiniteScroll
                            onLoadMore={loadMore}
                            hasMore={hasMore}
                            isLoading={isFetchingMore}
                        />
                    </>
                )}
            </div>
        </main>
    );
}
