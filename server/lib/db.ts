import type { Todo } from '~~/lib/types'
export type FakeDB = {
  todo: Todo[]
}
export const db: FakeDB = {
  todo: [
    {
      id: 1,
      text: 'Learn Nuxt 3',
      completed: false,
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z')
    },
    {
      id: 2,
      text: 'Build a Todo App',
      completed: false,
      createdAt: new Date('2023-01-02T00:00:00Z'),
      updatedAt: new Date('2023-01-02T00:00:00Z')
    }
  ]
}
