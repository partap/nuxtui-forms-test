import { z } from 'zod/v4'
export const todoSchema = z.object({
  id: z.number(),
  text: z.string().min(1, 'Text is required'),
  completed: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})
export type Todo = z.infer<typeof todoSchema>

export const todoListSchema = z.array(todoSchema)
export type TodoList = z.infer<typeof todoListSchema>

export const todoCreateSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  completed: z.boolean().default(false)
})
export type TodoCreate = z.infer<typeof todoCreateSchema>
