import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Limpar após cada teste
afterEach(() => {
    cleanup();
});

// Mock do IndexedDB
const indexedDB = {
    open: vi.fn(),
    deleteDatabase: vi.fn(),
};

global.indexedDB = indexedDB as any;

// Mock do localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock do WebSocket
class MockWebSocket {
    onopen: (() => void) | null = null;
    onmessage: ((event: any) => void) | null = null;
    onclose: (() => void) | null = null;
    onerror: ((error: any) => void) | null = null;
    send = vi.fn();
    close = vi.fn();
}

global.WebSocket = MockWebSocket as any;