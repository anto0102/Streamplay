'use client';

import Navbar from '@/components/Navbar';
import { useLanguage } from '@/components/LanguageContext';
import { m, LazyMotion, domAnimation, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/* ─── Inline SVG Icons (no generic Lucide) ─── */

const FilmReelIcon = () => (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12">
        <circle cx="32" cy="32" r="28" stroke="url(#grad1)" strokeWidth="3" />
        <circle cx="32" cy="32" r="10" stroke="url(#grad1)" strokeWidth="2.5" />
        <circle cx="32" cy="12" r="4" fill="#e50914" />
        <circle cx="32" cy="52" r="4" fill="#e50914" />
        <circle cx="12" cy="32" r="4" fill="#e50914" />
        <circle cx="52" cy="32" r="4" fill="#e50914" />
        <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="64" y2="64">
                <stop stopColor="#e50914" />
                <stop offset="1" stopColor="#ff6b6b" />
            </linearGradient>
        </defs>
    </svg>
);

const TVIcon = () => (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12">
        <rect x="6" y="12" width="52" height="36" rx="4" stroke="url(#grad2)" strokeWidth="3" />
        <line x1="20" y1="54" x2="44" y2="54" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="48" x2="32" y2="54" stroke="url(#grad2)" strokeWidth="3" />
        <polygon points="26,24 26,38 40,31" fill="#3b82f6" opacity="0.8" />
        <defs>
            <linearGradient id="grad2" x1="0" y1="0" x2="64" y2="64">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#818cf8" />
            </linearGradient>
        </defs>
    </svg>
);

const TelegramIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

const HeartCodeIcon = () => (
    <svg viewBox="0 0 64 64" fill="none" className="h-10 w-10">
        <path
            d="M32 56S6 40 6 22a14 14 0 0 1 26-7 14 14 0 0 1 26 7c0 18-26 34-26 34z"
            stroke="#e50914"
            strokeWidth="3"
            fill="none"
        />
        <text x="20" y="34" fontFamily="monospace" fontSize="14" fill="#e50914" fontWeight="bold">&lt;/&gt;</text>
    </svg>
);

export default function AboutPage() {
    const { language } = useLanguage();
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] as any },
        }),
    };

    return (
        <LazyMotion features={domAnimation}>
            <main className="min-h-screen bg-black text-white overflow-x-hidden">
                <Navbar />

                {/* ═══════════ HERO ═══════════ */}
                <m.section
                    ref={heroRef}
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 text-center"
                >
                    {/* Glow */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="h-[500px] w-[500px] rounded-full bg-primary/10 blur-[160px]" />
                    </div>

                    <m.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-primary"
                    >
                        {language === 'it-IT' ? 'Progetto Open Source' : 'Open Source Project'}
                    </m.p>

                    <m.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
                        className="text-5xl font-black leading-[1.1] tracking-tight md:text-8xl"
                    >
                        {language === 'it-IT' ? (
                            <>Il Cinema.<br /><span className="text-primary">Senza limiti.</span></>
                        ) : (
                            <>Cinema.<br /><span className="text-primary">Without limits.</span></>
                        )}
                    </m.h1>

                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 max-w-xl text-lg text-gray-500"
                    >
                        {language === 'it-IT'
                            ? 'Un\'app desktop che riunisce l\'intero catalogo cinematografico mondiale in un\'interfaccia che amiamo usare ogni giorno.'
                            : 'A desktop app that brings the entire world\'s cinematic catalog together in an interface we love using every day.'}
                    </m.p>

                    {/* scroll indicator */}
                    <m.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute bottom-10 flex flex-col items-center gap-2 text-gray-600"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <div className="h-8 w-[1px] bg-gradient-to-b from-gray-600 to-transparent" />
                    </m.div>
                </m.section>

                {/* ═══════════ STATS ═══════════ */}
                <section className="relative mx-auto max-w-5xl px-4 py-32 lg:px-0">
                    <m.div
                        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid gap-6 md:grid-cols-2"
                    >
                        {/* Film Card */}
                        <m.div
                            custom={0}
                            variants={fadeUp}
                            className="group relative rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-10 backdrop-blur-sm transition-colors hover:border-primary/20"
                        >
                            <FilmReelIcon />
                            <p className="mt-8 text-6xl font-black tracking-tight md:text-7xl">
                                40<span className="text-primary">K</span>+
                            </p>
                            <p className="mt-2 text-sm font-medium uppercase tracking-widest text-gray-500">
                                {language === 'it-IT' ? 'Film disponibili' : 'Movies available'}
                            </p>
                            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />
                        </m.div>

                        {/* TV Card */}
                        <m.div
                            custom={1}
                            variants={fadeUp}
                            className="group relative rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-10 backdrop-blur-sm transition-colors hover:border-blue-500/20"
                        >
                            <TVIcon />
                            <p className="mt-8 text-6xl font-black tracking-tight md:text-7xl">
                                14<span className="text-blue-500">K</span>+
                            </p>
                            <p className="mt-2 text-sm font-medium uppercase tracking-widest text-gray-500">
                                {language === 'it-IT' ? 'Serie TV' : 'TV Series'}
                            </p>
                            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />
                        </m.div>
                    </m.div>
                </section>

                {/* ═══════════ DEVELOPER ═══════════ */}
                <section className="relative mx-auto max-w-5xl px-4 py-20 lg:px-0">
                    <m.div
                        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-16"
                    >
                        <m.div custom={0} variants={fadeUp} className="flex items-center gap-4">
                            <HeartCodeIcon />
                            <h2 className="text-3xl font-black md:text-5xl tracking-tight">
                                {language === 'it-IT' ? 'Fatto a mano' : 'Hand‑crafted'}
                            </h2>
                        </m.div>

                        <m.div custom={1} variants={fadeUp} className="grid gap-12 lg:grid-cols-5">
                            <div className="space-y-6 text-lg leading-relaxed text-gray-400 lg:col-span-3">
                                <p>
                                    {language === 'it-IT'
                                        ? 'Streamplay non è il prodotto di un\'azienda. È il progetto personale di un singolo sviluppatore che crede che il cinema debba essere accessibile a tutti, con un\'interfaccia che non faccia compromessi.'
                                        : 'Streamplay isn\'t a corporate product. It\'s the personal project of a single developer who believes cinema should be accessible to everyone, with an interface that makes no compromises.'}
                                </p>
                                <p>
                                    {language === 'it-IT'
                                        ? 'Ogni pixel, ogni animazione, ogni ottimizzazione è stata curata con attenzione maniacale. Perché i dettagli fanno la differenza.'
                                        : 'Every pixel, every animation, every optimization has been crafted with obsessive attention. Because details make the difference.'}
                                </p>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-10 lg:col-span-2">
                                <span className="text-6xl font-black text-primary">1</span>
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
                                    {language === 'it-IT' ? 'Sviluppatore' : 'Developer'}
                                </span>
                                <span className="mt-2 text-xs text-gray-600 font-mono">
                                    {language === 'it-IT' ? '∞ passione' : '∞ passion'}
                                </span>
                            </div>
                        </m.div>
                    </m.div>
                </section>

                {/* ═══════════ TELEGRAM CTA ═══════════ */}
                <section className="mx-auto max-w-5xl px-4 py-20 lg:px-0">
                    <m.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
                        className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.06] bg-gradient-to-br from-[#0088cc]/10 via-black to-black p-12 md:p-20 text-center"
                    >
                        {/* Glow */}
                        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-[#0088cc]/15 blur-[100px]" />

                        <div className="relative z-10 space-y-8">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0088cc]/15 border border-[#0088cc]/20">
                                <TelegramIcon className="h-10 w-10 text-[#0088cc]" />
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-3xl font-black md:text-4xl tracking-tight">
                                    {language === 'it-IT' ? 'Unisciti alla Community' : 'Join the Community'}
                                </h2>
                                <p className="mx-auto max-w-lg text-gray-500">
                                    {language === 'it-IT'
                                        ? 'Hai trovato un bug? Vuoi suggerire una funzionalità? Il canale Telegram è il posto giusto. Ogni segnalazione ci aiuta a migliorare.'
                                        : 'Found a bug? Want to suggest a feature? The Telegram channel is the right place. Every report helps us improve.'}
                                </p>
                            </div>

                            <m.a
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                href="https://t.me/streamplayit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 rounded-full bg-[#0088cc] px-10 py-4 font-black text-white shadow-2xl shadow-[#0088cc]/25 transition-shadow hover:shadow-[#0088cc]/40"
                            >
                                <TelegramIcon className="h-5 w-5" />
                                <span>{language === 'it-IT' ? 'Canale Telegram' : 'Telegram Channel'}</span>
                            </m.a>
                        </div>
                    </m.div>
                </section>

                {/* ═══════════ FOOTER ═══════════ */}
                <footer className="border-t border-white/5 py-10 text-center text-sm text-gray-700">
                    © {new Date().getFullYear()} Streamplay — Built with passion, one commit at a time.
                </footer>
            </main>
        </LazyMotion>
    );
}
