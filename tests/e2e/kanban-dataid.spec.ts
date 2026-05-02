import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E com data-testid', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('deve criar uma nova tarefa', async ({ page }) => {
        // Clicar no botão de adicionar tarefa da coluna A Fazer
        await page.click('[data-testid="add-task-todo"]');

        // Preencher o formulário
        await page.fill('input[placeholder="Digite o título da tarefa"]', 'Nova Tarefa E2E');
        await page.fill('textarea[placeholder="Digite a descrição"]', 'Descrição da tarefa de teste');

        // Clicar em Criar
        await page.click('button:has-text("Criar Tarefa")');

        // Verificar se a tarefa apareceu
        await expect(page.locator('text=Nova Tarefa E2E')).toBeVisible();
    });

    test('deve editar uma tarefa', async ({ page }) => {
        // Criar tarefa primeiro
        await page.click('[data-testid="add-task-todo"]');
        await page.fill('input[placeholder="Digite o título da tarefa"]', 'Tarefa para Editar');
        await page.click('button:has-text("Criar Tarefa")');

        // Editar tarefa
        await page.click('[data-testid^="edit-task-"]');
        await page.fill('input[placeholder="Digite o título da tarefa"]', 'Tarefa Editada');
        await page.click('button:has-text("Atualizar Tarefa")');

        // Verificar mudança
        await expect(page.locator('text=Tarefa Editada')).toBeVisible();
    });

    test('deve excluir uma tarefa', async ({ page }) => {
        // Criar tarefa
        await page.click('[data-testid="add-task-todo"]');
        await page.fill('input[placeholder="Digite o título da tarefa"]', 'Tarefa para Deletar');
        await page.click('button:has-text("Criar Tarefa")');

        // Deletar tarefa
        await page.click('[data-testid^="delete-task-"]');
        await page.click('button:has-text("Excluir")');

        // Verificar que desapareceu
        await expect(page.locator('text=Tarefa para Deletar')).not.toBeVisible();
    });
});