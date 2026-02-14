'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    getMovieDetails,
    getSimilarMovies,
    getMovieCredits,
    getTrendingMovies,
    getTopRatedMovies,
    getMoviesByGenre,
    IMAGE_BASE_URL,
    BACKDROP_W1280,
    POSTER_BASE_URL,
    Movie,
    MovieDetails,
} from '@/lib/tmdb';
import { Play, Plus, Check, ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import MovieRow from '@/components/MovieRow';
import MovieCard from '@/components/MovieCard';
import Navbar from '@/components/Navbar';

import VideoPlayer from '@/components/VideoPlayer';
import { useLanguage } from '@/components/LanguageContext';
import { useFavorites } from '@/components/FavoritesContext';
import { cn } from '@/lib/utils';
import InfiniteScroll from '@/components/InfiniteScroll';
import { DetailSkeleton, CardSkeleton } from '@/components/Skeleton';


export default function MovieClient({ id, genre, category }: { id: string; genre?: string; category?: string }) {
    const movieId = parseInt(id, 10);
    const { language } = useLanguage();

    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [categoryMovies, setCategoryMovies] = useState<Movie[]>([]);
    const [credits, setCredits] = useState<any>(null);

    const [showPlayer, setShowPlayer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const inList = isFavorite(movieId);

    const handleListToggle = () => {
        if (!movie) return;
        if (inList) removeFavorite(movieId);
        else addFavorite({
            id: movieId,
            title: movie.title,
            backdrop_path: movie.backdrop_path,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            media_type: 'movie'
        } as any);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setPage(1);
            setHasMore(true);
            try {
                if (!isNaN(movieId)) {
                    const [movieData, similarData, creditsData] = await Promise.all([
                        getMovieDetails(movieId, language),
                        getSimilarMovies(movieId, language),
                        getMovieCredits(movieId, language),
                    ]);
                    setMovie(movieData);
                    setSimilarMovies(similarData);
                    setCredits(creditsData);
                } else {
                    let data: Movie[] = [];
                    if (genre) {
                        data = await getMoviesByGenre(parseInt(genre, 10), language, 1);
                    } else if (category === 'top_rated') {
                        data = await getTopRatedMovies(language, 1);
                    } else {
                        data = await getTrendingMovies(language, 1);
                    }
                    setCategoryMovies(data);
                    if (data.length === 0) setHasMore(false);
                }
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [movieId, language, genre, category]);

    const loadMore = async () => {
        if (isFetchingMore || !hasMore || !isNaN(movieId)) return;
        setIsFetchingMore(true);
        try {
            const nextPage = page + 1;
            let moreMovies: Movie[] = [];
            if (genre) {
                moreMovies = await getMoviesByGenre(parseInt(genre, 10), language, nextPage);
            } else if (category === 'top_rated') {
                moreMovies = await getTopRatedMovies(language, nextPage);
            } else {
                moreMovies = await getTrendingMovies(language, nextPage);
            }

            if (moreMovies.length === 0) {
                setHasMore(false);
            } else {
                setCategoryMovies((prev) => {
                    const existingIds = new Set(prev.map(m => m.id));
                    const uniqueNewMovies = moreMovies.filter(m => !existingIds.has(m.id));
                    return [...prev, ...uniqueNewMovies];
                });
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Failed to load more movies:", error);
        } finally {
            setIsFetchingMore(false);
        }
    };

    if (isLoading && !isNaN(movieId)) return <><Navbar /><DetailSkeleton /></>;
    if (isLoading) return <main className="relative min-h-screen bg-black pb-24"><Navbar /><div className="pt-32 px-4 lg:px-12"><CardSkeleton count={12} /></div></main>;
    if (!movie && !isNaN(movieId)) return <><Navbar /><DetailSkeleton /></>;

    if (isNaN(movieId)) {
        return (
            <main className="relative min-h-screen bg-black pb-24">
                <Navbar />
                <div className="pt-32 px-4 lg:px-12">
                    <h1 className="text-3xl font-black text-white md:text-4xl flex items-center gap-3 mb-12">
                        <span className="h-10 w-1.5 bg-primary rounded-full" />
                        {language === 'it-IT' ? 'Film' : 'Movies'}
                    </h1>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {categoryMovies.map((m) => (
                            <MovieCard key={m.id} movie={m} />
                        ))}
                    </div>

                    <InfiniteScroll
                        onLoadMore={loadMore}
                        hasMore={hasMore}
                        isLoading={isFetchingMore}
                    />
                </div>
            </main>
        );
    }

    const director = credits?.crew?.find((person: any) => person.job === 'Director');
    const topCast = credits?.cast?.slice(0, 6) || [];

    return (
        <main className="min-h-screen bg-black">
            {showPlayer && (
                <VideoPlayer
                    src={`https://vixsrc.to/movie/${movieId}${language === 'it-IT' ? '?lang=it' : ''}`}
                    title={movie?.title || ''}
                    onClose={() => setShowPlayer(false)}
                />
            )}

            {/* Hero Backdrop */}
            <div className="relative h-[70vh] w-full">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={`${BACKDROP_W1280}${movie?.backdrop_path}`}
                        alt={movie?.title || ''}
                        className="h-full w-full object-cover"
                        fetchPriority="high"
                        decoding="sync"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
                </div>

                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {language === 'it-IT' ? 'Indietro' : 'Back'}
                </Link>

                {/* Movie Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16 z-10">
                    <div className="max-w-3xl space-y-4">
                        {movie?.tagline && (
                            <p className="text-sm font-medium text-primary uppercase tracking-wider">
                                {movie?.tagline}
                            </p>
                        )}
                        <h1 className="text-4xl font-black text-white md:text-6xl">
                            {movie?.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-bold text-white">{movie?.vote_average?.toFixed(1) || '0.0'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{movie?.release_date?.split('-')[0]}</span>
                            </div>
                            {movie && movie.runtime > 0 && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {movie?.genres?.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="rounded-full bg-white/10 px-4 py-1 text-xs font-medium text-white"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-300 leading-relaxed max-w-2xl">
                            {movie?.overview}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-4">
                            <button
                                onClick={() => setShowPlayer(true)}
                                className="flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition hover:bg-white/90"
                            >
                                <Play className="h-5 w-5 fill-current" />
                                {language === 'it-IT' ? 'Guarda Ora' : 'Watch Now'}
                            </button>
                            <button
                                onClick={handleListToggle}
                                className={cn(
                                    "flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold backdrop-blur-md transition",
                                    inList ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {inList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                {inList
                                    ? (language === 'it-IT' ? 'Nella Mia Lista' : 'In My List')
                                    : (language === 'it-IT' ? 'Aggiungi alla Lista' : 'Add to List')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cast & Crew */}
            <section className="px-8 py-12 lg:px-16">
                <h2 className="mb-6 text-2xl font-bold text-white">
                    {language === 'it-IT' ? 'Cast e Regia' : 'Cast & Crew'}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                    {director && (
                        <div className="text-center">
                            <div className="mx-auto h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold text-primary">
                                {director.name?.charAt(0)}
                            </div>
                            <p className="mt-2 text-sm font-medium text-white">{director.name}</p>
                            <p className="text-xs text-gray-500">Director</p>
                        </div>
                    )}
                    {topCast.map((actor: any) => (
                        <div key={actor.id} className="text-center">
                            {actor.profile_path ? (
                                <img
                                    src={`${POSTER_BASE_URL}${actor.profile_path}`}
                                    alt={actor.name}
                                    className="mx-auto h-20 w-20 rounded-full object-cover"
                                />
                            ) : (
                                <div className="mx-auto h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold text-gray-500">
                                    {actor.name?.charAt(0)}
                                </div>
                            )}
                            <p className="mt-2 text-sm font-medium text-white line-clamp-1">{actor.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{actor.character}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Similar Movies */}
            {
                similarMovies.length > 0 && (
                    <section className="pb-16">
                        <MovieRow
                            title={language === 'it-IT' ? 'Film Simili' : 'Similar Movies'}
                            movies={similarMovies}
                        />
                    </section>
                )
            }
        </main >
    );
}
