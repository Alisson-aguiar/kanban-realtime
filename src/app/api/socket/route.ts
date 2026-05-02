import { NextResponse } from 'next/server';
import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiResponse } from 'next';

export const dynamic = 'force-dynamic';

let io: SocketServer | null = null;

export async function GET(req: Request) {
    // Verificar se já existe uma instância do Socket.io
    if (io) {
        return NextResponse.json({ message: 'Socket.io already running' });
    }

    // Criar servidor Socket.io
    const httpServer = new HTTPServer();
    io = new SocketServer(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    // Armazenamento em memória das tarefas (em produção, use banco de dados)
    let tasks: any[] = [];

    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        // Enviar tarefas atuais para o cliente recém-conectado
        socket.emit('initial-tasks', tasks);

        // Cliente solicitou todas as tarefas
        socket.on('get-tasks', () => {
            socket.emit('tasks-update', tasks);
        });

        // Cliente adicionou uma nova tarefa
        socket.on('add-task', (task) => {
            console.log('Nova tarefa:', task);
            tasks.push(task);
            // Broadcast para todos os clientes
            io?.emit('tasks-update', tasks);
        });

        // Cliente atualizou uma tarefa
        socket.on('update-task', ({ id, updates }) => {
            console.log('Atualizar tarefa:', id, updates);
            const index = tasks.findIndex((t) => t.id === id);
            if (index !== -1) {
                tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
                io?.emit('tasks-update', tasks);
            }
        });

        // Cliente removeu uma tarefa
        socket.on('delete-task', (id) => {
            console.log('Remover tarefa:', id);
            tasks = tasks.filter((t) => t.id !== id);
            io?.emit('tasks-update', tasks);
        });

        // Cliente reordenou as tarefas
        socket.on('reorder-tasks', (newTasks) => {
            console.log('Reorder tarefas');
            tasks = newTasks;
            io?.emit('tasks-update', tasks);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });

    // Iniciar servidor
    httpServer.listen(3001, () => {
        console.log('Socket.io server running on port 3001');
    });

    return NextResponse.json({ message: 'Socket.io server started' });
}