'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useKanbanStore } from '@/store/useKanbanStore';
import { db } from '@/lib/db';
import { Menu, Zap, Trash2, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebSocketSync } from '@/hooks/useWebSocketSync';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { ProjectManager } from '@/components/projects/ProjectManager';
import { TeamManager } from '@/components/team/TeamManager';
import toast from 'react-hot-toast';

const KanbanBoard = dynamic(
    () => import('@/components/kanban/KanbanBoard').then(mod => mod.KanbanBoard),
    { ssr: false }
);

export default function Home() {
    const { tasks, setTasks, projects, users, clearAllTasks, deleteTask } = useKanbanStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const { isConnected: isWebSocketConnected } = useWebSocketSync();
    const { isSyncing, pendingCount, loadFromIndexedDB } = useOfflineSync();

    // Função para reset completo - LIMPA TUDO MESMO
    const handleFullReset = async () => {
        const confirm = window.confirm(
            '⚠️ ATENÇÃO: Isso irá excluir TODOS os dados!\n\n' +
            '- Todas as tarefas (A Fazer, Em Progresso, Concluído)\n' +
            '- Todos os projetos\n' +
            '- Todos os membros da equipe\n' +
            '- Toda a fila de sincronização\n\n' +
            'Esta ação não pode ser desfeita. Deseja continuar?'
        );

        if (!confirm) return;

        try {
            // 1. Limpar todas as tarefas do estado
            const allTasks = tasks;
            for (const task of allTasks) {
                await deleteTask(task.id);
            }

            // 2. Limpar estado da store
            useKanbanStore.setState({
                tasks: [],
                projects: [],
                users: [],
                teams: [],
                activityLogs: [],
                taskAssignments: [],
                currentProjectId: null,
                selectedUserId: null
            });

            // 3. Limpar IndexedDB
            await db.tasks.clear();
            await db.syncQueue.clear();

            // 4. Limpar localStorage
            localStorage.removeItem('kanban-storage');

            toast.success('Reset completo realizado com sucesso!');

            // 5. Recarregar a página
            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error('Erro ao resetar:', error);
            toast.error('Erro ao resetar dados');
        }
    };

    useEffect(() => {
        setIsClient(true);

        const init = async () => {
            if (isInitialized) return;
            await loadFromIndexedDB();
            setIsInitialized(true);
        };

        init();
    }, [loadFromIndexedDB, isInitialized]);

    if (!isClient || !isInitialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Carregando Kanban Pro...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden text-slate-300 hover:text-slate-100"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-white" />
                                </div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Kanban Pro
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800">
                                <div className={`w-2 h-2 rounded-full ${isWebSocketConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                                <span className="text-xs text-slate-300">
                                    {isWebSocketConnected ? 'Tempo Real' : 'Offline'}
                                </span>
                            </div>

                            {pendingCount > 0 && (
                                <div className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                                    {isSyncing ? 'Sincronizando...' : `${pendingCount} pendente`}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-100 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-300 z-40 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                <div className="p-4 space-y-6">
                    <ProjectManager />
                    <div className="border-t border-slate-800" />
                    <TeamManager />

                    <div className="border-t border-slate-800 pt-4">
                        <Button
                            onClick={handleFullReset}
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset Completo
                        </Button>
                    </div>
                </div>
            </aside>

            <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-80' : 'pl-0 lg:pl-80'
                }`}>
                <div className="container mx-auto p-6">
                    <KanbanBoard />
                </div>
            </main>
        </div>
    );
}