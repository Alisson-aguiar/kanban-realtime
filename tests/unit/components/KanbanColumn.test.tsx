import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';

// Mock do useSortable
vi.mock('@dnd-kit/sortable', () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false,
    }),
}));

describe('KanbanColumn', () => {
    const mockColumn = {
        id: 'todo',
        title: '📝 A Fazer',
        color: 'from-blue-500',
        bgColor: 'bg-blue-500/5',
        borderColor: 'border-blue-500/20',
        textColor: 'text-blue-400',
    };

    it('deve renderizar o título da coluna', () => {
        render(<KanbanColumn column={mockColumn} tasks={[]} />);

        expect(screen.getByText('📝 A Fazer')).toBeDefined();
    });

    it('deve mostrar "Nenhuma tarefa" quando não há tarefas', () => {
        render(<KanbanColumn column={mockColumn} tasks={[]} />);

        expect(screen.getByText('Nenhuma tarefa')).toBeDefined();
    });
});