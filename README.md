# Desafio Rocketseat: API para realizar o CRUD de tasks (tarefas)

Confira a página informando requisitos do desafio em [https://efficient-sloth-d85.notion.site/Desafio-01-2d48608f47644519a408b438b52d913f](https://efficient-sloth-d85.notion.site/Desafio-01-2d48608f47644519a408b438b52d913f)

## Requisitos Funcionais

- [x] Deve ser posssível a Criação de uma task
- [x] Deve ser posssível a Listagem de todas as tasks
- [x] Deve ser posssível a Atualização de uma task pelo id
- [x] Deve ser posssível a Remoção de uma task pelo id
- [x] Deve ser posssível Marcar pelo id uma task como completa
- [x] Deve ser posssível a Importação de tasks em massa por um arquivo CSV

## Regras de Negócio

- A estrutura das tasks deve ser formada por:

  - [x] id - Identificador único de cada task
  - [x] title - Título da task
  - [x] description - Descrição detalhada da task
  - [x] completed_at - Data de quando a task foi concluída. O valor inicial deve ser null
  - [x] created_at - Data de quando a task foi criada.
  - [x] updated_at - Deve ser sempre alterado para a data de quando a task foi atualizada.

- A aplicação deve conter as seguintes rotas:
  - [x] POST - /tasks
  - [x] GET - /tasks
  - [x] PUT - /tasks/:id
  - [x] DELETE - /tasks/:id
  - [x] PATCH - /tasks/:id/complete

## Estrutura DDD (Domain Driven Design):

## Domains

- Task

  - Application

    - Use Cases

      - [x] create-task
      - [x] list-tasks
      - [x] update-task
      - [x] delete-task
      - [x] mark-task-as-completed

    - Repositories
      - abstract
        - [x] tasks-repository
      - real
        - [x] prisma-tasks-repository

  - Enterprise
    - entity
      - [x] task
