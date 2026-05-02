import { Server } from 'socket.io';

const io = new Server(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

console.log('🚀 WebSocket server running on port 3001');

let tasks: any[] = [];

io.on('connection', (socket) => {
    console.log('✅ Cliente conectado:', socket.id);

    // Enviar tarefas atuais
    socket.emit('initial-tasks', tasks);

    // Cliente solicitou tarefas
    socket.on('get-tasks', () => {
        socket.emit('tasks-update', tasks);
    });

    // Adicionar tarefa
    socket.on('add-task', (task) => {
        console.log('📝 Adicionar tarefa:', task.title);
        tasks.push(task);
        io.emit('tasks-update', tasks);
    });

    // Atualizar tarefa
    socket.on('update-task', ({ id, updates }) => {
        console.log('✏️ Atualizar tarefa:', id);
        const index = tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
            io.emit('tasks-update', tasks);
        }
    });

    // Deletar tarefa
    socket.on('delete-task', (id) => {
        console.log('🗑️ Deletar tarefa:', id);
        tasks = tasks.filter((t) => t.id !== id);
        io.emit('tasks-update', tasks);
    });

    // Reordenar tarefas
    socket.on('reorder-tasks', (newTasks) => {
        console.log('🔄 Reordenar tarefas');
        tasks = newTasks;
        io.emit('tasks-update', tasks);
    });

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado:', socket.id);
    });
});