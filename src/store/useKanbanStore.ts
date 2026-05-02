import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/db';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'member' | 'viewer';
    status: 'online' | 'offline' | 'away';
    lastSeen?: Date;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    members: string[];
    ownerId: string;
    isArchived: boolean;
}

export interface Team {
    id: string;
    name: string;
    description: string;
    members: string[];
    projects: string[];
    createdAt: Date;
}

export interface ActivityLog {
    id: string;
    userId: string;
    userName: string;
    action: 'create' | 'update' | 'delete' | 'move' | 'assign' | 'complete';
    taskId?: string;
    taskTitle?: string;
    projectId?: string;
    details: string;
    timestamp: Date;
}

export interface TaskAssignment {
    taskId: string;
    userId: string;
    assignedAt: Date;
    assignedBy: string;
}

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
    projectId?: string;
    assignedTo?: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
    tags: string[];
    attachments?: string[];
}


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
    projectId?: string;
    assignedTo?: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
    tags: string[];
    attachments?: string[];
}

interface KanbanState {
    // Existing state
    tasks: Task[];
    isLoading: boolean;
    onlineStatus: boolean;

    // New state for projects and team
    projects: Project[];
    users: User[];
    teams: Team[];
    activityLogs: ActivityLog[];
    taskAssignments: TaskAssignment[];
    currentProjectId: string | null;
    selectedUserId: string | null;

    // Actions
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    setOnlineStatus: (status: boolean) => void;
    reorderTasks: (tasks: Task[]) => Promise<void>;
    clearAllTasks: () => Promise<void>;
    getTaskById: (id: string) => Task | undefined;

    // Project actions
    addProject: (project: Project) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    setCurrentProject: (id: string | null) => void;
    getProjectsByUser: (userId: string) => Project[];

    // User actions
    addUser: (user: User) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    deleteUser: (id: string) => void;
    setUserStatus: (id: string, status: User['status']) => void;

    // Team actions
    addTeam: (team: Team) => void;
    updateTeam: (id: string, updates: Partial<Team>) => void;
    deleteTeam: (id: string) => void;
    addMemberToTeam: (teamId: string, userId: string) => void;
    removeMemberFromTeam: (teamId: string, userId: string) => void;

    // Assignment actions
    assignTask: (taskId: string, userId: string) => void;
    unassignTask: (taskId: string, userId: string) => void;
    getTasksByUser: (userId: string) => Task[];

    // Activity actions
    addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
    getActivityByProject: (projectId: string) => ActivityLog[];
    getActivityByUser: (userId: string) => ActivityLog[];

    // Filter actions
    setSelectedUser: (userId: string | null) => void;
    getFilteredTasks: () => Task[];
}

