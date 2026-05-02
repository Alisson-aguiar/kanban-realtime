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
    members: string[]; // IDs dos usuários
    ownerId: string;
    isArchived: boolean;
}

export interface Team {
    id: string;
    name: string;
    description: string;
    members: User[];
    projects: string[]; // IDs dos projetos
    createdAt: Date;
}

export interface TaskAssignment {
    taskId: string;
    userId: string;
    assignedAt: Date;
    assignedBy: string;
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