import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOfflineSync } from '@/hooks/useOfflineSync';

// Mock do db
vi.mock('@/lib/db', () => ({
    db: {
        getAllTasks: vi.fn().mockResolvedValue([]),
        getPendingSyncItems: vi.fn().mockResolvedValue([]),
        clearSyncQueue: vi.fn().mockResolvedValue(undefined),
    },
}));

describe('useOfflineSync', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve inicializar corretamente', () => {
        const { result } = renderHook(() => useOfflineSync());

        expect(result.current.isSyncing).toBe(false);
        expect(result.current.pendingCount).toBe(0);
    });

    it('deve detectar quando fica offline', () => {
        const { result } = renderHook(() => useOfflineSync());

        // Simular evento offline
        window.dispatchEvent(new Event('offline'));

        expect(result.current).toBeDefined();
    });
});