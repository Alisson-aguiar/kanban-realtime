'use client';

import { useState, useRef } from 'react';
import { useKanbanStore, Project } from '@/store/useKanbanStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, FolderGit2, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PROJECT_COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

export const ProjectManager = () => {
    const { projects, addProject, updateProject, deleteProject, setCurrentProject, currentProjectId } = useKanbanStore();
    const [isOpen, setIsOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: PROJECT_COLORS[0],
    });

    // Refs para isolar eventos
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dialogContentRef = useRef<HTMLDivElement>(null);

    const handleOpenDialog = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
    };

    const handleCloseDialog = () => {
        setIsOpen(false);
        resetForm();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!formData.name.trim()) {
            toast.error('Nome do projeto é obrigatório');
            return;
        }

        if (editingProject) {
            updateProject(editingProject.id, {
                name: formData.name,
                description: formData.description,
                color: formData.color,
            });
            toast.success('Projeto atualizado!');
        } else {
            const newProject: Project = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: formData.name,
                description: formData.description,
                color: formData.color,
                createdAt: new Date(),
                updatedAt: new Date(),
                members: [],
                ownerId: 'current-user',
                isArchived: false,
            };
            addProject(newProject);
            toast.success(`Projeto "${formData.name}" criado!`);
        }

        handleCloseDialog();
    };

    const handleEdit = (e: React.MouseEvent, project: Project) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description,
            color: project.color,
        });
        setIsOpen(true);
    };

    const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm(`Deseja deletar o projeto "${name}"?`)) {
            deleteProject(id);
            if (currentProjectId === id) {
                setCurrentProject(null);
            }
            toast.success('Projeto deletado!');
        }
    };

    const resetForm = () => {
        setEditingProject(null);
        setFormData({
            name: '',
            description: '',
            color: PROJECT_COLORS[0],
        });
    };

    const handleProjectClick = (e: React.MouseEvent, projectId: string | null) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentProject(projectId);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Projetos
                </h3>
                <Button
                    ref={buttonRef}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={handleOpenDialog}
                    type="button"
                >
                    <Plus className="h-3 w-3 mr-1" />
                    Criar
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen} >
                <DialogContent
                    ref={dialogContentRef}
                    className="bg-slate-900 border-slate-700 p-8"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDownOutside={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle className="text-slate-100">
                            {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <Label className="text-slate-300">Nome do Projeto</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Desenvolvimento Mobile"
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-300">Descrição</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descrição do projeto"
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-300">Cor</Label>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {PROJECT_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color })}
                                        className={`w-8 h-8 rounded-full transition-all ${formData.color === color ? 'ring-2 ring-white scale-110' : ''
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" className=" text-red-500 bg-slate-900 hover:bg-slate-800" onClick={handleCloseDialog}>
                                Cancelar
                            </Button>
                            <Button type="submit" className='bg-slate-900 hover:bg-slate-800'>
                                {editingProject ? 'Atualizar' : 'Criar'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="space-y-1">
                <div
                    onClick={(e) => handleProjectClick(e, null)}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between group ${currentProjectId === null ? 'bg-slate-800' : 'hover:bg-slate-800'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <FolderGit2 className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-300">Todos Projetos</span>
                    </div>
                </div>

                {projects.filter(p => !p.isArchived).map((project) => (
                    <div
                        key={project.id}
                        className={`px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between group ${currentProjectId === project.id ? 'bg-slate-800' : 'hover:bg-slate-800'
                            }`}
                    >
                        <div
                            className="flex items-center gap-2 flex-1"
                            onClick={(e) => handleProjectClick(e, project.id)}
                        >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                            <span className="text-sm text-slate-300">{project.name}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                                onClick={(e) => handleEdit(e, project)}
                                className="p-1 hover:text-blue-400"
                            >
                                <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                                onClick={(e) => handleDelete(e, project.id, project.name)}
                                className="p-1 hover:text-red-400"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-xs">
                        Nenhum projeto. Clique em "Criar" para adicionar.
                    </div>
                )}
            </div>
        </div>
    );
};