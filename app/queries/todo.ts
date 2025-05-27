import { useQuery, useMutation } from '@pinia/colada'
import { todoListSchema, todoSchema, type Todo } from '~~/lib/types'

export const useTodoList = () => {
  const { state, error, refetch, ...rest } = useQuery({
    key: ['idpList'],
    query: () => {
      const url = `/api/todo`
      return $fetch(`/api/todo`).then(response => {
        console.info(url, 'fetchTodoList response', response)
        const parsedResponse = todoListSchema.parse(response)
        console.info(url, 'fetchTodoList parsedResponse', parsedResponse)
        return parsedResponse
      })
    }
  })

  const todos = computed(() => state.value.data || [])

  const isError = computed(() => !!error.value)
  return {
    state,
    todos,
    fetchTodoList: refetch,
    isError,
    error,
    ...rest
  }
}

export const useTodo = (id: number) => {
  const { state, error, refetch, ...rest } = useQuery({
    key: ['todo', id],
    query: () => {
      const url = `/api/todo/${id}`
      return $fetch(url).then(response => {
        console.info(url, 'fetchTodo response', response)
        const parsedResponse = todoSchema.parse(response)
        return parsedResponse
      })
    }
  })
  const todo = computed(() => state.value.data)
  const isError = computed(() => !!error.value)
  return {
    state,
    todo,
    fetchTodo: refetch,
    isError,
    error,
    ...rest
  }
}

export const useTodoUpdate = () => {
  const queryCache = useQueryCache()
  const { mutate, status, ...rest } = useMutation({
    mutation: (todo: Todo) => {
      const url = `/api/todo/${todo.id}`
      return $fetch(url, {
        method: 'PUT',
        body: todo
      }).then(response => {
        console.info(url, 'updateTodo response', response)
        const parsedResponse = todoSchema.parse(response)
        // Update the cache with the new todo
        queryCache.setQueryData(['todo', todo.id], parsedResponse)
        return parsedResponse
      })
    },
    onMutate (todo: Todo) {
      // Optimistically update the cache
      const cacheKey = ['todo', todo.id]
      const oldTodo = queryCache.getQueryData<Todo>(cacheKey)
      const newTodo = { ...oldTodo, ...todo, updatedAt: new Date() }
      queryCache.setQueryData(cacheKey, todo)
      queryCache.cancelQueries({ key: cacheKey })
      console.info('Optimistically updated cache for', cacheKey, todo)
      return {
        oldTodo,
        newTodo
      }
    },
    onError (error, _vars, context) {
      if (context?.oldTodo) {
        // Rollback the optimistic update
        queryCache.setQueryData(['todo', context.oldTodo.id], context.oldTodo)
        console.error(
          'Error updating todo, rolled back to old state',
          context.oldTodo
        )
      }
    }
    // The queryCache is being updated by the response of the mutation,
    // so we don't need to refetch or invalidate queries here.

    // onSettled (_data, _error, _vars, { newTodo }) {
    //   if (newTodo) {
    //     // Refetch the todo to ensure we have the latest data
    //     // queryCache.invalidateQueries({ key: ['todo', newTodo.id] })
    //   }
    // },
  })
  const success = computed(() => status.value === 'success')
  return {
    updateTodo: mutate,
    success,
    status,
    ...rest
  }
}
