import { db } from '@@/server/lib/db'
import type { Todo } from '@@/lib/types'
export default defineEventHandler(async event => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const todoIndex = db.todo.findIndex(todo => todo.id === Number(id))
  if (todoIndex === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }

  const body = await readBody(event)
  const updatedTodo: Todo = {
    ...db.todo[todoIndex],
    ...body,
    updatedAt: new Date()
  }

  db.todo[todoIndex] = updatedTodo
  return updatedTodo
})
