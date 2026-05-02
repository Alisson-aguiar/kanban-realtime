const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

// Arquivo para persistência das tarefas
const TASKS_FILE = path.join(__dirname, 'tasks-backup.json');

// Funções para persistência
function loadTasks() {
    try {
        if (fs.existsSync(TASKS_FILE)) {
            const data = fs.readFileSync(TASKS_FILE, 'utf8');
            const loaded = JSON.parse(data);
            console.log(`📀 Carregadas ${loaded.length} tarefas do arquivo`);
            return loaded;
        }
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
    return [];
}

function saveTasks() {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
        console.log(`💾 ${tasks.length} tarefas salvas no arquivo`);
    } catch (error) {
        console.error('Erro ao salvar tarefas:', error);
    }
}

// Carregar tarefas existentes
let tasks = loadTasks();

const io = new Server(3001, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:3003"],
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true,
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
});

console.log('🚀 Servidor WebSocket rodando na porta 3001');
console.log(`📁 Arquivo de persistência: ${TASKS_FILE}`);
console.log(`💾 Tarefas iniciais: ${tasks.length}`);

// Métricas do servidor
const metrics = {
    connections: 0,
    totalConnections: 0,
    messagesReceived: 0,
    messagesSent: 0,
    errors: 0,
    startTime: Date.now(),
};

io.on('connection', (socket) => {
    metrics.connections++;
    metrics.totalConnections++;

    console.log(`✅ Cliente conectado: ${socket.id}`);
    console.log(`📊 Conexões ativas: ${metrics.connections}`);
    console.log(`💾 Tarefas atuais: ${tasks.length}`);

    // Enviar heartbeat
    const heartbeatInterval = setInterval(() => {
        if (socket.connected) {
            socket.emit('heartbeat', { timestamp: Date.now() });
        }
    }, 30000);

    // Enviar tarefas atuais para o novo cliente
    socket.emit('initial-tasks', tasks);
    console.log(`📦 Enviado estado inicial com ${tasks.length} tarefas para ${socket.id}`);

    // Cliente solicitou tarefas
    socket.on('get-tasks', (callback) => {
        metrics.messagesReceived++;
        console.log(`📋 Cliente ${socket.id} solicitou tarefas`);

        if (callback && typeof callback === 'function') {
            callback({ success: true, tasks });
        } else {
            socket.emit('tasks-update', tasks);
        }
        metrics.messagesSent++;
    });

    // Adicionar tarefa
    socket.on('add-task', (task, callback) => {
        metrics.messagesReceived++;
        console.log(`📝 [${socket.id}] Tarefa adicionada: ${task?.title || 'unknown'}`);

        if (!task || !task.id) {
            console.log('⚠️ Tarefa inválida recebida');
            if (callback && typeof callback === 'function') {
                callback({ success: false, error: 'Invalid task' });
            }
            return;
        }

        // Garantir que a tarefa tem todos os campos necessários
        const newTask = {
            ...task,
            createdAt: task.createdAt || new Date(),
            updatedAt: new Date(),
            syncStatus: 'synced'
        };

        tasks.push(newTask);
        saveTasks();

        // Broadcast para todos os clientes
        io.emit('tasks-update', tasks);
        metrics.messagesSent += io.engine.clientsCount;

        if (callback && typeof callback === 'function') {
            callback({ success: true, taskId: newTask.id });
        }

        console.log(`📊 Total de tarefas: ${tasks.length}`);
    });

    // Atualizar tarefa
    socket.on('update-task', ({ id, updates }, callback) => {
        metrics.messagesReceived++;
        console.log(`✏️ [${socket.id}] Tarefa atualizada: ${id}`);

        if (!id) {
            console.log('⚠️ ID da tarefa não fornecido');
            if (callback && typeof callback === 'function') {
                callback({ success: false, error: 'Task id required' });
            }
            return;
        }

        const index = tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
            tasks[index] = {
                ...tasks[index],
                ...updates,
                updatedAt: new Date(),
                syncStatus: 'synced'
            };
            saveTasks();

            io.emit('tasks-update', tasks);
            metrics.messagesSent += io.engine.clientsCount;

            if (callback && typeof callback === 'function') {
                callback({ success: true });
            }
            console.log(`✅ Tarefa ${id} atualizada com sucesso`);
        } else {
            console.log(`⚠️ Tarefa ${id} não encontrada`);
            if (callback && typeof callback === 'function') {
                callback({ success: false, error: 'Task not found' });
            }
        }
    });

    // Deletar tarefa
    socket.on('delete-task', (id, callback) => {
        metrics.messagesReceived++;
        console.log(`🗑️ [${socket.id}] Tarefa deletada: ${id}`);

        if (!id) {
            console.log('⚠️ ID da tarefa não fornecido');
            if (callback && typeof callback === 'function') {
                callback({ success: false, error: 'Task id required' });
            }
            return;
        }

        const before = tasks.length;
        tasks = tasks.filter((t) => t.id !== id);

        if (before !== tasks.length) {
            saveTasks();
            io.emit('tasks-update', tasks);
            metrics.messagesSent += io.engine.clientsCount;

            if (callback && typeof callback === 'function') {
                callback({ success: true, deleted: before - tasks.length });
            }
            console.log(`✅ Tarefa ${id} deletada. Restam: ${tasks.length}`);
        } else {
            console.log(`⚠️ Tarefa ${id} não encontrada para deletar`);
            if (callback && typeof callback === 'function') {
                callback({ success: false, error: 'Task not found' });
            }
        }
    });

    // Reordenar tarefas - CORRIGIDO com verificação de array
    socket.on('reorder-tasks', (newTasks, callback) => {
        metrics.messagesReceived++;
        console.log(`🔄 [${socket.id}] Tarefas reordenadas`);

        // Verificar se newTasks é um array
        if (!Array.isArray(newTasks)) {
            console.log(`⚠️ Dados inválidos para reorder: ${typeof newTasks}`);
            if (callback && typeof callback === 'function') {
                callback({ success: false, error: 'Invalid data format, expected array' });
            }
            return;
        }

        if (newTasks.length === 0) {
            console.log(`⚠️ Array vazio recebido para reorder`);
            if (callback && typeof callback === 'function') {
                callback({ success: false, error: 'Empty array' });
            }
            return;
        }

        tasks = newTasks.map(task => ({
            ...task,
            updatedAt: new Date()
        }));
        saveTasks();

        io.emit('tasks-update', tasks);
        metrics.messagesSent += io.engine.clientsCount;

        if (callback && typeof callback === 'function') {
            callback({ success: true });
        }
        console.log(`✅ Nova ordem salva com ${tasks.length} tarefas`);
    });

    // Batch operations
    socket.on('batch-add', (newTasks, callback) => {
        metrics.messagesReceived++;

        if (!Array.isArray(newTasks)) {
            console.log(`⚠️ Batch add: dados inválidos`);
            if (callback && typeof callback === 'function') {
                callback({ success: false, error: 'Invalid data format' });
            }
            return;
        }

        console.log(`📦 Batch add recebido: ${newTasks.length} tarefas`);

        newTasks.forEach(task => {
            if (task && task.id) {
                tasks.push({
                    ...task,
                    createdAt: task.createdAt || new Date(),
                    updatedAt: new Date(),
                    syncStatus: 'synced'
                });
            }
        });
        saveTasks();
        io.emit('tasks-update', tasks);

        if (callback && typeof callback === 'function') {
            callback({ success: true, count: newTasks.length });
        }
        console.log(`✅ Batch add: ${tasks.length} tarefas no total`);
    });

    socket.on('batch-update', (updates, callback) => {
        metrics.messagesReceived++;

        if (!Array.isArray(updates)) {
            console.log(`⚠️ Batch update: dados inválidos`);
            if (callback && typeof callback === 'function') {
                callback({ success: false, error: 'Invalid data format' });
            }
            return;
        }

        console.log(`📦 Batch update recebido: ${updates.length} atualizações`);

        updates.forEach(({ id, updates: taskUpdates }) => {
            if (id) {
                const index = tasks.findIndex((t) => t.id === id);
                if (index !== -1) {
                    tasks[index] = {
                        ...tasks[index],
                        ...taskUpdates,
                        updatedAt: new Date(),
                        syncStatus: 'synced'
                    };
                }
            }
        });
        saveTasks();
        io.emit('tasks-update', tasks);

        if (callback && typeof callback === 'function') {
            callback({ success: true });
        }
        console.log(`✅ Batch update concluído`);
    });

    socket.on('batch-delete', (ids, callback) => {
        metrics.messagesReceived++;

        if (!Array.isArray(ids)) {
            console.log(`⚠️ Batch delete: dados inválidos`);
            if (callback && typeof callback === 'function') {
                callback({ success: false, error: 'Invalid data format' });
            }
            return;
        }

        console.log(`📦 Batch delete recebido: ${ids.length} exclusões`);

        tasks = tasks.filter((t) => !ids.includes(t.id));
        saveTasks();
        io.emit('tasks-update', tasks);

        if (callback && typeof callback === 'function') {
            callback({ success: true, count: ids.length });
        }
        console.log(`✅ Batch delete: ${tasks.length} tarefas restantes`);
    });

    // Resposta ao heartbeat do cliente
    socket.on('pong', (data) => {
        const latency = Date.now() - data.timestamp;
        if (latency > 1000) {
            console.log(`⚠️ Latência alta no cliente ${socket.id}: ${latency}ms`);
        }
    });

    // Disconnect
    socket.on('disconnect', (reason) => {
        clearInterval(heartbeatInterval);
        metrics.connections--;
        console.log(`❌ Cliente desconectado: ${socket.id}`);
        console.log(`📊 Motivo: ${reason}`);
        console.log(`📊 Conexões ativas: ${metrics.connections}`);
    });

    // Error handling
    socket.on('error', (error) => {
        metrics.errors++;
        console.error(`💥 Erro no cliente ${socket.id}:`, error.message);
    });
});

