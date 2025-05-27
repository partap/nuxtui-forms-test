import { db } from '@@/server/lib/db'
export default defineEventHandler(async event => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const todoIndex = db.todo.findIndex(todo => todo.id === Number(id))
  if (todoIndex === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }

  db.todo.splice(todoIndex, 1)
  return { message: 'Todo deleted successfully' }
})
