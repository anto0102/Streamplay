'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    getTVDetails,
    getSimilarTV,
    getTVCredits,
    getTVSeason,
    getTrendingTV,
    getTopRatedTV,
    getPopularTV,
    IMAGE_BASE_URL,
    BACKDROP_W1280,
    POSTER_BASE_URL,
    Movie,
    TVDetails,
} from '@/lib/tmdb';
import { Play, Plus, Check, ArrowLeft, Star, Calendar, Tv, ChevronDown } from 'lucide-react';
import MovieRow from '@/components/MovieRow';
import MovieCard from '@/components/MovieCard';
import Navbar from '@/components/Navbar';

import VideoPlayer from '@/components/VideoPlayer';
import { useLanguage } from '@/components/LanguageContext';
import { useFavorites } from '@/components/FavoritesContext';
import { cn } from '@/lib/utils';
import InfiniteScroll from '@/components/InfiniteScroll';
import { DetailSkeleton, CardSkeleton } from '@/components/Skeleton';


export default function TVClient({ id, category }: { id: string; category?: string }) {
    const tvId = parseInt(id, 10);
    const { language } = useLanguage();

    const [show, setShow] = useState<TVDetails | null>(null);
    const [similarShows, setSimilarShows] = useState<Movie[]>([]);
    const [categoryShows, setCategoryShows] = useState<Movie[]>([]);
    const [credits, setCredits] = useState<any>(null);

    const [showPlayer, setShowPlayer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [isFetchingEpisodes, setIsFetchingEpisodes] = useState(false);

    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const inList = isFavorite(tvId);

    const handleListToggle = () => {
        if (!show) return;
        if (inList) removeFavorite(tvId);
        else addFavorite({
            id: tvId,
            name: show.name,
            backdrop_path: show.backdrop_path,
            poster_path: show.poster_path,
            vote_average: show.vote_average,
            first_air_date: show.first_air_date,
            media_type: 'tv'
        } as any);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setPage(1);
            setHasMore(true);
            try {
                if (!isNaN(tvId)) {
                    const [showData, similarData, creditsData] = await Promise.all([
                        getTVDetails(tvId, language),
                        getSimilarTV(tvId, language),
                        getTVCredits(tvId, language),
                    ]);
                    setShow(showData);
                    setSimilarShows(similarData);
                    setCredits(creditsData);
                } else {
                    let data: Movie[] = [];
                    if (category === 'top_rated') {
                        data = await getTopRatedTV(language, 1);
                    } else if (category === 'popular') {
                        data = await getPopularTV(language, 1);
                    } else {
                        data = await getTrendingTV(language, 1);
                    }
                    setCategoryShows(data);
                    if (data.length === 0) setHasMore(false);
                }
            } catch (error) {
                console.error("Failed to fetch TV details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [tvId, language, category]);

    const loadMore = async () => {
        if (isFetchingMore || !hasMore || !isNaN(tvId)) return;
        setIsFetchingMore(true);
        try {
            const nextPage = page + 1;
            let moreShows: Movie[] = [];
            if (category === 'top_rated') {
                moreShows = await getTopRatedTV(language, nextPage);
            } else if (category === 'popular') {
                moreShows = await getPopularTV(language, nextPage);
            } else {
                moreShows = await getTrendingTV(language, nextPage);
            }

            if (moreShows.length === 0) {
                setHasMore(false);
            } else {
                setCategoryShows((prev) => {
                    const existingIds = new Set(prev.map(s => s.id));
                    const uniqueNewShows = moreShows.filter(s => !existingIds.has(s.id));
                    return [...prev, ...uniqueNewShows];
                });
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Failed to load more TV shows:", error);
        } finally {
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        const fetchEpisodes = async () => {
            if (!show) return;
            setIsFetchingEpisodes(true);
            try {
                const seasonData = await getTVSeason(tvId, selectedSeason, language);
                setEpisodes(seasonData.episodes || []);
            } catch (error) {
                console.error("Failed to fetch episodes:", error);
            } finally {
                setIsFetchingEpisodes(false);
            }
        };

        fetchEpisodes();
    }, [selectedSeason, show, language, tvId]);

    if (isLoading && !isNaN(tvId)) return <><Navbar /><DetailSkeleton /></>;
    if (isLoading) return <main className="relative min-h-screen bg-black pb-24"><Navbar /><div className="pt-32 px-4 lg:px-12"><CardSkeleton count={12} /></div></main>;
    if (!show && !isNaN(tvId)) return <><Navbar /><DetailSkeleton /></>;

    if (isNaN(tvId)) {
        return (
            <main className="relative min-h-screen bg-black pb-24">
                <Navbar />
                <div className="pt-32 px-4 lg:px-12">
                    <h1 className="text-3xl font-black text-white md:text-4xl flex items-center gap-3 mb-12">
                        <span className="h-10 w-1.5 bg-primary rounded-full" />
                        {language === 'it-IT' ? 'Serie TV' : 'TV Shows'}
                    </h1>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {categoryShows.map((m) => (
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

    const creator = show?.created_by?.[0];
    const topCast = credits?.cast?.slice(0, 6) || [];

    return (
        <main className="min-h-screen bg-black">
            {showPlayer && (
                <VideoPlayer
                    src={`https://vixsrc.to/tv/${tvId}/${selectedSeason}/${selectedEpisode}${language === 'it-IT' ? '?lang=it' : ''}`}
                    title={show?.name || ''}
                    onClose={() => setShowPlayer(false)}
                />
            )}

            {/* Hero Backdrop */}
            <div className="relative h-[70vh] w-full">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={`${BACKDROP_W1280}${show?.backdrop_path}`}
                        alt={show?.name || ''}
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

                {/* TV Show Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16 z-10">
                    <div className="max-w-3xl space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-primary/20 px-2 py-1 text-xs font-bold text-primary flex items-center gap-1">
                                <Tv className="h-3 w-3" />
                                {language === 'it-IT' ? 'Serie TV' : 'TV Series'}
                            </span>
                        </div>

                        {show?.tagline && (
                            <p className="text-sm font-medium text-primary uppercase tracking-wider">
                                {show?.tagline}
                            </p>
                        )}
                        <h1 className="text-4xl font-black text-white md:text-6xl">
                            {show?.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-bold text-white">{show?.vote_average?.toFixed(1) || '0.0'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{show?.first_air_date?.split('-')[0]}</span>
                            </div>
                            <span className="text-white/60">
                                {show?.number_of_seasons} {language === 'it-IT' ? 'Stagioni' : 'Seasons'} • {show?.number_of_episodes} {language === 'it-IT' ? 'Episodi' : 'Episodes'}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {show?.genres?.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="rounded-full bg-white/10 px-4 py-1 text-xs font-medium text-white"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-300 leading-relaxed max-w-2xl line-clamp-3">
                            {show?.overview}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            {/* Season Selector */}
                            <div className="relative group">
                                <select
                                    value={selectedSeason}
                                    onChange={(e) => {
                                        setSelectedSeason(parseInt(e.target.value));
                                        setSelectedEpisode(1);
                                    }}
                                    className="appearance-none bg-white/10 text-white text-sm font-bold py-3 pl-6 pr-10 rounded-full backdrop-blur-md border border-white/10 outline-none cursor-pointer hover:bg-white/20 transition-colors"
                                >
                                    {[...Array(show?.number_of_seasons || 0)].map((_, i) => (
                                        <option key={i + 1} value={i + 1} className="bg-zinc-900">
                                            {language === 'it-IT' ? `Stagione ${i + 1}` : `Season ${i + 1}`}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Episode Selector */}
                            <div className="relative group">
                                <select
                                    value={selectedEpisode}
                                    onChange={(e) => setSelectedEpisode(parseInt(e.target.value))}
                                    disabled={isFetchingEpisodes}
                                    className="appearance-none bg-white/10 text-white text-sm font-bold py-3 pl-6 pr-10 rounded-full backdrop-blur-md border border-white/10 outline-none cursor-pointer hover:bg-white/20 transition-colors disabled:opacity-50"
                                >
                                    {isFetchingEpisodes ? (
                                        <option>Loading...</option>
                                    ) : (
                                        episodes.map((ep) => (
                                            <option key={ep.episode_number} value={ep.episode_number} className="bg-zinc-900">
                                                {language === 'it-IT' ? `Episodio ${ep.episode_number}` : `Episode ${ep.episode_number}`}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>

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
                    {language === 'it-IT' ? 'Cast e Creatori' : 'Cast & Crew'}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                    {creator && (
                        <div className="text-center">
                            <div className="mx-auto h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold text-primary">
                                {creator.name?.charAt(0)}
                            </div>
                            <p className="mt-2 text-sm font-medium text-white">{creator.name}</p>
                            <p className="text-xs text-gray-500">Creator</p>
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

            {/* Similar Shows */}
            {
                similarShows.length > 0 && (
                    <section className="pb-16">
                        <MovieRow
                            title={language === 'it-IT' ? 'Serie TV Simili' : 'Similar TV Shows'}
                            movies={similarShows}
                        />
                    </section>
                )
            }
        </main >
    );
}
