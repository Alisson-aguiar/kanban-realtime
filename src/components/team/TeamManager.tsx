'use client';

import { useState, useRef } from 'react';
import { useKanbanStore, User } from '@/store/useKanbanStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Users, UserCircle, Circle, CircleCheck, Mail, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AVATAR_COLORS = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

export const TeamManager = () => {
    const { users, addUser, updateUser, deleteUser, setUserStatus, selectedUserId, setSelectedUser } = useKanbanStore();
    const [isOpen, setIsOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'member' as 'admin' | 'member' | 'viewer',
    });

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

        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error('Nome e email são obrigatórios');
            return;
        }

        if (editingUser) {
            updateUser(editingUser.id, {
                name: formData.name,
                email: formData.email,
                role: formData.role,
            });
            toast.success('Membro atualizado!');
        } else {
            const newUser: User = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: 'offline',
                lastSeen: new Date(),
            };
            addUser(newUser);
            toast.success('Membro adicionado!');
        }

        handleCloseDialog();
    };

    const handleEdit = (e: React.MouseEvent, user: User) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        setIsOpen(true);
    };

    const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm(`Deseja remover "${name}" da equipe?`)) {
            deleteUser(id);
            if (selectedUserId === id) {
                setSelectedUser(null);
            }
            toast.success('Membro removido!');
        }
    };

    const handleStatusToggle = (e: React.MouseEvent, id: string, currentStatus: User['status']) => {
        e.preventDefault();
        e.stopPropagation();
        const newStatus = currentStatus === 'online' ? 'away' : 'online';
        setUserStatus(id, newStatus);
    };

    const handleSelectUser = (e: React.MouseEvent, userId: string | null) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedUser(userId);
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            role: 'member',
        });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getAvatarColor = (id: string) => {
        const index = id.length % AVATAR_COLORS.length;
        return AVATAR_COLORS[index];
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Admin</span>;
            case 'viewer':
                return <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">Visualizador</span>;
            default:
                return <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Membro</span>;
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Equipe
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
                    Adicionar
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                            {editingUser ? 'Editar Membro' : 'Adicionar Membro'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <Label className="text-slate-300">Nome</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nome completo"
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-300">Email</Label>
                            <Input
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@exemplo.com"
                                className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-300">Função</Label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'member' | 'viewer' })}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100"
                            >
                                <option value="admin">Administrador</option>
                                <option value="member">Membro</option>
                                <option value="viewer">Visualizador</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" className='text-red-500 bg-slate-900 hover:bg-slate-800' onClick={handleCloseDialog}>
                                Cancelar
                            </Button>
                            <Button type="submit" className='bg-slate-900 hover:bg-slate-800'>
                                {editingUser ? 'Atualizar' : 'Adicionar'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="space-y-2">
                <div
                    onClick={(e) => handleSelectUser(e, null)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedUserId === null ? 'bg-slate-800' : 'hover:bg-slate-800'
                        }`}
                >
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Todos os membros</span>
                </div>

                {users.map((user) => (
                    <div
                        key={user.id}
                        className={`px-3 py-2 rounded-lg cursor-pointer transition-colors group ${selectedUserId === user.id ? 'bg-slate-800' : 'hover:bg-slate-800'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className="flex items-center gap-2 flex-1"
                                onClick={(e) => handleSelectUser(e, user.id)}
                            >
                                <div className={`w-8 h-8 rounded-full ${getAvatarColor(user.id)} flex items-center justify-center text-white text-xs font-medium`}>
                                    {getInitials(user.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm text-slate-200 truncate">{user.name}</span>
                                        {getRoleBadge(user.role)}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => handleStatusToggle(e, user.id, user.status)}
                                    className="p-1 hover:text-green-400"
                                    title={user.status === 'online' ? 'Marcar como ausente' : 'Marcar como online'}
                                >
                                    {user.status === 'online' ? (
                                        <CircleCheck className="h-4 w-4 text-green-400" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-yellow-400" />
                                    )}
                                </button>
                                <button
                                    onClick={(e) => handleEdit(e, user)}
                                    className="p-1 hover:text-blue-400"
                                >
                                    <Edit2 className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, user.id, user.name)}
                                    className="p-1 hover:text-red-400"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {users.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        <UserCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhum membro na equipe</p>
                        <p className="text-xs mt-1">Clique em "Adicionar" para incluir</p>
                    </div>
                )}
            </div>
        </div>
    );
};