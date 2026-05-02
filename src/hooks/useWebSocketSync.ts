'use client';

import { useEffect, useRef, useState } from 'react';
import { useKanbanStore } from '@/store/useKanbanStore';
import type { Task } from '@/store/useKanbanStore';
import { getSocket, getSocketMetrics } from '@/lib/socket-client';
import toast from 'react-hot-toast';

export const useWebSocketSync = () => {
    const { tasks, setTasks } = useKanbanStore();
    const [isConnected, setIsConnected] = useState(false);
    const [metrics, setMetrics] = useState({ queueSize: 0, connected: false });
    const isInitialized = useRef(false);
    const reconnectAttempts = useRef(0);

    useEffect(() => {
        const socket = getSocket();

        if (!socket) {
            console.warn('⚠️ Socket não disponível');
            return;
        }

        const metricsInterval = setInterval(() => {
            setMetrics(getSocketMetrics());
        }, 5000);

        const handleConnect = () => {
            console.log('✅ WebSocket conectado');
            setIsConnected(true);
            reconnectAttempts.current = 0;
            toast.success('Conectado ao servidor em tempo real!', { duration: 2000 });
            socket.emit('get-tasks');
        };

        const handleDisconnect = (reason: string) => {
            console.log('🔌 WebSocket desconectado:', reason);
            setIsConnected(false);

            if (reason === 'io server disconnect') {
                socket.connect();
            }

            if (reconnectAttempts.current === 0) {
                toast.error('Desconectado do servidor. Modo offline.', { duration: 3000 });
            }
            reconnectAttempts.current++;
        };

        const handleInitialTasks = (initialTasks: any[]) => {
            console.log('📦 Estado inicial recebido:', initialTasks.length);
            if (initialTasks.length > 0 && !isInitialized.current) {
                const tasksWithDates: Task[] = initialTasks.map((task: any) => ({
                    id: task.id,
                    title: task.title,
                    description: task.description || '',
                    status: task.status,
                    order: task.order || 0,
                    createdAt: new Date(task.createdAt),
                    updatedAt: new Date(task.updatedAt),
                    syncStatus: task.syncStatus || 'synced',
                    priority: task.priority || 'medium',
                    tags: task.tags || [],
                    assignedTo: task.assignedTo || [],
                    projectId: task.projectId,
                }));
                setTasks(tasksWithDates);
                isInitialized.current = true;
                toast.success(`${initialTasks.length} tarefas sincronizadas!`);
            }
        };

        const handleTasksUpdate = (updatedTasks: any[]) => {
            console.log('🔄 Atualização recebida:', updatedTasks.length);
            const tasksWithDates: Task[] = updatedTasks.map((task: any) => ({
                id: task.id,
                title: task.title,
                description: task.description || '',
                status: task.status,
                order: task.order || 0,
                createdAt: new Date(task.createdAt),
                updatedAt: new Date(task.updatedAt),
                syncStatus: task.syncStatus || 'synced',
                priority: task.priority || 'medium',
                tags: task.tags || [],
                assignedTo: task.assignedTo || [],
                projectId: task.projectId,
            }));
            setTasks(tasksWithDates);

            if (isConnected && isInitialized.current && updatedTasks.length > 0) {
                toast.success('Tarefas atualizadas em tempo real!', { duration: 1500 });
            }
        };

        const handleConnectError = (error: Error) => {
            console.error('❌ Erro de conexão:', error.message);

            if (reconnectAttempts.current === 3) {
                toast.error('Não foi possível conectar ao servidor. Modo offline.', { duration: 4000 });
            }
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);
        socket.on('initial-tasks', handleInitialTasks);
        socket.on('tasks-update', handleTasksUpdate);

        if (socket.connected) {
            handleConnect();
        }

        return () => {
            clearInterval(metricsInterval);
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('connect_error', handleConnectError);
            socket.off('initial-tasks', handleInitialTasks);
            socket.off('tasks-update', handleTasksUpdate);
        };
    }, [setTasks]);

    // Enviar mudanças para o servidor (apenas add, update, delete)
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !isConnected) return;

        let timeout: NodeJS.Timeout;

        const unsubscribe = useKanbanStore.subscribe((state, prevState) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                // Verificar se houve mudanças
                if (JSON.stringify(state.tasks) !== JSON.stringify(prevState.tasks)) {

                    // Verificar se foi adição
                    if (state.tasks.length > prevState.tasks.length) {
                        const newTask = state.tasks.find(t => !prevState.tasks.some(pt => pt.id === t.id));
                        if (newTask) {
                            console.log('📤 Emitindo add-task:', newTask.title);
                            socket.emit('add-task', newTask);
                        }
                    }
                    // Verificar se foi remoção
                    else if (state.tasks.length < prevState.tasks.length) {
                        const removedTask = prevState.tasks.find(t => !state.tasks.some(st => st.id === t.id));
                        if (removedTask) {
                            console.log('📤 Emitindo delete-task:', removedTask.id);
                            socket.emit('delete-task', removedTask.id);
                        }
                    }
                    // Verificar se foi atualização
                    else {
                        const changedTask = state.tasks.find(t => {
                            const prevTask = prevState.tasks.find(pt => pt.id === t.id);
                            return prevTask && JSON.stringify(prevTask) !== JSON.stringify(t);
                        });

                        if (changedTask) {
                            console.log('📤 Emitindo update-task:', changedTask.id);
                            socket.emit('update-task', {
                                id: changedTask.id,
                                updates: changedTask
                            });
                        }
                    }
                }
            }, 300); // Debounce de 300ms
        });

        return () => {
            clearTimeout(timeout);
            unsubscribe();
        };
    }, [isConnected]);

    return { isConnected, metrics };
};