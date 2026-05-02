import Dexie, { Table } from 'dexie';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    order: number;
    createdAt: Date;
    updatedAt: Date;
    syncStatus: 'synced' | 'pending' | 'failed';
    syncError?: string;
}

export interface SyncQueue {
    id?: number;
    operation: 'create' | 'update' | 'delete' | 'reorder';
    taskId: string;
    data: any;
    timestamp: Date;
    retryCount: number;
    lastError?: string;
}

// Verificar se está no browser
const isBrowser = typeof window !== 'undefined';

class KanbanDatabase extends Dexie {
    tasks!: Table<Task, string>;
    syncQueue!: Table<SyncQueue, number>;

    constructor() {
        super('KanbanDB');

        this.version(1).stores({
            tasks: 'id, status, order, syncStatus, updatedAt, createdAt',
            syncQueue: '++id, taskId, timestamp, retryCount'
        });
    }

    async getAllTasks(): Promise<Task[]> {
        if (!isBrowser) return [];
        return await this.tasks.toArray();
    }

    async getTask(id: string): Promise<Task | undefined> {
        if (!isBrowser) return undefined;
        return await this.tasks.get(id);
    }

    async addTaskOffline(task: Task): Promise<string> {
        if (!isBrowser) return task.id;

        const taskToAdd = {
            ...task,
            syncStatus: 'pending' as const,
            updatedAt: new Date(),
            createdAt: task.createdAt || new Date()
        };

        await this.tasks.add(taskToAdd);
        await this.addToSyncQueue('create', task.id, taskToAdd);

        console.log(`📝 Tarefa adicionada offline: ${task.title}`);
        return task.id;
    }

    async updateTaskOffline(id: string, updates: Partial<Task>): Promise<void> {
        if (!isBrowser) return;

        const existing = await this.tasks.get(id);
        if (!existing) throw new Error('Task not found');

        await this.tasks.update(id, {
            ...updates,
            syncStatus: 'pending',
            updatedAt: new Date()
        });

        await this.addToSyncQueue('update', id, updates);
        console.log(`✏️ Tarefa atualizada offline: ${id}`);
    }

    async deleteTaskOffline(id: string): Promise<void> {
        if (!isBrowser) return;

        await this.tasks.delete(id);
        await this.addToSyncQueue('delete', id, id);
        console.log(`🗑️ Tarefa deletada offline: ${id}`);
    }

    async reorderTasksOffline(tasks: Task[]): Promise<void> {
        if (!isBrowser) return;

        await this.tasks.bulkPut(tasks);
        await this.addToSyncQueue('reorder', 'all', { taskIds: tasks.map(t => t.id) });
        console.log(`🔄 Tarefas reordenadas offline`);
    }

    async addToSyncQueue(
        operation: SyncQueue['operation'],
        taskId: string,
        data: any
    ): Promise<number> {
        if (!isBrowser) return 0;

        return await this.syncQueue.add({
            operation,
            taskId,
            data,
            timestamp: new Date(),
            retryCount: 0
        });
    }

    async getPendingSyncItems(): Promise<SyncQueue[]> {
        if (!isBrowser) return [];
        return await this.syncQueue.toArray();
    }

    async updateSyncQueueItem(id: number, updates: Partial<SyncQueue>): Promise<void> {
        if (!isBrowser) return;
        await this.syncQueue.update(id, updates);
    }

    async removeFromSyncQueue(id: number): Promise<void> {
        if (!isBrowser) return;
        await this.syncQueue.delete(id);
    }

    async clearSyncQueue(): Promise<void> {
        if (!isBrowser) return;
        await this.syncQueue.clear();
    }

    async markAsSynced(taskId: string): Promise<void> {
        if (!isBrowser) return;
        await this.tasks.update(taskId, { syncStatus: 'synced', syncError: undefined });
    }

    async markAsFailed(taskId: string, error: string): Promise<void> {
        if (!isBrowser) return;
        await this.tasks.update(taskId, { syncStatus: 'failed', syncError: error });
    }

    async getPendingTasks(): Promise<Task[]> {
        if (!isBrowser) return [];
        return await this.tasks.where('syncStatus').equals('pending').toArray();
    }

    async getFailedTasks(): Promise<Task[]> {
        if (!isBrowser) return [];
        return await this.tasks.where('syncStatus').equals('failed').toArray();
    }

    async clearOldCache(daysOld: number = 7): Promise<number> {
        if (!isBrowser) return 0;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const oldTasks = await this.tasks
            .where('updatedAt')
            .below(cutoffDate)
            .delete();

        console.log(`🧹 Limpeza de cache: ${oldTasks} tarefas removidas`);
        return oldTasks;
    }

    async getStorageInfo(): Promise<{ taskCount: number; pendingCount: number; failedCount: number }> {
        if (!isBrowser) return { taskCount: 0, pendingCount: 0, failedCount: 0 };

        const taskCount = await this.tasks.count();
        const pendingCount = await this.tasks.where('syncStatus').equals('pending').count();
        const failedCount = await this.tasks.where('syncStatus').equals('failed').count();

        return { taskCount, pendingCount, failedCount };
    }

    async exportData(): Promise<string> {
        if (!isBrowser) return '[]';

        const tasks = await this.getAllTasks();
        const syncQueue = await this.getPendingSyncItems();
        return JSON.stringify({ tasks, syncQueue, exportDate: new Date() });
    }

    async importData(data: string): Promise<void> {
        if (!isBrowser) return;

        const parsed = JSON.parse(data);
        await this.tasks.clear();
        await this.syncQueue.clear();
        await this.tasks.bulkAdd(parsed.tasks);
        if (parsed.syncQueue?.length) {
            await this.syncQueue.bulkAdd(parsed.syncQueue);
        }
        console.log(`📥 Dados importados: ${parsed.tasks.length} tarefas`);
    }
}

// Criar instância apenas no browser
export const db = isBrowser ? new KanbanDatabase() : ({} as KanbanDatabase);

// Inicializar apenas no browser
if (isBrowser) {
    db.open().catch((error) => {
        console.error('❌ Erro ao abrir IndexedDB:', error);
    });
}