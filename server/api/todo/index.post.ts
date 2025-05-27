import { db } from '~~/server/lib/db'
import type { Todo, TodoCreate } from '~~/lib/types'
export default defineEventHandler(async event => {
  const body = (await readBody(event)) as TodoCreate
  if (!body || !body.text) {
    throw createError({ statusCode: 400, statusMessage: 'Text is required' })
  }
  const newId = db.todo.length
    ? Math.max(...db.todo.map(todo => todo.id)) + 1
    : 1
  const newTodo: Todo = {
    id: newId,
    text: body.text,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  db.todo.push(newTodo)
  return newTodo
})
