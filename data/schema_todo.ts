import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
export const todo = sqliteTable('todo', {
  id: integer('id').primaryKey(),
  text: text('text').notNull(),
  completed: integer('completed').notNull().default(0), // 0 for false, 1 for true
  createdAt: integer('createdAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})
