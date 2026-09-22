'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Zap,
    Wifi,
    Database,
    Users,
    FolderGit2,
    LayoutDashboard,
    ArrowRight,
    CheckCircle,
    CloudOff,
    RefreshCw,
    TrendingUp,
    Menu,
    X,
    Rocket,
    Shield,
    GitBranch,
    Layers,
    Star,
    Sparkles,
    Heart,
    Coffee,
    Code2,
    MousePointerClick,
    Gauge,
    Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ============ ÍCONES SVG ============
const GithubIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
        />
    </svg>
);

const LinkedinIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
    </svg>
);

// ============ HOOK: Reveal on scroll ============
function useReveal<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.unobserve(el);
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return { ref, visible };
}

// ============ COMPONENTE: Reveal wrapper ============
function Reveal({
    children,
    delay = 0,
    className = '',
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const { ref, visible } = useReveal<HTMLDivElement>();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

// ============ COMPONENTE: Contador animado ============
function CountUp({
    end,
    duration = 1500,
    suffix = '',
}: {
    end: number;
    duration?: number;
    suffix?: string;
}) {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const start = performance.now();
                const tick = (now: number) => {
                    const progress = Math.min((now - start) / duration, 1);
                    setValue(Math.floor(progress * end));
                    if (progress < 1) requestAnimationFrame(tick);
                    else setValue(end);
                };
                requestAnimationFrame(tick);
            }
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, [end, duration]);

    return (
        <span ref={ref}>
            {value}
            {suffix}
        </span>
    );
}

