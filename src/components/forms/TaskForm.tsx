'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useKanbanStore, Task } from '@/store/useKanbanStore';
import { generateId } from '@/lib/utils';
import toast from 'react-hot-toast';

const taskSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'done']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editTaskId?: string | null;
    defaultStatus?: 'todo' | 'in-progress' | 'done';
}

export const TaskForm = ({ open, onOpenChange, editTaskId, defaultStatus = 'todo' }: TaskFormProps) => {
    const { tasks, addTask, updateTask, onlineStatus } = useKanbanStore();
    const editTask = editTaskId ? tasks.find(t => t.id === editTaskId) : null;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            status: defaultStatus,
            priority: 'medium',
        },
    });

    useEffect(() => {
        if (editTask) {
            setValue('title', editTask.title);
            setValue('description', editTask.description || '');
            setValue('status', editTask.status);
            setValue('priority', editTask.priority || 'medium');
        } else {
            reset({
                title: '',
                description: '',
                status: defaultStatus,
                priority: 'medium',
            });
        }
    }, [editTask, setValue, reset, defaultStatus]);

    const onSubmit = async (data: TaskFormData) => {
        if (editTask) {
            await updateTask(editTask.id, {
                title: data.title,
                description: data.description || '',
                status: data.status,
                priority: data.priority,
                updatedAt: new Date(),
            });
            toast.success(onlineStatus ? 'Tarefa atualizada!' : 'Tarefa atualizada localmente!');
        } else {
            const newTask: Task = {
                id: generateId(),
                title: data.title,
                description: data.description || '',
                status: data.status,
                order: tasks.length,
                createdAt: new Date(),
                updatedAt: new Date(),
                syncStatus: 'pending',
                priority: data.priority,
                tags: [],
                assignedTo: [],
            };
            await addTask(newTask);
            toast.success(onlineStatus ? 'Tarefa criada!' : 'Tarefa salva localmente!');
        }

        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 p-8">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 text-xl font-semibold">
                        {editTask ? '✏️ Editar Tarefa' : '✨ Nova Tarefa'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label className="text-slate-300">Título *</Label>
                        <Input
                            {...register('title')}
                            placeholder="Digite o título"
                            className="bg-slate-800 border-slate-700 text-slate-100"
                            autoFocus
                        />
                        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <Label className="text-slate-300">Descrição</Label>
                        <Textarea
                            {...register('description')}
                            placeholder="Digite a descrição"
                            rows={3}
                            className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                    </div>
                    <div>
                        <Label className="text-slate-300">Prioridade</Label>
                        <select
                            {...register('priority')}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100"
                        >
                            <option value="low">🟢 Baixa</option>
                            <option value="medium">🟡 Média</option>
                            <option value="high">🟠 Alta</option>
                            <option value="urgent">🔴 Urgente</option>
                        </select>
                    </div>
                    <div>
                        <Label className="text-slate-300">Status</Label>
                        <select
                            {...register('status')}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100"
                        >
                            <option value="todo">📝 A Fazer</option>
                            <option value="in-progress">🔄 Em Progresso</option>
                            <option value="done">✅ Concluído</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" className='text-red-500 bg-slate-900 hover:bg-slate-800' onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className='bg-slate-900 hover:bg-slate-800' disabled={isSubmitting}>
                            {editTask ? 'Atualizar' : 'Criar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};