// Relatório de métricas a cada minuto
setInterval(() => {
    const uptime = Math.floor((Date.now() - metrics.startTime) / 1000);
    console.log('\n📊 === MÉTRICAS WEBSOCKET ===');
    console.log(`⏱️ Uptime: ${Math.floor(uptime / 60)}m ${uptime % 60}s`);
    console.log(`🔌 Conexões ativas: ${metrics.connections}`);
    console.log(`📈 Total de conexões: ${metrics.totalConnections}`);
    console.log(`📨 Mensagens recebidas: ${metrics.messagesReceived}`);
    console.log(`📤 Mensagens enviadas: ${metrics.messagesSent}`);
    console.log(`⚠️ Erros: ${metrics.errors}`);
    console.log(`💾 Tarefas em memória: ${tasks.length}`);
    console.log('=============================\n');
}, 60000);

// Salvar tarefas a cada 30 segundos (backup adicional)
setInterval(() => {
    if (tasks.length > 0) {
        saveTasks();
    }
}, 30000);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Salvando tarefas antes de desligar...');
    saveTasks();
    console.log('✅ Tarefas salvas com sucesso');
    io.close(() => {
        console.log('✅ Servidor desligado com sucesso');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Recebido SIGTERM, salvando tarefas...');
    saveTasks();
    io.close(() => {
        console.log('✅ Servidor desligado');
        process.exit(0);
    });
});