# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kanban.spec.ts >> Kanban Board E2E >> deve simular perda de conexão
- Location: tests\e2e\kanban.spec.ts:102:9

# Error details

```
Error: locator.click: Error: strict mode violation: locator('div').filter({ hasText: '📝 A Fazer' }).first().locator('button:has-text("Adicionar tarefa")') resolved to 3 elements:
    1) <button data-testid="add-task-todo" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">…</button> aka getByTestId('add-task-todo')
    2) <button data-testid="add-task-in-progress" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">…</button> aka getByTestId('add-task-in-progress')
    3) <button data-testid="add-task-done" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">…</button> aka getByTestId('add-task-done')

Call log:
  - waiting for locator('div').filter({ hasText: '📝 A Fazer' }).first().locator('button:has-text("Adicionar tarefa")')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e5]:
        - generic [ref=e7]:
          - img [ref=e9]
          - heading "Kanban Pro" [level=1] [ref=e11]
        - generic [ref=e12]:
          - generic [ref=e13]:
            - img [ref=e14]
            - generic [ref=e18]: Sincronizando...
          - generic [ref=e19]:
            - img [ref=e20]
            - generic [ref=e24]: Online
          - button [ref=e25]:
            - img [ref=e26]
          - button [ref=e31]:
            - img [ref=e32]
          - button "Resetar" [ref=e35]
    - complementary [ref=e36]:
      - generic [ref=e37]:
        - generic [ref=e38]:
          - heading "Projetos" [level=3] [ref=e39]
          - generic [ref=e40]:
            - generic [ref=e41] [cursor=pointer]: Desenvolvimento
            - generic [ref=e42] [cursor=pointer]: Design
            - generic [ref=e43] [cursor=pointer]: Marketing
        - generic [ref=e44]:
          - heading "Equipe" [level=3] [ref=e45]
          - generic [ref=e46]:
            - generic [ref=e47] [cursor=pointer]:
              - generic [ref=e48]: J
              - generic [ref=e49]: João Silva
            - generic [ref=e50] [cursor=pointer]:
              - generic [ref=e51]: M
              - generic [ref=e52]: Maria Santos
            - generic [ref=e53] [cursor=pointer]:
              - generic [ref=e54]: P
              - generic [ref=e55]: Pedro Costa
    - main [ref=e56]:
      - generic [ref=e57]:
        - generic [ref=e58]:
          - generic [ref=e59]:
            - heading "📝 A Fazer(2)" [level=2] [ref=e63]:
              - text: 📝 A Fazer
              - generic [ref=e64]: (2)
            - generic [ref=e65]:
              - button "Offline First Configurar IndexedDB com Dexie.js 21 de abr. de 2026, 17:41" [ref=e67]:
                - generic [ref=e69]:
                  - generic [ref=e71]:
                    - img [ref=e72]
                    - generic [ref=e79]:
                      - heading "Offline First" [level=3] [ref=e80]
                      - paragraph [ref=e81]: Configurar IndexedDB com Dexie.js
                      - generic [ref=e82]:
                        - img [ref=e83]
                        - generic [ref=e85]: 21 de abr. de 2026, 17:41
                  - generic [ref=e86]:
                    - button [ref=e87]:
                      - img [ref=e88]
                    - button [ref=e90]:
                      - img [ref=e91]
              - button "Implementar WebSocket Configurar Socket.io para atualizações em tempo real 21 de abr. de 2026, 17:41" [ref=e95]:
                - generic [ref=e97]:
                  - generic [ref=e99]:
                    - img [ref=e100]
                    - generic [ref=e107]:
                      - heading "Implementar WebSocket" [level=3] [ref=e108]
                      - paragraph [ref=e109]: Configurar Socket.io para atualizações em tempo real
                      - generic [ref=e110]:
                        - img [ref=e111]
                        - generic [ref=e113]: 21 de abr. de 2026, 17:41
                  - generic [ref=e114]:
                    - button [ref=e115]:
                      - img [ref=e116]
                    - button [ref=e118]:
                      - img [ref=e119]
            - button "Adicionar tarefa" [ref=e122]:
              - img [ref=e123]
              - text: Adicionar tarefa
          - generic [ref=e124]:
            - heading "🔄 Em Progresso(2)" [level=2] [ref=e128]:
              - text: 🔄 Em Progresso
              - generic [ref=e129]: (2)
            - generic [ref=e130]:
              - button "Drag and Drop Implementar @dnd-kit para movimentação de tarefas 21 de abr. de 2026, 17:41" [ref=e132]:
                - generic [ref=e134]:
                  - generic [ref=e136]:
                    - img [ref=e137]
                    - generic [ref=e144]:
                      - heading "Drag and Drop" [level=3] [ref=e145]
                      - paragraph [ref=e146]: Implementar @dnd-kit para movimentação de tarefas
                      - generic [ref=e147]:
                        - img [ref=e148]
                        - generic [ref=e150]: 21 de abr. de 2026, 17:41
                  - generic [ref=e151]:
                    - button [ref=e152]:
                      - img [ref=e153]
                    - button [ref=e155]:
                      - img [ref=e156]
              - button "Configurar IndexedDB Implementar Dexie.js para cache offline 21 de abr. de 2026, 17:41" [ref=e160]:
                - generic [ref=e162]:
                  - generic [ref=e164]:
                    - img [ref=e165]
                    - generic [ref=e172]:
                      - heading "Configurar IndexedDB" [level=3] [ref=e173]
                      - paragraph [ref=e174]: Implementar Dexie.js para cache offline
                      - generic [ref=e175]:
                        - img [ref=e176]
                        - generic [ref=e178]: 21 de abr. de 2026, 17:41
                  - generic [ref=e179]:
                    - button [ref=e180]:
                      - img [ref=e181]
                    - button [ref=e183]:
                      - img [ref=e184]
            - button "Adicionar tarefa" [ref=e187]:
              - img [ref=e188]
              - text: Adicionar tarefa
          - generic [ref=e189]:
            - heading "✅ Concluído(1)" [level=2] [ref=e193]:
              - text: ✅ Concluído
              - generic [ref=e194]: (1)
            - button "Testes E2E Criar testes com Playwright simulando perda de conexão 21 de abr. de 2026, 17:41" [ref=e197]:
              - generic [ref=e199]:
                - generic [ref=e201]:
                  - img [ref=e202]
                  - generic [ref=e209]:
                    - heading "Testes E2E" [level=3] [ref=e210]
                    - paragraph [ref=e211]: Criar testes com Playwright simulando perda de conexão
                    - generic [ref=e212]:
                      - img [ref=e213]
                      - generic [ref=e215]: 21 de abr. de 2026, 17:41
                - generic [ref=e216]:
                  - button [ref=e217]:
                    - img [ref=e218]
                  - button [ref=e220]:
                    - img [ref=e221]
            - button "Adicionar tarefa" [ref=e224]:
              - img [ref=e225]
              - text: Adicionar tarefa
        - status [ref=e226]
  - button "Open Next.js Dev Tools" [ref=e232] [cursor=pointer]:
    - generic [ref=e235]:
      - text: Compiling
      - generic [ref=e236]:
        - generic [ref=e237]: .
        - generic [ref=e238]: .
        - generic [ref=e239]: .
  - alert [ref=e240]
```