// ============ COMPONENTE: Spotlight card (hover com brilho) ============
function SpotlightCard({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--x', `${e.clientX - rect.left}px`);
        el.style.setProperty('--y', `${e.clientY - rect.top}px`);
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            className={`group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/70 hover:shadow-2xl hover:shadow-blue-500/10 ${className}`}
        >
            {/* Spotlight */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        'radial-gradient(600px circle at var(--x) var(--y), rgba(59,130,246,0.15), transparent 40%)',
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// ============ PÁGINA ============
export default function LandingPage() {
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!mounted) return null;

    const features = [
        {
            icon: <LayoutDashboard className="h-6 w-6" />,
            title: 'Kanban que flui com você',
            description:
                'Arraste e solte cards com naturalidade. Reordene, mova entre colunas e mantenha o ritmo do seu time sem fricção.',
            gradient: 'from-blue-500 to-cyan-500',
            glow: 'shadow-blue-500/20',
        },
        {
            icon: <Wifi className="h-6 w-6" />,
            title: 'Tudo em tempo real',
            description:
                'Uma mudança aqui, refletida ali na hora. WebSocket com reconexão automática para você nunca perder o fio da meada.',
            gradient: 'from-green-500 to-emerald-500',
            glow: 'shadow-green-500/20',
        },
        {
            icon: <Database className="h-6 w-6" />,
            title: 'Funciona mesmo offline',
            description:
                'Sem sinal? Sem problema. Suas tarefas ficam guardadas localmente e sincronizam sozinhas quando a internet volta.',
            gradient: 'from-yellow-500 to-orange-500',
            glow: 'shadow-yellow-500/20',
        },
        {
            icon: <FolderGit2 className="h-6 w-6" />,
            title: 'Projetos do seu jeito',
            description:
                'Cores, descrições e filtros. Organize cada projeto para enxergar o que importa sem ruído visual.',
            gradient: 'from-purple-500 to-fuchsia-500',
            glow: 'shadow-purple-500/20',
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: 'Time na mesma página',
            description:
                'Admins, membros e visualizadores. Cada pessoa com o seu papel, todos enxergando o mesmo progresso.',
            gradient: 'from-pink-500 to-rose-500',
            glow: 'shadow-pink-500/20',
        },
        {
            icon: <TrendingUp className="h-6 w-6" />,
            title: 'Prioridade com clareza',
            description:
                'Baixa, média, alta ou urgente. Identifique com um olhar o que precisa de você agora e o que pode esperar.',
            gradient: 'from-orange-500 to-red-500',
            glow: 'shadow-orange-500/20',
        },
    ];

    const technologies = [
        { name: 'Next.js 16', icon: '▲', color: 'text-white' },
        { name: 'TypeScript', icon: 'TS', color: 'text-blue-400' },
        { name: 'Tailwind CSS', icon: '🎨', color: 'text-cyan-400' },
        { name: 'Socket.io', icon: '🔌', color: 'text-slate-300' },
        { name: 'Dexie.js', icon: '💾', color: 'text-yellow-400' },
        { name: 'Zustand', icon: '🐻', color: 'text-amber-400' },
        { name: 'Vitest', icon: '🧪', color: 'text-green-400' },
        { name: 'Playwright', icon: '🎭', color: 'text-teal-400' },
        { name: 'shadcn/ui', icon: '✨', color: 'text-pink-400' },
        { name: 'React Hook Form', icon: '📝', color: 'text-red-400' },
    ];

    const roadmap = [
        {
            emoji: '🔜',
            period: 'Curto prazo',
            items: [
                'Login com Google e GitHub',
                'Notificações em tempo real',
                'Tema claro e escuro',
                'Dashboard com métricas',
            ],
        },
        {
            emoji: '📅',
            period: 'Médio prazo',
            items: [
                'Comentários nas tarefas',
                'Upload de anexos',
                'Relatórios visuais',
                'Exportar para CSV e PDF',
            ],
        },
        {
            emoji: '🎯',
            period: 'Longo prazo',
            items: [
                'Versão instalável (PWA)',
                'Integração com Google Calendar',
                'API pública REST',
                'App mobile com React Native',
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 antialiased">
            {/* ================= HEADER ================= */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                        ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 py-3'
                        : 'bg-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                                <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Kanban Pro
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {[
                                { href: '#features', label: 'Funcionalidades' },
                                { href: '#tech', label: 'Tecnologias' },
                                { href: '#testing', label: 'Testar' },
                                { href: '#roadmap', label: 'Roadmap' },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative text-slate-300 hover:text-white transition-colors text-sm font-medium group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                        </nav>

                        <div className="hidden md:block">
                            <Link href="/kanban">
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-105">
                                    Abrir o app
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-slate-300 hover:text-white p-2"
                            aria-label="Abrir menu"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 space-y-1 border-t border-slate-800/50 pt-4">
                            {[
                                { href: '#features', label: 'Funcionalidades' },
                                { href: '#tech', label: 'Tecnologias' },
                                { href: '#testing', label: 'Testar' },
                                { href: '#roadmap', label: 'Roadmap' },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-slate-300 hover:text-white transition-colors py-2"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link href="/kanban">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 mt-3">
                                    Abrir o app
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <main>
                {/* ================= HERO ================= */}
                <section className="relative pt-40 pb-24 overflow-hidden">
                    {/* Blobs */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute inset-0 grid-pattern opacity-30" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-5xl mx-auto text-center">
                            <Reveal>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6 backdrop-blur-sm">
                                    <Sparkles className="h-4 w-4 text-blue-400" />
                                    <span className="text-blue-400 text-xs font-medium">
                                        Feito com muito café e Next.js
                                    </span>
                                </div>
                            </Reveal>

                            <Reveal delay={100}>
                                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                    <span className="bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        Organize seu dia
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        sem perder o ritmo.
                                    </span>
                                </h1>
                            </Reveal>

                            <Reveal delay={200}>
                                <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                    Kanban Pro é um quadro de tarefas que funciona mesmo quando a internet não ajuda.
                                    Sincroniza em tempo real, guarda tudo localmente e mantém seu time alinhado —
                                    do primeiro card ao último <span className="text-slate-300">✓</span>.
                                </p>
                            </Reveal>

                            <Reveal delay={300}>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Link href="/kanban">
                                        <Button
                                            size="lg"
                                            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-500/25 text-base px-8 transition-all hover:scale-105 hover:shadow-blue-500/40"
                                        >
                                            <MousePointerClick className="mr-2 h-5 w-5" />
                                            Experimentar agora
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                    <Link href="https://github.com/Alisson-aguiar" target="_blank">
                                        <Button
                                            size="lg"
                                            variant="default"
                                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500 text-base px-8 transition-all hover:scale-105"
                                        >
                                            <GithubIcon className="mr-2 h-5 w-5" />
                                            Ver o código
                                        </Button>
                                    </Link>
                                </div>
                            </Reveal>

                            <Reveal delay={400}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-slate-800/50">
                                    {[
                                        { value: <CountUp end={10} suffix="+" />, label: 'Tecnologias' },
                                        { value: <CountUp end={100} suffix="%" />, label: 'TypeScript' },
                                        { value: '0ms', label: 'Downtime offline' },
                                        { value: '∞', label: 'Tarefas possíveis' },
                                    ].map((stat, i) => (
                                        <div key={i} className="text-center">
                                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ================= FEATURES ================= */}
                <section id="features" className="py-24 bg-slate-900/30 relative">
                    <div className="container mx-auto px-6">
                        <Reveal>
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
                                    Funcionalidades
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4">
                                    Tudo que você precisa,{' '}
                                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        nada do que não precisa
                                    </span>
                                </h2>
                                <p className="text-slate-400 text-lg">
                                    Cada detalhe foi pensado para o dia a dia de quem trabalha com tarefas.
                                </p>
                            </div>
                        </Reveal>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <Reveal key={feature.title} delay={index * 80}>
                                    <SpotlightCard className="h-full p-6">
                                        <div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 text-white shadow-lg ${feature.glow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                                        >
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </SpotlightCard>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= TECHNOLOGIES ================= */}
                <section id="tech" className="py-24 relative">
                    <div className="container mx-auto px-6">
                        <Reveal>
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase">
                                    Stack
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4">
                                    Ferramentas que fazem{' '}
                                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        a mágica acontecer
                                    </span>
                                </h2>
                                <p className="text-slate-400 text-lg">
                                    Escolhas conscientes, cada uma resolvendo um problema real.
                                </p>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
                            {technologies.map((tech, i) => (
                                <Reveal key={tech.name} delay={i * 50}>
                                    <div className="group bg-slate-800/40 rounded-xl p-5 text-center border border-slate-700/50 hover:border-slate-500/70 hover:bg-slate-800/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5">
                                        <span
                                            className={`text-3xl block mb-3 group-hover:scale-125 transition-transform duration-300 ${tech.color}`}
                                        >
                                            {tech.icon}
                                        </span>
                                        <span className="text-sm text-slate-300 font-medium">
                                            {tech.name}
                                        </span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= ARCHITECTURE ================= */}
                <section className="py-24 bg-gradient-to-b from-slate-900/30 to-transparent">
                    <div className="container mx-auto px-6">
                        <Reveal>
                            <div className="max-w-4xl mx-auto text-center mb-16">
                                <span className="text-green-400 text-sm font-semibold tracking-wider uppercase">
                                    Arquitetura
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4">
                                    Pensado para{' '}
                                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                        durar
                                    </span>
                                </h2>
                                <p className="text-slate-400 text-lg">
                                    Decisões técnicas que fazem diferença quando a coisa fica séria.
                                </p>
                            </div>
                        </Reveal>

                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {[
                                {
                                    icon: <Shield className="h-8 w-8" />,
                                    title: 'Offline First',
                                    text: 'IndexedDB com fila de sincronização e retry automático. Seu trabalho nunca se perde.',
                                    color: 'text-blue-400',
                                    bg: 'bg-blue-500/10',
                                },
                                {
                                    icon: <GitBranch className="h-8 w-8" />,
                                    title: 'Real-time Sync',
                                    text: 'WebSocket com heartbeat, reconexão exponencial e broadcast inteligente entre clientes.',
                                    color: 'text-purple-400',
                                    bg: 'bg-purple-500/10',
                                },
                                {
                                    icon: <Layers className="h-8 w-8" />,
                                    title: 'State Management',
                                    text: 'Zustand com persistência seletiva, middleware customizado e tipagem end-to-end.',
                                    color: 'text-green-400',
                                    bg: 'bg-green-500/10',
                                },
                            ].map((item, i) => (
                                <Reveal key={item.title} delay={i * 100}>
                                    <SpotlightCard className="h-full p-8 text-center">
                                        <div
                                            className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}
                                        >
                                            {item.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {item.text}
                                        </p>
                                    </SpotlightCard>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= TESTING ================= */}
                <section id="testing" className="py-24">
                    <div className="container mx-auto px-6">
                        <Reveal>
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase">
                                    Experimente
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4">
                                    Não acredite,{' '}
                                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                        teste você mesmo
                                    </span>
                                </h2>
                                <p className="text-slate-400 text-lg">
                                    Dois testes rápidos que mostram do que a aplicação é capaz.
                                </p>
                            </div>
                        </Reveal>

                        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl border border-blue-500/20 p-8 md:p-12 max-w-5xl mx-auto backdrop-blur-sm">
                            <div className="grid md:grid-cols-2 gap-8">
                                <Reveal delay={100}>
                                    <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                <Wifi className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">
                                                Sincronização ao vivo
                                            </h3>
                                        </div>
                                        <ol className="space-y-3 text-slate-300 text-sm">
                                            {[
                                                'Abra duas abas no mesmo navegador',
                                                'Crie uma tarefa em uma delas',
                                                'Veja ela aparecer na outra, na hora',
                                                'Edite ou mova: tudo se reflete',
                                            ].map((step, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-semibold">
                                                        {i + 1}
                                                    </span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </Reveal>

                                <Reveal delay={200}>
                                    <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/50 hover:border-yellow-500/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                                <CloudOff className="h-5 w-5 text-yellow-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">
                                                Modo offline
                                            </h3>
                                        </div>
                                        <ol className="space-y-3 text-slate-300 text-sm">
                                            {[
                                                'Abra o DevTools (F12) → aba Network',
                                                'Marque "Offline" para simular sem internet',
                                                'Crie, edite e exclua tarefas normalmente',
                                                'Desmarque "Offline" e veja a mágica acontecer',
                                            ].map((step, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center justify-center font-semibold">
                                                        {i + 1}
                                                    </span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </Reveal>
                            </div>

                            <div className="mt-8 text-center">
                                <Link href="/kanban">
                                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                                        <Rocket className="mr-2 h-4 w-4" />
                                        Testar agora mesmo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= ROADMAP ================= */}
                <section id="roadmap" className="py-24 bg-slate-900/30">
                    <div className="container mx-auto px-6">
                        <Reveal>
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <span className="text-pink-400 text-sm font-semibold tracking-wider uppercase">
                                    O que vem por aí
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4">
                                    Ainda tem{' '}
                                    <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                                        muita coisa boa
                                    </span>
                                </h2>
                                <p className="text-slate-400 text-lg">
                                    Este projeto está vivo. Aqui está o que pretendo construir em seguida.
                                </p>
                            </div>
                        </Reveal>

                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {roadmap.map((phase, i) => (
                                <Reveal key={phase.period} delay={i * 100}>
                                    <SpotlightCard className="h-full p-6">
                                        <div className="text-4xl mb-4">{phase.emoji}</div>
                                        <h3 className="text-lg font-semibold text-white mb-4">
                                            {phase.period}
                                        </h3>
                                        <ul className="space-y-2.5">
                                            {phase.items.map((item) => (
                                                <li key={item} className="flex items-start gap-2 text-slate-400 text-sm">
                                                    <CheckCircle className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </SpotlightCard>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= CTA ================= */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <Reveal>
                            <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-10 md:p-16 text-center">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl -z-0" />

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                                        <Heart className="h-3 w-3 text-blue-400 fill-blue-400" />
                                        <span className="text-blue-400 text-xs font-medium">Obrigado pela visita</span>
                                    </div>

                                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                        Curtiu? Dá uma{' '}
                                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                            olhada no código
                                        </span>
                                    </h2>
                                    <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-lg">
                                        O repositório está aberto, comentado e pronto para receber feedback.
                                        Se quiser trocar ideia sobre front-end, arquitetura ou oportunidade, me chama.
                                    </p>

                                    <div className="flex flex-wrap justify-center gap-4">
                                        <Link href="/kanban">
                                            <Button
                                                size="lg"
                                                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
                                            >
                                                <Rocket className="mr-2 h-5 w-5" />
                                                Abrir a aplicação
                                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                        <Link href="https://github.com/Alisson-aguiar" target="_blank">
                                            <Button
                                                size="lg"
                                                variant="default"
                                                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500 hover:scale-105 transition-all"
                                            >
                                                <GithubIcon className="mr-2 h-5 w-5" />
                                                Ver no GitHub
                                            </Button>
                                        </Link>
                                        <Link
                                            href="https://www.linkedin.com/in/alisson-aguiars2k/"
                                            target="_blank"
                                        >
                                            <Button
                                                size="lg"
                                                variant="default"
                                                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500 hover:scale-105 transition-all"
                                            >
                                                <LinkedinIcon className="mr-2 h-5 w-5" />
                                                Conectar no LinkedIn
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ================= FOOTER ================= */}
                <footer className="border-t border-slate-800/50 py-10">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-blue-400" />
                                <span className="text-sm text-slate-400">
                                    Kanban Pro · Feito com{' '}
                                    <Coffee className="inline h-3 w-3 text-amber-400" /> e{' '}
                                    <Code2 className="inline h-3 w-3 text-blue-400" />
                                </span>
                            </div>

                            <div className="flex gap-6">
                                <Link
                                    href="https://github.com/Alisson-aguiar"
                                    target="_blank"
                                    aria-label="GitHub"
                                    className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform"
                                >
                                    <GithubIcon />
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/in/alisson-aguiars2k/"
                                    target="_blank"
                                    aria-label="LinkedIn"
                                    className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform"
                                >
                                    <LinkedinIcon />
                                </Link>
                            </div>

                            <div className="text-sm text-slate-500">
                                © {new Date().getFullYear()} Alisson Aguiar
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}