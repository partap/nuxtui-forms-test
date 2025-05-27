import { db } from '@@/server/lib/db'
import type { Todo } from '@@/lib/types'

export default defineEventHandler(async _event => {
  console.log('Fetching all todos')
  const todos: Todo[] = db.todo
  return todos
})
