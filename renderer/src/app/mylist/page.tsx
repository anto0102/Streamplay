'use client';

import { useFavorites } from '@/components/FavoritesContext';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { useLanguage } from '@/components/LanguageContext';

export default function MyListPage() {
    const { favorites } = useFavorites();
    const { language } = useLanguage();

    return (
        <main className="relative min-h-screen bg-black pb-24">
            <Navbar />

            <div className="pt-32 px-4 lg:px-12">
                <h1 className="text-3xl font-black text-white md:text-4xl flex items-center gap-3 mb-12">
                    <span className="h-10 w-1.5 bg-primary rounded-full" />
                    {language === 'it-IT' ? 'La Mia Lista' : 'My List'}
                </h1>

                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                        <p className="text-xl">
                            {language === 'it-IT'
                                ? 'La tua lista è ancora vuota.'
                                : 'Your list is still empty.'}
                        </p>
                        <p className="mt-2">
                            {language === 'it-IT'
                                ? 'Aggiungi film o serie per trovarli qui.'
                                : 'Add movies or series to see them here.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {favorites.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
