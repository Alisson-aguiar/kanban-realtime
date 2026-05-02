'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useKanbanStore, Task } from '@/store/useKanbanStore';
import { db } from '@/lib/db';
import { getSocket } from '@/lib/socket-client';
import toast from 'react-hot-toast';

export const useOfflineSync = () => {
    const { setTasks, onlineStatus, setOnlineStatus } = useKanbanStore();
    const [isSyncing, setIsSyncing] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const isSyncingRef = useRef(false);

    const loadFromIndexedDB = useCallback(async () => {
        try {
            const cachedTasks = await db.getAllTasks();
            if (cachedTasks.length > 0) {
                const convertedTasks: Task[] = cachedTasks.map((task: any) => ({
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
                console.log(`📀 Carregando ${convertedTasks.length} tarefas do IndexedDB`);
                setTasks(convertedTasks);
            }
            return cachedTasks;
        } catch (error) {
            console.error('Erro ao carregar do IndexedDB:', error);
            return [];
        }
    }, [setTasks]);

    // Sincronizar apenas operações simples
    const processSyncQueue = useCallback(async () => {
        if (!onlineStatus || isSyncingRef.current) return;

        isSyncingRef.current = true;
        setIsSyncing(true);

        try {
            const pendingItems = await db.getPendingSyncItems();

            // Filtrar apenas operações válidas (ignorar reorder)
            const validItems = pendingItems.filter(item =>
                item.operation === 'create' || item.operation === 'update' || item.operation === 'delete'
            );

            if (validItems.length === 0) {
                setIsSyncing(false);
                isSyncingRef.current = false;
                return;
            }

            console.log(`🔄 Processando ${validItems.length} itens pendentes...`);

            const socket = getSocket();
            if (!socket?.connected) {
                console.log('⚠️ Socket não conectado');
                setIsSyncing(false);
                isSyncingRef.current = false;
                return;
            }

            for (const item of validItems) {
                try {
                    switch (item.operation) {
                        case 'create':
                            socket.emit('add-task', item.data);
                            await db.removeFromSyncQueue(item.id!);
                            break;
                        case 'update':
                            socket.emit('update-task', { id: item.taskId, updates: item.data });
                            await db.removeFromSyncQueue(item.id!);
                            break;
                        case 'delete':
                            socket.emit('delete-task', item.taskId);
                            await db.removeFromSyncQueue(item.id!);
                            break;
                    }
                    console.log(`✅ Sincronizado: ${item.operation}`);
                } catch (error) {
                    console.error(`Erro ao sincronizar ${item.operation}:`, error);
                }
            }

            await loadFromIndexedDB();

        } catch (error) {
            console.error('Erro durante sincronização:', error);
        } finally {
            setIsSyncing(false);
            isSyncingRef.current = false;
        }
    }, [onlineStatus, loadFromIndexedDB]);

    // Atualizar contador de pendentes
    const updatePendingCount = useCallback(async () => {
        const pending = await db.getPendingSyncItems();
        const validPending = pending.filter(item =>
            item.operation === 'create' || item.operation === 'update' || item.operation === 'delete'
        );
        setPendingCount(validPending.length);
    }, []);

    // Monitorar status online/offline
    useEffect(() => {
        const handleOnline = () => {
            console.log('🌐 Conexão restaurada!');
            setOnlineStatus(true);
            toast.success('Conexão restaurada!');
            processSyncQueue();
            loadFromIndexedDB();
        };

        const handleOffline = () => {
            console.log('📴 Conexão perdida - modo offline');
            setOnlineStatus(false);
            toast.error('Modo offline ativado.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if (navigator.onLine) {
            setOnlineStatus(true);
        } else {
            setOnlineStatus(false);
            loadFromIndexedDB();
        }

        updatePendingCount();
        const interval = setInterval(updatePendingCount, 5000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
        };
    }, [setOnlineStatus, processSyncQueue, loadFromIndexedDB, updatePendingCount]);

    return { isSyncing, pendingCount, processSyncQueue, loadFromIndexedDB };
};