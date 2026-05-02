import { messageQueue } from './socket-client';

interface BatchItem {
    id: string;
    type: 'add' | 'update' | 'delete' | 'reorder';
    data: any;
}

class BatchProcessor {
    private batch: Map<string, BatchItem> = new Map();
    private timeout: NodeJS.Timeout | null = null;
    private readonly BATCH_DELAY = 100; // 100ms
    private readonly MAX_BATCH_SIZE = 50;

    add(event: string, data: any) {
        // Determinar tipo e ID único
        let id: string;
        let type: BatchItem['type'];

        switch (event) {
            case 'add-task':
                id = data.id;
                type = 'add';
                break;
            case 'update-task':
                id = data.id;
                type = 'update';
                break;
            case 'delete-task':
                id = data;
                type = 'delete';
                break;
            case 'reorder-tasks':
                id = 'reorder';
                type = 'reorder';
                break;
            default:
                // Enviar imediatamente
                messageQueue.add(event, data);
                return;
        }

        // Acumular no batch
        this.batch.set(id, { id, type, data });

        // Se atingiu o máximo, enviar imediatamente
        if (this.batch.size >= this.MAX_BATCH_SIZE) {
            this.flush();
            return;
        }

        // Agendar flush
        if (!this.timeout) {
            this.timeout = setTimeout(() => this.flush(), this.BATCH_DELAY);
        }
    }

    private async flush() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        if (this.batch.size === 0) return;

        const batchItems = Array.from(this.batch.values());
        this.batch.clear();

        console.log(`📦 Processando batch com ${batchItems.length} operações`);

        // Agrupar por tipo
        const adds = batchItems.filter(i => i.type === 'add').map(i => i.data);
        const updates = batchItems.filter(i => i.type === 'update').map(i => i.data);
        const deletes = batchItems.filter(i => i.type === 'delete').map(i => i.data);
        const reorders = batchItems.filter(i => i.type === 'reorder').map(i => i.data);

        // Enviar cada grupo como um lote
        const promises = [];

        if (adds.length > 0) {
            promises.push(messageQueue.add('batch-add', adds));
        }
        if (updates.length > 0) {
            promises.push(messageQueue.add('batch-update', updates));
        }
        if (deletes.length > 0) {
            promises.push(messageQueue.add('batch-delete', deletes));
        }
        if (reorders.length > 0 && reorders[0]) {
            promises.push(messageQueue.add('reorder-tasks', reorders[0]));
        }

        await Promise.all(promises);
    }

    // Forçar flush imediato
    async flushNow() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        await this.flush();
    }
}

export const batchProcessor = new BatchProcessor();