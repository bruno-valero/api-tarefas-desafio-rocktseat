import { createTaskController } from '../controllers/create-task-controller'
import { deleteTaskController } from '../controllers/delete-task-controller'
import { fetchTasksController } from '../controllers/fetch-tasks-controller'
import { markTaskAsCompletedController } from '../controllers/mark-task-as-completed-controller'
import { updateTaskController } from '../controllers/update-task-controller'
import { Server } from '@/customServer'

export async function taskRoutes(app: Server) {
  app.addGlobalMiddleWare(async (_req, res) => {
    res.setHeader('content-type', 'application/json')
  })

  app.get('/tasks', fetchTasksController)
  app.post('/tasks', createTaskController)
  app.put('/tasks/:id', updateTaskController)
  app.delete('/tasks/:id', deleteTaskController)
  app.patch('/tasks/:id/complete', markTaskAsCompletedController)
}
