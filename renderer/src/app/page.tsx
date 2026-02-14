'use client';

import { useState, useEffect } from 'react';
import {
  getTrendingMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  getTrendingTV,
  getTopRatedTV,
  getTrendingAll,
  Movie
} from '@/lib/tmdb';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import MovieRow from '@/components/MovieRow';
import { useLanguage } from '@/components/LanguageContext';
import { HomePageSkeleton } from '@/components/Skeleton';

export default function Home() {
  const { language } = useLanguage();
  const [data, setData] = useState<{
    trendingAll: Movie[];
    trendingMovies: Movie[];
    topRatedMovies: Movie[];
    actionMovies: Movie[];
    trendingTV: Movie[];
    topRatedTV: Movie[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [
        trendingAll,
        trendingMovies,
        topRatedMovies,
        actionMovies,
        trendingTV,
        topRatedTV
      ] = await Promise.all([
        getTrendingAll(language),
        getTrendingMovies(language),
        getTopRatedMovies(language),
        getMoviesByGenre(28, language), // Action
        getTrendingTV(language),
        getTopRatedTV(language),
      ]);

      setData({
        trendingAll,
        trendingMovies,
        topRatedMovies,
        actionMovies,
        trendingTV,
        topRatedTV
      });
    };

    fetchData();
  }, [language]);

  if (!data) return <><Navbar /><HomePageSkeleton /></>;

  const heroContent = data.trendingAll.slice(0, 5);

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <HeroCarousel movies={heroContent} />

      <div className="relative z-10 -mt-12 space-y-16 pb-24 lg:-mt-16">
        {/* MOVIES SECTION */}
        <section className="space-y-8">
          <div className="px-4 lg:px-12">
            <h2 className="text-2xl font-black text-white md:text-3xl flex items-center gap-3">
              <span className="h-8 w-1 bg-primary rounded-full" />
              {language === 'it-IT' ? 'Film' : 'Movies'}
            </h2>
          </div>
          <MovieRow title={language === 'it-IT' ? 'Film di Tendenza' : 'Trending Movies'} movies={data.trendingMovies} exploreLink="/movie" />
          <MovieRow title={language === 'it-IT' ? 'I Più Votati' : 'Top Rated'} movies={data.topRatedMovies} exploreLink="/movie?category=top_rated" />
          <MovieRow title={language === 'it-IT' ? 'Azione' : 'Action'} movies={data.actionMovies} exploreLink="/movie?genre=28" />
        </section>

        {/* TV SHOWS SECTION */}
        <section className="space-y-8">
          <div className="px-4 lg:px-12">
            <h2 className="text-2xl font-black text-white md:text-3xl flex items-center gap-3">
              <span className="h-8 w-1 bg-blue-500 rounded-full" />
              {language === 'it-IT' ? 'Serie TV' : 'TV Shows'}
            </h2>
          </div>
          <MovieRow title={language === 'it-IT' ? 'Serie di Tendenza' : 'Trending Series'} movies={data.trendingTV} exploreLink="/tv" />
          <MovieRow title={language === 'it-IT' ? 'Serie Più Votate' : 'Top Rated Series'} movies={data.topRatedTV} exploreLink="/tv?category=top_rated" />
        </section>
      </div>

      <footer className="border-t border-white/5 bg-black px-4 py-12 lg:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-primary">STREAMPLAY</h3>
            <p className="text-sm text-gray-500">
              {language === 'it-IT'
                ? 'L\'esperienza di streaming definitiva per gli amanti del cinema.'
                : 'The ultimate streaming experience for cinema lovers.'}
            </p>
          </div>
          {[
            {
              title: language === 'it-IT' ? 'Piattaforma' : 'Platform',
              links: language === 'it-IT' ? ['Film', 'Serie TV', 'Tendenza'] : ['Movies', 'TV Shows', 'Trending']
            },
            {
              title: language === 'it-IT' ? 'Azienda' : 'Company',
              links: language === 'it-IT' ? ['Chi Siamo', 'Carriere', 'Contatti'] : ['About Us', 'Careers', 'Contact']
            },
            {
              title: language === 'it-IT' ? 'Legale' : 'Legal',
              links: language === 'it-IT' ? ['Privacy Policy', 'Termini d\'Uso', 'Policy Cookie'] : ['Privacy Policy', 'Terms of Use', 'Cookie Policy']
            },
          ].map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-bold text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link} className="cursor-pointer text-sm text-gray-500 transition hover:text-white">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Streamplay. {language === 'it-IT' ? 'Tutti i diritti riservati.' : 'All rights reserved.'} Built with Next.js & TMDB.
        </div>
      </footer>
    </main>
  );
}
