import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Queue de mensagens para retry
interface QueuedMessage {
    id: string;
    event: string;
    data: any;
    retries: number;
    timestamp: number;
    resolve?: (value: any) => void;
    reject?: (reason?: any) => void;
}

class MessageQueue {
    private queue: QueuedMessage[] = [];
    private processing = false;
    private rateLimitCount = 0;
    private lastRateLimitReset = Date.now();

    async add(event: string, data: any): Promise<any> {
        // Rate limiting client-side
        const now = Date.now();
        if (now - this.lastRateLimitReset > 1000) {
            this.rateLimitCount = 0;
            this.lastRateLimitReset = now;
        }

        if (this.rateLimitCount >= 10) {
            console.warn('Rate limit atingido, aguardando...');
            await this.delay(1000);
            this.rateLimitCount = 0;
        }

        this.rateLimitCount++;

        return new Promise((resolve, reject) => {
            const message: QueuedMessage = {
                id: crypto.randomUUID(),
                event,
                data,
                retries: 0,
                timestamp: Date.now(),
                resolve,
                reject,
            };

            this.queue.push(message);
            this.process();
        });
    }

    private async process() {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const message = this.queue[0];

            try {
                const result = await this.sendWithRetry(message);
                message.resolve?.(result);
                this.queue.shift();
            } catch (error) {
                console.error(`Erro na mensagem ${message.id}:`, error);

                if (message.retries >= 3) {
                    console.error(`Falha após 3 tentativas:`, message);
                    message.reject?.(error);
                    this.queue.shift();
                } else {
                    message.retries++;
                    const delayMs = Math.pow(2, message.retries) * 1000;
                    console.log(`Re-tentativa ${message.retries}/3 em ${delayMs}ms`);
                    await this.delay(delayMs);
                }
            }
        }

        this.processing = false;
    }

    private async sendWithRetry(message: QueuedMessage): Promise<any> {
        const currentSocket = getSocket();

        if (!currentSocket?.connected) {
            throw new Error('Socket não conectado');
        }

        return new Promise((resolve, reject) => {
            // Usar callback do Socket.io ao invés de timeout
            currentSocket.emit(message.event, message.data, (response: any) => {
                if (response?.error) {
                    reject(new Error(response.error));
                } else {
                    resolve(response);
                }
            });

            // Timeout maior para operações lentas
            setTimeout(() => {
                reject(new Error('Timeout após 30 segundos'));
            }, 30000);
        });
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getQueueSize(): number {
        return this.queue.length;
    }
}

export const messageQueue = new MessageQueue();

export const getSocket = () => {
    if (!socket) {
        try {
            socket = io('http://localhost:3001', {
                transports: ['websocket', 'polling'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
            });

            // Heartbeat handling
            let lastHeartbeat = Date.now();
            let heartbeatInterval: NodeJS.Timeout;

            socket.on('connect', () => {
                console.log('✅ Conectado ao WebSocket');
                lastHeartbeat = Date.now();

                heartbeatInterval = setInterval(() => {
                    if (socket?.connected) {
                        const now = Date.now();
                        const latency = now - lastHeartbeat;

                        if (latency > 45000) {
                            console.warn('⚠️ Heartbeat timeout, reconectando...');
                            socket?.disconnect();
                            socket?.connect();
                        }
                    }
                }, 10000);
            });

            socket.on('heartbeat', (data: { timestamp: number }) => {
                lastHeartbeat = Date.now();
                socket?.emit('pong', { timestamp: lastHeartbeat });
            });

            socket.on('connect_error', (error) => {
                console.error('❌ Erro de conexão WebSocket:', error.message);
            });

            socket.on('disconnect', (reason) => {
                console.log('🔌 Desconectado do WebSocket:', reason);
                if (heartbeatInterval) clearInterval(heartbeatInterval);
            });

            socket.on('connect', () => {
                const transport = socket?.io?.engine?.transport?.name;
                console.log(`📡 Transporte: ${transport}`);
            });

        } catch (error) {
            console.error('Erro ao criar socket:', error);
        }
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocketMetrics = () => ({
    connected: socket?.connected || false,
    queueSize: messageQueue.getQueueSize(),
    id: socket?.id,
});