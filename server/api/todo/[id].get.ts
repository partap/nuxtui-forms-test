import { db } from '~~/server/lib/db'
export default defineEventHandler(async event => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const todo = await db.todo.find(todo => todo.id === Number(id))

  if (!todo) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }
  return todo
})
