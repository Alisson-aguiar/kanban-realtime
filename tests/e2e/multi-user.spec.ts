import { test, expect } from '@playwright/test';

test.describe('Sincronização em Tempo Real', () => {
    test('deve sincronizar tarefas entre duas abas', async ({ browser }) => {
        // Criar duas abas
        const context = await browser.newContext();
        const page1 = await context.newPage();
        const page2 = await context.newPage();

        await page1.goto('/');
        await page2.goto('/');

        // Criar tarefa na primeira aba
        await page1.locator('text=+ Adicionar tarefa').first().click();
        await page1.fill('input[placeholder="Digite o título da tarefa"]', 'Tarefa Sincronizada');
        await page1.click('button:has-text("Criar Tarefa")');

        // Aguardar sincronização
        await page2.waitForTimeout(1000);

        // Verificar se apareceu na segunda aba
        await expect(page2.locator('text=Tarefa Sincronizada')).toBeVisible();

        // Deletar na segunda aba
        await page2.hover('text=Tarefa Sincronizada');
        await page2.click('button[aria-label="Delete"]');
        await page2.click('button:has-text("Excluir")');

        // Aguardar sincronização
        await page1.waitForTimeout(1000);

        // Verificar que sumiu da primeira aba
        await expect(page1.locator('text=Tarefa Sincronizada')).not.toBeVisible();
    });
});