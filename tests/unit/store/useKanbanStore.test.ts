import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useKanbanStore, Task } from '@/store/useKanbanStore';

// Mock do db
vi.mock('@/lib/db', () => ({
    db: {
        addTaskOffline: vi.fn().mockResolvedValue(undefined),
        updateTaskOffline: vi.fn().mockResolvedValue(undefined),
        deleteTaskOffline: vi.fn().mockResolvedValue(undefined),
        reorderTasksOffline: vi.fn().mockResolvedValue(undefined),
        getAllTasks: vi.fn().mockResolvedValue([]),
        getPendingSyncItems: vi.fn().mockResolvedValue([]),
        clearSyncQueue: vi.fn().mockResolvedValue(undefined),
    },
}));

// Mock do socket
vi.mock('@/lib/socket-client', () => ({
    getSocket: vi.fn(() => ({
        connected: false,
        emit: vi.fn(),
    })),
}));

describe('useKanbanStore', () => {
    beforeEach(() => {
        // Resetar store antes de cada teste
        useKanbanStore.setState({
            tasks: [],
            isLoading: false,
            onlineStatus: true,
            projects: [],
            users: [],
            teams: [],
            activityLogs: [],
            taskAssignments: [],
            currentProjectId: null,
            selectedUserId: null,
        });
    });

    const createMockTask = (id: string, title: string): Task => ({
        id,
        title,
        description: 'Test Description',
        status: 'todo',
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncStatus: 'pending',
        priority: 'medium',
        tags: ['test'],
        assignedTo: [],
    });

    it('deve adicionar uma nova tarefa', async () => {
        const { addTask } = useKanbanStore.getState();

        const newTask = createMockTask('1', 'Test Task');

        await addTask(newTask);
        const state = useKanbanStore.getState();

        expect(state.tasks).toHaveLength(1);
        expect(state.tasks[0].title).toBe('Test Task');
        expect(state.tasks[0].priority).toBe('medium');
        expect(state.tasks[0].tags).toEqual(['test']);
    });

    it('não deve adicionar tarefa duplicada', async () => {
        const { addTask } = useKanbanStore.getState();

        const newTask = createMockTask('1', 'Test Task');

        await addTask(newTask);
        await addTask(newTask);
        const state = useKanbanStore.getState();

        expect(state.tasks).toHaveLength(1);
    });

    it('deve atualizar uma tarefa existente', async () => {
        const { addTask, updateTask } = useKanbanStore.getState();

        const task = createMockTask('1', 'Original Title');

        await addTask(task);
        await updateTask('1', { title: 'Updated Title', priority: 'high' });

        const state = useKanbanStore.getState();
        expect(state.tasks[0].title).toBe('Updated Title');
        expect(state.tasks[0].priority).toBe('high');
    });

    it('não deve atualizar tarefa inexistente', async () => {
        const { updateTask } = useKanbanStore.getState();

        await updateTask('999', { title: 'Should Not Update' });

        const state = useKanbanStore.getState();
        expect(state.tasks).toHaveLength(0);
    });

    it('deve deletar uma tarefa', async () => {
        const { addTask, deleteTask } = useKanbanStore.getState();

        const task = createMockTask('1', 'Task to Delete');

        await addTask(task);
        expect(useKanbanStore.getState().tasks).toHaveLength(1);

        await deleteTask('1');
        expect(useKanbanStore.getState().tasks).toHaveLength(0);
    });

    it('não deve deletar tarefa inexistente', async () => {
        const { deleteTask } = useKanbanStore.getState();

        await deleteTask('999');

        const state = useKanbanStore.getState();
        expect(state.tasks).toHaveLength(0);
    });

    it('deve reordenar tarefas', async () => {
        const { addTask, reorderTasks } = useKanbanStore.getState();

        const task1 = createMockTask('1', 'Task 1');
        const task2 = createMockTask('2', 'Task 2');
        const task3 = createMockTask('3', 'Task 3');

        await addTask(task1);
        await addTask(task2);
        await addTask(task3);

        const state = useKanbanStore.getState();
        expect(state.tasks.map(t => t.id)).toEqual(['1', '2', '3']);

        const reordered = [task3, task1, task2];
        await reorderTasks(reordered);

        const newState = useKanbanStore.getState();
        expect(newState.tasks.map(t => t.id)).toEqual(['3', '1', '2']);
    });

    it('deve buscar tarefa por ID', () => {
        const { addTask, getTaskById } = useKanbanStore.getState();

        const task = createMockTask('1', 'Find Me');
        addTask(task);

        const found = getTaskById('1');
        expect(found?.title).toBe('Find Me');

        const notFound = getTaskById('999');
        expect(notFound).toBeUndefined();
    });

    it('deve limpar todas as tarefas', async () => {
        const { addTask, clearAllTasks } = useKanbanStore.getState();

        const task1 = createMockTask('1', 'Task 1');
        const task2 = createMockTask('2', 'Task 2');

        await addTask(task1);
        await addTask(task2);

        expect(useKanbanStore.getState().tasks).toHaveLength(2);

        await clearAllTasks();

        expect(useKanbanStore.getState().tasks).toHaveLength(0);
    });

    it('deve manter o status online/offline', () => {
        const { setOnlineStatus, onlineStatus } = useKanbanStore.getState();

        expect(onlineStatus).toBe(true);

        setOnlineStatus(false);
        expect(useKanbanStore.getState().onlineStatus).toBe(false);

        setOnlineStatus(true);
        expect(useKanbanStore.getState().onlineStatus).toBe(true);
    });

    it('deve gerenciar estado de loading', () => {
        const { setLoading, isLoading } = useKanbanStore.getState();

        expect(isLoading).toBe(false);

        setLoading(true);
        expect(useKanbanStore.getState().isLoading).toBe(true);

        setLoading(false);
        expect(useKanbanStore.getState().isLoading).toBe(false);
    });
});