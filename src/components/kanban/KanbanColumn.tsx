'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/store/useKanbanStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Edit2, GripVertical, Calendar, Plus, XCircle, AlertCircle, AlertTriangle, Circle } from 'lucide-react';
import { TaskForm } from '@/components/forms/TaskForm';
import { useKanbanStore } from '@/store/useKanbanStore';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface KanbanColumnProps {
    column: {
        id: string;
        title: string;
        color: string;
        bgColor: string;
        borderColor: string;
        textColor: string;
    };
    tasks: Task[];
}

export const KanbanColumn = ({ column, tasks }: KanbanColumnProps) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const { deleteTask, onlineStatus } = useKanbanStore();

    const handleEdit = (taskId: string) => {
        console.log('📝 Editando tarefa:', taskId);
        setEditingTaskId(taskId);
        setIsFormOpen(true);
    };

    const handleDelete = (taskId: string, taskTitle: string) => {
        console.log('🗑️ Deletando tarefa:', taskId);

        if (window.confirm(`Tem certeza que deseja excluir a tarefa "${taskTitle}"?`)) {
            deleteTask(taskId);
            if (onlineStatus) {
                toast.success('Tarefa excluída!');
            } else {
                toast.success('Tarefa excluída localmente!');
            }
        }
    };

    const handleDeleteAllFromColumn = () => {
        const tasksToDelete = tasks;
        if (tasksToDelete.length === 0) {
            toast.error(`Nenhuma tarefa na coluna "${column.title}"`);
            return;
        }

        if (window.confirm(`Tem certeza que deseja excluir TODAS as ${tasksToDelete.length} tarefas da coluna "${column.title}"?`)) {
            tasksToDelete.forEach(task => {
                deleteTask(task.id);
            });
            toast.success(`${tasksToDelete.length} tarefas excluídas da coluna "${column.title}"!`);
        }
    };

    const handleAdd = () => {
        setEditingTaskId(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTaskId(null);
    };

    return (
        <>
            <div className={`flex-shrink-0 w-96 ${column.bgColor} rounded-xl border ${column.borderColor} backdrop-blur-sm p-4`}>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${column.color}`} />
                        <h2 className="font-semibold text-slate-200">
                            {column.title}
                            <span className="ml-2 text-sm text-slate-500">({tasks.length})</span>
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeleteAllFromColumn}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title={`Excluir todas as tarefas da coluna ${column.title}`}
                    >
                        <XCircle className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto">
                    {tasks.map((task) => (
                        <KanbanCard
                            key={task.id}
                            task={task}
                            onEdit={() => handleEdit(task.id)}
                            onDelete={() => handleDelete(task.id, task.title)}
                        />
                    ))}

                    {tasks.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-sm text-slate-500">Nenhuma tarefa</p>
                            <p className="text-xs text-slate-600 mt-1">Clique em + para adicionar</p>
                        </div>
                    )}
                </div>

                <Button
                    className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300"
                    
                    onClick={handleAdd}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar tarefa
                </Button>
            </div>

            <TaskForm
                open={isFormOpen}
                onOpenChange={handleCloseForm}
                editTaskId={editingTaskId}
                defaultStatus={column.id as 'todo' | 'in-progress' | 'done'}
            />
        </>
    );
};

interface KanbanCardProps {
    task: Task;
    onEdit: () => void;
    onDelete: () => void;
}

const KanbanCard = ({ task, onEdit, onDelete }: KanbanCardProps) => {
    const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        disabled: isDraggingDisabled,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Configurações de prioridade
    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return {
                    icon: <AlertCircle className="h-3 w-3" />,
                    text: 'Urgente',
                    bg: 'bg-red-500/20',
                    textColor: 'text-red-400',
                    borderColor: 'border-red-500/30'
                };
            case 'high':
                return {
                    icon: <AlertTriangle className="h-3 w-3" />,
                    text: 'Alta',
                    bg: 'bg-orange-500/20',
                    textColor: 'text-orange-400',
                    borderColor: 'border-orange-500/30'
                };
            case 'medium':
                return {
                    icon: <AlertTriangle className="h-3 w-3" />,
                    text: 'Média',
                    bg: 'bg-yellow-500/20',
                    textColor: 'text-yellow-400',
                    borderColor: 'border-yellow-500/30'
                };
            case 'low':
                return {
                    icon: <Circle className="h-3 w-3" />,
                    text: 'Baixa',
                    bg: 'bg-green-500/20',
                    textColor: 'text-green-400',
                    borderColor: 'border-green-500/30'
                };
            default:
                return {
                    icon: <Circle className="h-3 w-3" />,
                    text: 'Média',
                    bg: 'bg-slate-500/20',
                    textColor: 'text-slate-400',
                    borderColor: 'border-slate-500/30'
                };
        }
    };

    const priorityConfig = getPriorityConfig(task.priority || 'medium');

    const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('✏️ Edit clicked for:', task.id);
        onEdit();
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🗑️ Delete clicked for:', task.id);
        onDelete();
    };

    const handleMouseEnter = () => {
        setIsDraggingDisabled(true);
    };

    const handleMouseLeave = () => {
        setIsDraggingDisabled(false);
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card
                {...attributes}
                {...listeners}
                className="group bg-slate-800/90 border-slate-700 hover:border-slate-600 transition-all cursor-grab active:cursor-grabbing"
            >
                <div className="p-3">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-start gap-2">
                                <GripVertical className="h-4 w-4 text-slate-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex-1">
                                    {/* Badge de Prioridade */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${priorityConfig.bg} ${priorityConfig.textColor} ${priorityConfig.borderColor} border`}>
                                            {priorityConfig.icon}
                                            {priorityConfig.text}
                                        </span>
                                    </div>

                                    <h3 className="font-medium text-slate-200 text-sm mb-1">{task.title}</h3>

                                    {task.description && (
                                        <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
                                    )}

                                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(task.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="flex gap-1"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                onClick={handleEditClick}
                                className="p-1.5 rounded-md text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                                aria-label="Editar"
                                type="button"
                            >
                                <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                                aria-label="Excluir"
                                type="button"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};