// Função auxiliar para gerar ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useKanbanStore = create<KanbanState>()(
    persist(
        (set, get) => ({
            // Initial state
            tasks: [],
            isLoading: false,
            onlineStatus: typeof navigator !== 'undefined' ? navigator.onLine : true,
            projects: [],
            users: [],
            teams: [],
            activityLogs: [],
            taskAssignments: [],
            currentProjectId: null,
            selectedUserId: null,

            // Existing actions
            setTasks: (tasks) => {
                const uniqueTasks = tasks.reduce((acc, current) => {
                    const exists = acc.find(item => item.id === current.id);
                    if (!exists) acc.push(current);
                    return acc;
                }, [] as Task[]);
                set({ tasks: uniqueTasks });
            },

            setLoading: (isLoading) => set({ isLoading }),
            setOnlineStatus: (onlineStatus) => set({ onlineStatus }),

            getTaskById: (id) => get().tasks.find(t => t.id === id),

            addTask: async (task) => {
                const existing = get().tasks.find(t => t.id === task.id);
                if (existing) return;

                const newTask = {
                    ...task,
                    createdAt: task.createdAt || new Date(),
                    updatedAt: new Date(),
                    syncStatus: 'pending' as const,
                    priority: task.priority || 'medium',
                    tags: task.tags || [],
                };

                await db.addTaskOffline(newTask);
                set((state) => ({ tasks: [...state.tasks, newTask] }));

                // Add activity log
                get().addActivityLog({
                    userId: 'system',
                    userName: 'System',
                    action: 'create',
                    taskId: newTask.id,
                    taskTitle: newTask.title,
                    details: `Tarefa "${newTask.title}" criada`,
                });

                if (get().onlineStatus) {
                    try {
                        const { getSocket } = await import('@/lib/socket-client');
                        const socket = getSocket();
                        if (socket?.connected) {
                            socket.emit('add-task', newTask);
                        }
                    } catch (error) {
                        console.error('Erro ao emitir add-task:', error);
                    }
                }
            },

            updateTask: async (id, updates) => {
                console.log('updateTask chamado:', id, updates);

                // Atualizar estado local
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
                    ),
                }));

                // Salvar no IndexedDB
                await db.updateTaskOffline(id, updates);

                // Se estiver online, enviar para o servidor
                if (get().onlineStatus) {
                    try {
                        const { getSocket } = await import('@/lib/socket-client');
                        const socket = getSocket();
                        if (socket?.connected) {
                            socket.emit('update-task', { id, updates });
                            console.log('📤 Update enviado para o servidor');
                        }
                    } catch (error) {
                        console.error('Erro ao emitir update-task:', error);
                    }
                }
            },

            deleteTask: async (id) => {
                console.log('deleteTask chamado:', id);

                const taskToDelete = get().tasks.find(t => t.id === id);
                if (!taskToDelete) return;

                // Atualizar estado local
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                }));

                // Salvar no IndexedDB
                await db.deleteTaskOffline(id);

                // Se estiver online, enviar para o servidor
                if (get().onlineStatus) {
                    try {
                        const { getSocket } = await import('@/lib/socket-client');
                        const socket = getSocket();
                        if (socket?.connected) {
                            socket.emit('delete-task', id);
                            console.log('📤 Delete enviado para o servidor');
                        }
                    } catch (error) {
                        console.error('Erro ao emitir delete-task:', error);
                    }
                }
            },

            reorderTasks: async (tasks) => {
                if (!tasks || tasks.length === 0) return;
                await db.reorderTasksOffline(tasks);
                set({ tasks });

                if (get().onlineStatus) {
                    try {
                        const { getSocket } = await import('@/lib/socket-client');
                        const socket = getSocket();
                        if (socket?.connected) {
                            socket.emit('reorder-tasks', tasks);
                        }
                    } catch (error) {
                        console.error('Erro ao emitir reorder-tasks:', error);
                    }
                }
            },

            clearAllTasks: async () => {
                set({ tasks: [] });
                const allTasks = await db.getAllTasks();
                for (const task of allTasks) {
                    await db.deleteTaskOffline(task.id);
                }
                await db.clearSyncQueue();
            },

            // Project actions
            addProject: (project) => {
                const newProject = { ...project, createdAt: new Date(), updatedAt: new Date() };
                set((state) => ({ projects: [...state.projects, newProject] }));

                get().addActivityLog({
                    userId: 'system',
                    userName: 'System',
                    action: 'create',
                    projectId: newProject.id,
                    details: `Projeto "${newProject.name}" criado`,
                });
            },

            updateProject: (id, updates) => {
                set((state) => ({
                    projects: state.projects.map((project) =>
                        project.id === id ? { ...project, ...updates, updatedAt: new Date() } : project
                    ),
                }));
            },

            deleteProject: (id) => {
                const project = get().projects.find(p => p.id === id);
                if (project) {
                    get().addActivityLog({
                        userId: 'system',
                        userName: 'System',
                        action: 'delete',
                        projectId: id,
                        details: `Projeto "${project.name}" deletado`,
                    });
                }
                set((state) => ({
                    projects: state.projects.filter((project) => project.id !== id),
                    tasks: state.tasks.filter((task) => task.projectId !== id),
                }));
            },

            setCurrentProject: (id) => set({ currentProjectId: id }),

            getProjectsByUser: (userId) => {
                const user = get().users.find(u => u.id === userId);
                if (!user) return [];
                return get().projects.filter(p => p.members.includes(userId) || p.ownerId === userId);
            },

            // User actions
            addUser: (user) => {
                const newUser = { ...user, status: 'offline' as const, lastSeen: new Date() };
                set((state) => ({ users: [...state.users, newUser] }));
            },

            updateUser: (id, updates) => {
                set((state) => ({
                    users: state.users.map((user) =>
                        user.id === id ? { ...user, ...updates } : user
                    ),
                }));
            },

            deleteUser: (id) => {
                set((state) => ({
                    users: state.users.filter((user) => user.id !== id),
                    taskAssignments: state.taskAssignments.filter((a) => a.userId !== id),
                }));
            },

            setUserStatus: (id, status) => {
                set((state) => ({
                    users: state.users.map((user) =>
                        user.id === id ? { ...user, status, lastSeen: new Date() } : user
                    ),
                }));
            },

            // Team actions
            addTeam: (team) => {
                const newTeam = { ...team, createdAt: new Date() };
                set((state) => ({ teams: [...state.teams, newTeam] }));
            },

            updateTeam: (id, updates) => {
                set((state) => ({
                    teams: state.teams.map((team) =>
                        team.id === id ? { ...team, ...updates } : team
                    ),
                }));
            },

            deleteTeam: (id) => {
                set((state) => ({
                    teams: state.teams.filter((team) => team.id !== id),
                }));
            },

            addMemberToTeam: (teamId, userId) => {
                set((state) => ({
                    teams: state.teams.map((team) =>
                        team.id === teamId
                            ? { ...team, members: [...team.members, userId] }
                            : team
                    ),
                }));
            },

            removeMemberFromTeam: (teamId, userId) => {
                set((state) => ({
                    teams: state.teams.map((team) =>
                        team.id === teamId
                            ? { ...team, members: team.members.filter(m => m !== userId) }
                            : team
                    ),
                }));
            },

            // Assignment actions
            assignTask: (taskId, userId) => {
                const assignment: TaskAssignment = {
                    taskId,
                    userId,
                    assignedAt: new Date(),
                    assignedBy: 'system',
                };

                set((state) => ({
                    taskAssignments: [...state.taskAssignments, assignment],
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? { ...task, assignedTo: [...(task.assignedTo || []), userId] }
                            : task
                    ),
                }));

                const user = get().users.find(u => u.id === userId);
                const task = get().tasks.find(t => t.id === taskId);

                if (user && task) {
                    get().addActivityLog({
                        userId: 'system',
                        userName: 'System',
                        action: 'assign',
                        taskId,
                        taskTitle: task.title,
                        details: `Tarefa atribuída a ${user.name}`,
                    });
                }
            },

            unassignTask: (taskId, userId) => {
                set((state) => ({
                    taskAssignments: state.taskAssignments.filter(
                        (a) => !(a.taskId === taskId && a.userId === userId)
                    ),
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? { ...task, assignedTo: task.assignedTo?.filter(id => id !== userId) || [] }
                            : task
                    ),
                }));
            },

            getTasksByUser: (userId) => {
                return get().tasks.filter(task => task.assignedTo?.includes(userId));
            },

            // Activity actions
            addActivityLog: (log) => {
                const newLog: ActivityLog = {
                    ...log,
                    id: generateId(),
                    timestamp: new Date(),
                };
                set((state) => ({
                    activityLogs: [newLog, ...state.activityLogs].slice(0, 100), // Keep last 100 logs
                }));
            },

            getActivityByProject: (projectId) => {
                return get().activityLogs.filter(log => log.projectId === projectId);
            },

            getActivityByUser: (userId) => {
                return get().activityLogs.filter(log => log.userId === userId);
            },

            // Filter actions
            setSelectedUser: (userId) => set({ selectedUserId: userId }),

            getFilteredTasks: () => {
                const state = get();
                let filteredTasks = [...state.tasks];

                if (state.currentProjectId) {
                    filteredTasks = filteredTasks.filter(t => t.projectId === state.currentProjectId);
                }

                if (state.selectedUserId) {
                    filteredTasks = filteredTasks.filter(t => t.assignedTo?.includes(state.selectedUserId!));
                }

                return filteredTasks;
            },
        }),
        {
            name: 'kanban-storage',
            partialize: (state) => ({
                tasks: state.tasks,
                projects: state.projects,
                users: state.users,
                teams: state.teams,
                activityLogs: state.activityLogs.slice(0, 50),
                taskAssignments: state.taskAssignments,
            }),
        }
    )
);