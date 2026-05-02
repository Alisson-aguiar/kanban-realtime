import { Task } from './db';
import { generateId } from './utils';

export const seedInitialTasks = (): Task[] => {
    return [
        {
            id: generateId(),
            title: 'Implementar WebSocket',
            description: 'Configurar Socket.io para atualizações em tempo real',
            status: 'todo',
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            syncStatus: 'synced',
        },
        {
            id: generateId(),
            title: 'Configurar IndexedDB',
            description: 'Implementar Dexie.js para cache offline',
            status: 'in-progress',
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            syncStatus: 'synced',
        },
        {
            id: generateId(),
            title: 'Testes E2E',
            description: 'Criar testes com Playwright simulando perda de conexão',
            status: 'done',
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            syncStatus: 'synced',
        },
        {
            id: generateId(),
            title: 'Drag and Drop',
            description: 'Implementar @dnd-kit para movimentação de tarefas',
            status: 'in-progress',
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            syncStatus: 'synced',
        },
        {
            id: generateId(),
            title: 'Offline First',
            description: 'Configurar IndexedDB com Dexie.js',
            status: 'todo',
            order: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
            syncStatus: 'synced',
        },
    ];
}