# Test source

```ts
  15  | 
  16  |         // Aguardar o modal aparecer
  17  |         await page.waitForSelector('form');
  18  | 
  19  |         // Preencher o formulário
  20  |         await page.fill('input[placeholder="Digite o título da tarefa"]', 'Nova Tarefa E2E');
  21  |         await page.fill('textarea[placeholder="Digite a descrição"]', 'Descrição da tarefa de teste');
  22  | 
  23  |         // Clicar em Criar
  24  |         await page.click('button:has-text("Criar Tarefa")');
  25  | 
  26  |         // Aguardar o modal fechar
  27  |         await page.waitForTimeout(500);
  28  | 
  29  |         // Verificar se a tarefa apareceu na coluna A Fazer
  30  |         await expect(todoColumn.locator('text=Nova Tarefa E2E')).toBeVisible({ timeout: 5000 });
  31  |     });
  32  | 
  33  |     test('deve editar uma tarefa existente', async ({ page }) => {
  34  |         // Primeiro criar uma tarefa
  35  |         const todoColumn = page.locator('div').filter({ hasText: '📝 A Fazer' }).first();
  36  |         const addButton = todoColumn.locator('button:has-text("Adicionar tarefa")');
  37  |         await addButton.click();
  38  | 
  39  |         await page.waitForSelector('form');
  40  |         await page.fill('input[placeholder="Digite o título da tarefa"]', 'Tarefa para Editar');
  41  |         await page.click('button:has-text("Criar Tarefa")');
  42  |         await page.waitForTimeout(500);
  43  | 
  44  |         // Encontrar a tarefa criada e passar o mouse sobre ela
  45  |         const taskCard = todoColumn.locator('text=Tarefa para Editar').first();
  46  |         await taskCard.hover();
  47  | 
  48  |         // Clicar no botão de editar (ícone de lápis)
  49  |         const editButton = todoColumn.locator('button').filter({ has: page.locator('svg.lucide-edit') }).first();
  50  |         await editButton.click();
  51  | 
  52  |         // Aguardar o modal de edição
  53  |         await page.waitForSelector('form');
  54  | 
  55  |         // Editar título
  56  |         const titleInput = page.locator('input[placeholder="Digite o título da tarefa"]');
  57  |         await titleInput.clear();
  58  |         await titleInput.fill('Tarefa Editada');
  59  | 
  60  |         // Clicar em Atualizar
  61  |         await page.click('button:has-text("Atualizar Tarefa")');
  62  | 
  63  |         // Aguardar o modal fechar
  64  |         await page.waitForTimeout(500);
  65  | 
  66  |         // Verificar se o título foi atualizado
  67  |         await expect(todoColumn.locator('text=Tarefa Editada')).toBeVisible({ timeout: 5000 });
  68  |     });
  69  | 
  70  |     test('deve excluir uma tarefa', async ({ page }) => {
  71  |         // Criar tarefa primeiro
  72  |         const todoColumn = page.locator('div').filter({ hasText: '📝 A Fazer' }).first();
  73  |         const addButton = todoColumn.locator('button:has-text("Adicionar tarefa")');
  74  |         await addButton.click();
  75  | 
  76  |         await page.waitForSelector('form');
  77  |         await page.fill('input[placeholder="Digite o título da tarefa"]', 'Tarefa para Deletar');
  78  |         await page.click('button:has-text("Criar Tarefa")');
  79  |         await page.waitForTimeout(500);
  80  | 
  81  |         // Verificar que a tarefa foi criada
  82  |         await expect(todoColumn.locator('text=Tarefa para Deletar')).toBeVisible();
  83  | 
  84  |         // Passar o mouse sobre a tarefa
  85  |         const taskCard = todoColumn.locator('text=Tarefa para Deletar').first();
  86  |         await taskCard.hover();
  87  | 
  88  |         // Clicar no botão de deletar (ícone de lixeira)
  89  |         const deleteButton = todoColumn.locator('button').filter({ has: page.locator('svg.lucide-trash-2') }).first();
  90  |         await deleteButton.click();
  91  | 
  92  |         // Clicar no botão de confirmação "Excluir"
  93  |         await page.click('button:has-text("Excluir")');
  94  | 
  95  |         // Aguardar a exclusão
  96  |         await page.waitForTimeout(500);
  97  | 
  98  |         // Verificar que a tarefa não existe mais
  99  |         await expect(todoColumn.locator('text=Tarefa para Deletar')).not.toBeVisible();
  100 |     });
  101 | 
  102 |     test('deve simular perda de conexão', async ({ page, context }) => {
  103 |         // Verificar que está online inicialmente
  104 |         await expect(page.locator('text=Online')).toBeVisible();
  105 | 
  106 |         // Simular perda de conexão
  107 |         await context.setOffline(true);
  108 | 
  109 |         // Aguardar o status mudar para offline
  110 |         await page.waitForTimeout(1000);
  111 | 
  112 |         // Criar tarefa offline
  113 |         const todoColumn = page.locator('div').filter({ hasText: '📝 A Fazer' }).first();
  114 |         const addButton = todoColumn.locator('button:has-text("Adicionar tarefa")');
> 115 |         await addButton.click();
      |                         ^ Error: locator.click: Error: strict mode violation: locator('div').filter({ hasText: '📝 A Fazer' }).first().locator('button:has-text("Adicionar tarefa")') resolved to 3 elements:
  116 | 
  117 |         await page.waitForSelector('form');
  118 |         await page.fill('input[placeholder="Digite o título da tarefa"]', 'Tarefa Offline');
  119 |         await page.click('button:has-text("Criar Tarefa")');
  120 |         await page.waitForTimeout(500);
  121 | 
  122 |         // Verificar que a tarefa foi criada localmente
  123 |         await expect(todoColumn.locator('text=Tarefa Offline')).toBeVisible();
  124 | 
  125 |         // Voltar online
  126 |         await context.setOffline(false);
  127 | 
  128 |         // Aguardar sincronização e status online
  129 |         await page.waitForTimeout(3000);
  130 |         await expect(page.locator('text=Online')).toBeVisible();
  131 |     });
  132 | });
```