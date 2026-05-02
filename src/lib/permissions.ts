import { User, Task } from '@/store/useKanbanStore';

export type Permission =
    | 'create_task'
    | 'edit_task'
    | 'delete_task'
    | 'move_task'
    | 'create_project'
    | 'edit_project'
    | 'delete_project'
    | 'manage_members'
    | 'view_all_tasks'
    | 'assign_tasks';

const rolePermissions: Record<string, Permission[]> = {
    admin: [
        'create_task', 'edit_task', 'delete_task', 'move_task',
        'create_project', 'edit_project', 'delete_project',
        'manage_members', 'view_all_tasks', 'assign_tasks'
    ],
    member: [
        'create_task', 'edit_task', 'delete_task', 'move_task',
        'assign_tasks'
    ],
    viewer: [
        'view_all_tasks'
    ]
};

export const hasPermission = (user: User | undefined, permission: Permission): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission);
};

export const canEditTask = (user: User | undefined, task: Task): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'member') return task.assignedTo?.includes(user.id) || false;
    return false;
};

export const canDeleteTask = (user: User | undefined, task: Task): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return false;
};