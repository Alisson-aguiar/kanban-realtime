'use client';

import { useState, useEffect } from 'react';
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
    Star,
    Code2,
    Shield,
    Rocket,
    Clock,
    BarChart3,
    GitBranch,
    Layers,
    Smartphone,
    Globe,
    Lock,
    Bell,
    MessageSquare,
    FileText,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Ícones customizados
const GithubIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
);

const LinkedinIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
    </svg>
);

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header com Glassmorphism */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800/50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-lg opacity-50"></div>
                                <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Kanban Pro
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="#features" className="text-slate-300 hover:text-white transition-colors text-sm">Funcionalidades</Link>
                            <Link href="#tech" className="text-slate-300 hover:text-white transition-colors text-sm">Tecnologias</Link>
                            <Link href="#testing" className="text-slate-300 hover:text-white transition-colors text-sm">Testes</Link>
                            <Link href="#roadmap" className="text-slate-300 hover:text-white transition-colors text-sm">Roadmap</Link>
                        </nav>

                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/kanban" target="_blank">
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20">
                                    Acessar Aplicação
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-slate-300 hover:text-white"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 space-y-3">
                            <Link href="#features" className="block text-slate-300 hover:text-white transition-colors py-2">Funcionalidades</Link>
                            <Link href="#tech" className="block text-slate-300 hover:text-white transition-colors py-2">Tecnologias</Link>
                            <Link href="#testing" className="block text-slate-300 hover:text-white transition-colors py-2">Testes</Link>
                            <Link href="#roadmap" className="block text-slate-300 hover:text-white transition-colors py-2">Roadmap</Link>
                            <Link href="/kanban" target="_blank">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
                                    Acessar Aplicação
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-5xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6 backdrop-blur-sm">
                                <Rocket className="h-4 w-4 text-blue-400" />
                                <span className="text-blue-400 text-xs font-medium">Projeto de Portfólio - Nível Enterprise</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Gestão de Tarefas
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    em Tempo Real
                                </span>
                            </h1>

                            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                                Uma aplicação Kanban com sincronização WebSocket,
                                suporte offline-first e arquitetura enterprise. Desenvolvida
                                com as mais modernas tecnologias do ecossistema JavaScript.
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/kanban" target="_blank">
                                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 text-base px-8">
                                        Demo ao Vivo
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="https://github.com/Alisson-aguiar" target="_blank">
                                    <Button size="lg"  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-base px-8">
                                        <GithubIcon/>
                                        GitHub
                                    </Button>
                                </Link>
                                <Link href="https://www.linkedin.com/in/alisson-aguiars2k/" target="_blank">
                                    <Button size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-base px-8">
                                        <LinkedinIcon />
                                        LinkedIn
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-slate-800/50">
                                <div>
                                    <div className="text-3xl font-bold text-white">10+</div>
                                    <div className="text-sm text-slate-500">Tecnologias</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">100%</div>
                                    <div className="text-sm text-slate-500">TypeScript</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">Offline</div>
                                    <div className="text-sm text-slate-500">First Class</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">Tempo Real</div>
                                    <div className="text-sm text-slate-500">WebSocket</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-slate-900/30">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Funcionalidades Principais</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Uma experiência completa de gerenciamento de tarefas com recursos avançados
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: <LayoutDashboard className="h-6 w-6" />,
                                    title: "Kanban Interativo",
                                    description: "Drag and drop intuitivo com @dnd-kit, reordenação de cards e movimentação fluida entre colunas.",
                                    color: "blue"
                                },
                                {
                                    icon: <Wifi className="h-6 w-6" />,
                                    title: "Tempo Real",
                                    description: "Sincronização instantânea entre múltiplos usuários via WebSocket com Socket.io e heartbeat.",
                                    color: "green"
                                },
                                {
                                    icon: <Database className="h-6 w-6" />,
                                    title: "Offline First",
                                    description: "Funciona sem internet usando IndexedDB, sincronização automática quando a conexão retorna.",
                                    color: "yellow"
                                },
                                {
                                    icon: <FolderGit2 className="h-6 w-6" />,
                                    title: "Gestão de Projetos",
                                    description: "CRUD completo de projetos com cores personalizadas, filtragem e organização visual.",
                                    color: "purple"
                                },
                                {
                                    icon: <Users className="h-6 w-6 text-white" />,
                                    title: "Gestão de Equipe",
                                    description: "Controle de membros com funções (Admin, Member, Viewer) e status online/offline em tempo real.",
                                    color: "pink"
                                },
                                {
                                    icon: <TrendingUp className="h-6 w-6" />,
                                    title: "Prioridades Inteligentes",
                                    description: "Sistema de prioridades: Baixa, Média, Alta e Urgente com indicadores visuais distintos.",
                                    color: "orange"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="group bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1">
                                    <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-4 text-${feature.color}-400 group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Technologies Section */}
                <section id="tech" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stack Tecnológica</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Tecnologias modernas e consolidadas no mercado
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[
                                { name: "Next.js 14", icon: "▲", color: "white" },
                                { name: "TypeScript", icon: "TS", color: "white" },
                                { name: "Tailwind CSS", icon: "🎨", color: "cyan" },
                                { name: "Socket.io", icon: "🔌", color: "gray" },
                                { name: "Dexie.js", icon: "💾", color: "yellow" },
                                { name: "Zustand", icon: "🐻", color: "amber" },
                                { name: "Vitest", icon: "🧪", color: "green" },
                                { name: "Playwright", icon: "🎭", color: "teal" },
                                { name: "shadcn/ui", icon: "✨", color: "pink" },
                                { name: "React Hook Form", icon: "📝", color: "red" }
                            ].map((tech) => (
                                <div key={tech.name} className="bg-slate-800/40 rounded-lg p-4 text-center border border-slate-700/50 hover:border-slate-600 transition-all">
                                    <span className="text-2xl block mb-2">{tech.icon}</span>
                                    <span className="text-sm text-slate-300">{tech.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Architecture Section */}
                <section className="py-20 bg-gradient-to-b from-slate-900/30 to-transparent">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Arquitetura Enterprise</h2>
                            <p className="text-slate-400 mb-12">
                                Uma arquitetura robusta e escalável para aplicações modernas
                            </p>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                                    <Shield className="h-10 w-10 text-blue-400 mx-auto mb-4" />
                                    <h3 className="text-white font-semibold mb-2">Offline First</h3>
                                    <p className="text-slate-400 text-sm">Cache local com IndexedDB e sincronização automática</p>
                                </div>
                                <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                                    <GitBranch className="h-10 w-10 text-purple-400 mx-auto mb-4" />
                                    <h3 className="text-white font-semibold mb-2">Real-time Sync</h3>
                                    <p className="text-slate-400 text-sm">WebSocket com heartbeat e reconexão automática</p>
                                </div>
                                <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                                    <Layers className="h-10 w-10 text-green-400 mx-auto mb-4" />
                                    <h3 className="text-white font-semibold mb-2">State Management</h3>
                                    <p className="text-slate-400 text-sm">Zustand com persistência e middleware</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testing Section */}
                <section id="testing" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 p-8 md:p-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">🧪 Testando o WebSocket e Offline</h2>

                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <div className="bg-slate-800/50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                                        <Wifi className="h-5 w-5" />
                                        Teste de Sincronização
                                    </h3>
                                    <ul className="space-y-3 text-slate-300">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Abra duas abas em <code className="bg-slate-900 px-2 py-0.5 rounded text-sm">/kanban</code></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Crie uma tarefa em uma aba</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>A tarefa aparece instantaneamente na outra aba</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-slate-800/50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                                        <CloudOff className="h-5 w-5" />
                                        Teste Offline
                                    </h3>
                                    <ul className="space-y-3 text-slate-300">
                                        <li className="flex items-start gap-3">
                                            <CloudOff className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                            <span>Desconecte a internet (DevTools &gt; Offline)</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Crie/edite/exclua tarefas normalmente</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <RefreshCw className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                            <span>Reconecte e veja a sincronização automática</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Roadmap Section */}
                <section id="roadmap" className="py-20 bg-slate-900/30">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Roadmap</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Funcionalidades planejadas para as próximas versões
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                                <div className="text-3xl mb-3">🔜</div>
                                <h3 className="text-lg font-semibold text-white mb-3">Curto Prazo</h3>
                                <ul className="space-y-2 text-slate-400 text-sm">
                                    <li>• Autenticação (Google/GitHub)</li>
                                    <li>• Notificações em tempo real</li>
                                    <li>• Tema claro/escuro</li>
                                    <li>• Dashboard analytics</li>
                                </ul>
                            </div>
                            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                                <div className="text-3xl mb-3">📅</div>
                                <h3 className="text-lg font-semibold text-white mb-3">Médio Prazo</h3>
                                <ul className="space-y-2 text-slate-400 text-sm">
                                    <li>• Comentários nas tarefas</li>
                                    <li>• Anexos de arquivos</li>
                                    <li>• Relatórios e gráficos</li>
                                    <li>• Exportar para CSV/PDF</li>
                                </ul>
                            </div>
                            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                                <div className="text-3xl mb-3">🎯</div>
                                <h3 className="text-lg font-semibold text-white mb-3">Longo Prazo</h3>
                                <ul className="space-y-2 text-slate-400 text-sm">
                                    <li>• Aplicação PWA</li>
                                    <li>• Integração Google Calendar</li>
                                    <li>• API pública RESTful</li>
                                    <li>• Mobile App (React Native)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Pronto para <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">começar?</span>
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Explore o código fonte no GitHub ou experimente a aplicação ao vivo
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/kanban" target="_blank">
                                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25">
                                        Experimentar Agora
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="https://github.com/Alisson-aguiar" target="_blank">
                                    <Button size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                        <GithubIcon />
                                        Ver Código
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-800/50 py-8">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-blue-400" />
                                <span className="text-sm text-slate-400">Kanban Pro - Gestão de Tarefas Enterprise</span>
                            </div>
                            <div className="flex gap-6">
                                <Link href="https://github.com/Alisson-aguiar" target="_blank" className="text-slate-500 hover:text-white transition-colors">
                                    <GithubIcon />
                                </Link>
                                <Link href="https://www.linkedin.com/in/alisson-aguiars2k/" target="_blank" className="text-slate-500 hover:text-white transition-colors">
                                    <LinkedinIcon />
                                </Link>
                            </div>
                            <div className="text-sm text-slate-500">
                                © 2024 Alisson Aguiar. Todos os direitos reservados.
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}