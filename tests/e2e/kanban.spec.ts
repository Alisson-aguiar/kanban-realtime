import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Aguardar a página carregar completamente
        await page.waitForLoadState('networkidle');
    });

    test('deve criar uma nova tarefa', async ({ page }) => {
        // Encontrar a coluna "A Fazer" e clicar no botão "Adicionar tarefa"
        const todoColumn = page.locator('div').filter({ hasText: '📝 A Fazer' }).first();
        const addButton = todoColumn.locator('button:has-text("Adicionar tarefa")');
        await addButton.click();

        // Aguardar o modal aparecer
        await page.waitForSelector('form');

        // Preencher o formulário
        await page.fill('input[placeholder="Digite o título da tarefa"]', 'Nova Tarefa E2E');
        await page.fill('textarea[placeholder="Digite a descrição"]', 'Descrição da tarefa de teste');

        // Clicar em Criar
        await page.click('button:has-text("Criar Tarefa")');

        // Aguardar o modal fechar
        await page.waitForTimeout(500);

        // Verificar se a tarefa apareceu na coluna A Fazer
        await expect(todoColumn.locator('text=Nova Tarefa E2E')).toBeVisible({ timeout: 5000 });
    });

    test('deve editar uma tarefa existente', async ({ page }) => {
        // Primeiro criar uma tarefa
        const todoColumn = page.locator('div').filter({ hasText: '📝 A Fazer' }).first();
        const addButton = todoColumn.locator('button:has-text("Adicionar tarefa")');
        await addButton.click();

        await page.waitForSelector('form');
        await page.fill('input[placeholder="Digite o título da tarefa"]', 'Tarefa para Editar');
        await page.click('button:has-text("Criar Tarefa")');
        await page.waitForTimeout(500);

        // Encontrar a tarefa criada e passar o mouse sobre ela
        const taskCard = todoColumn.locator('text=Tarefa para Editar').first();
        await taskCard.hover();

        // Clicar no botão de editar (ícone de lápis)
        const editButton = todoColumn.locator('button').filter({ has: page.locator('svg.lucide-edit') }).first();
        await editButton.click();

        // Aguardar o modal de edição
        await page.waitForSelector('form');

        // Editar título
        const titleInput = page.locator('input[placeholder="Digite o título da tarefa"]');
        await titleInput.clear();
        await titleInput.fill('Tarefa Editada');

        // Clicar em Atualizar
        await page.click('button:has-text("Atualizar Tarefa")');

        // Aguardar o modal fechar
        await page.waitForTimeout(500);

        // Verificar se o título foi atualizado
        await expect(todoColumn.locator('text=Tarefa Editada')).toBeVisible({ timeout: 5000 });
    });

    test('deve excluir uma tarefa', async ({ page }) => {
        // Criar tarefa primeiro
        const todoColumn = page.locator('div').filter({ hasText: '📝 A Fazer' }).first();
        const addButton = todoColumn.locator('button:has-text("Adicionar tarefa")');
        await addButton.click();

        await page.waitForSelector('form');
        await page.fill('input[placeholder="Digite o título da tarefa"]', 'Tarefa para Deletar');
        await page.click('button:has-text("Criar Tarefa")');
        await page.waitForTimeout(500);

        // Verificar que a tarefa foi criada
        await expect(todoColumn.locator('text=Tarefa para Deletar')).toBeVisible();

        // Passar o mouse sobre a tarefa
        const taskCard = todoColumn.locator('text=Tarefa para Deletar').first();
        await taskCard.hover();

        // Clicar no botão de deletar (ícone de lixeira)
        const deleteButton = todoColumn.locator('button').filter({ has: page.locator('svg.lucide-trash-2') }).first();
        await deleteButton.click();

        // Clicar no botão de confirmação "Excluir"
        await page.click('button:has-text("Excluir")');

        // Aguardar a exclusão
        await page.waitForTimeout(500);

        // Verificar que a tarefa não existe mais
        await expect(todoColumn.locator('text=Tarefa para Deletar')).not.toBeVisible();
    });

    test('deve simular perda de conexão', async ({ page, context }) => {
        // Verificar que está online inicialmente
        await expect(page.locator('text=Online')).toBeVisible();

        // Simular perda de conexão
        await context.setOffline(true);

        // Aguardar o status mudar para offline
        await page.waitForTimeout(1000);

        // Criar tarefa offline
        const todoColumn = page.locator('div').filter({ hasText: '📝 A Fazer' }).first();
        const addButton = todoColumn.locator('button:has-text("Adicionar tarefa")');
        await addButton.click();

        await page.waitForSelector('form');
        await page.fill('input[placeholder="Digite o título da tarefa"]', 'Tarefa Offline');
        await page.click('button:has-text("Criar Tarefa")');
        await page.waitForTimeout(500);

        // Verificar que a tarefa foi criada localmente
        await expect(todoColumn.locator('text=Tarefa Offline')).toBeVisible();

        // Voltar online
        await context.setOffline(false);

        // Aguardar sincronização e status online
        await page.waitForTimeout(3000);
        await expect(page.locator('text=Online')).toBeVisible();
    });
});