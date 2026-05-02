'use client';

import { DndContext, DragEndEvent, closestCorners, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useKanbanStore, Task } from '@/store/useKanbanStore';
import { KanbanColumn } from './KanbanColumn';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLUMNS = [
    { id: 'todo', title: '📝 A Fazer', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/5', borderColor: 'border-blue-500/20', textColor: 'text-blue-400' },
    { id: 'in-progress', title: '🔄 Em Progresso', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-500/5', borderColor: 'border-yellow-500/20', textColor: 'text-yellow-400' },
    { id: 'done', title: '✅ Concluído', color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/5', borderColor: 'border-green-500/20', textColor: 'text-green-400' },
];

export const KanbanBoard = () => {
    const { getFilteredTasks, updateTask, reorderTasks, currentProjectId, selectedUserId, projects, users } = useKanbanStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    const filteredTasks = getFilteredTasks();

    const getActiveFilterName = () => {
        if (currentProjectId) {
            const project = projects.find((p: any) => p.id === currentProjectId);
            return `Projeto: ${project?.name}`;
        }
        if (selectedUserId) {
            const user = users.find((u: any) => u.id === selectedUserId);
            return `Responsável: ${user?.name}`;
        }
        return null;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = filteredTasks.find((t: Task) => t.id === activeId);
        if (!activeTask) return;

        if (COLUMNS.some((col) => col.id === overId)) {
            updateTask(activeId, { status: overId as Task['status'] });
        } else if (activeId !== overId) {
            const oldIndex = filteredTasks.findIndex((t: Task) => t.id === activeId);
            const newIndex = filteredTasks.findIndex((t: Task) => t.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reordered = [...filteredTasks];
                reordered.splice(oldIndex, 1);
                reordered.splice(newIndex, 0, activeTask);
                reorderTasks(reordered);
            }
        }
    };

    const activeTask = activeId ? filteredTasks.find((t: Task) => t.id === activeId) : null;
    const activeFilter = getActiveFilterName();

    return (
        <div>
            {activeFilter && (
                <div className="mb-4 flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-slate-300">Filtrando por:</span>
                        <span className="text-sm font-medium text-blue-400">{activeFilter}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            useKanbanStore.getState().setCurrentProject(null);
                            useKanbanStore.getState().setSelectedUser(null);
                        }}
                        className="h-6 px-2 text-slate-400 hover:text-red-400"
                    >
                        <X className="h-3 w-3 mr-1" />
                        Limpar
                    </Button>
                </div>
            )}

            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-6 min-h-[calc(100vh-8rem)]">
                    {COLUMNS.map((column) => (
                        <SortableContext
                            key={column.id}
                            items={filteredTasks.filter((t: Task) => t.status === column.id).map((t: Task) => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <KanbanColumn
                                column={column}
                                tasks={filteredTasks.filter((t: Task) => t.status === column.id)}
                            />
                        </SortableContext>
                    ))}
                </div>
                <DragOverlay>
                    {activeTask && (
                        <Card className="p-4 w-96 bg-slate-800 border-slate-700 shadow-2xl">
                            <h3 className="font-medium text-slate-200">{activeTask.title}</h3>
                        </Card>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
};