<script setup lang="ts">
import { todoSchema, type Todo } from '~~/lib/types'
import { useTodo, useTodoUpdate } from '~/queries/todo'
import type { FormSubmitEvent } from '@nuxt/ui'
const form = useTemplateRef('form')
const route = useRoute()
const { todo } = useTodo(Number(route.params.id))
const { updateTodo } = useTodoUpdate()
const state = reactive<Todo>({
  id: 0,
  text: '',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
watch(todo, newTodo => {
  if (newTodo) {
    // Update the state with the fetched todo data
    Object.assign(state, newTodo)
  }
})
onMounted(() => {
  // Initialize the state with the fetched todo data
  if (todo.value) {
    Object.assign(state, todo.value)
  }
})

// This variable is set to false to emphasize that the form values are
// being reset to the original state after submission, rather than keeping the
// edited values. If actuallySaveData is false, the form will not submit.
// If actuallySaveData is true, the form will submit and the form will
// only briefly revert to the original state before the new values are updated.
const actuallySaveData = ref(true)

async function save(event: FormSubmitEvent<Todo>) {
  console.log('Saving todo:', event)

  // This doesn't appear to actually do anything
  // event.preventDefault()

  // Submit the form data to the server
  if (!actuallySaveData.value) {
    console.warn('Skipping save...form will now revert to original state. Why?')
    return
  }
  updateTodo(event.data)
}
</script>

<template>
  <div class="todo-page m-4 flex flex-col gap-4 h-screen">
    <NuxtLink
      to="/todo"
      class="text-(--ui-primary) hover:text-(--ui-primary-hover)"
    >
      Back to Todo List
    </NuxtLink>

    <div class="bg-amber-50 p-4 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold">Form Props</h2>
      <p class="text-gray-500">
        dirty: {{ form?.dirty }}
        <span class="text-gray-400 italic">
          - Why is this always false, even when there are dirty fields?
        </span>
      </p>
      <p class="text-gray-500">
        dirtyFields: {{ form?.dirtyFields }}
        <span class="text-gray-400 italic">
          - How should I reset dirtyFields to false after submission? Manually?
        </span>
      </p>
      <p class="text-gray-500">errors: {{ form?.errors }}</p>
    </div>
    <div v-if="todo" class="bg-amber-50 p-4 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold mt-4">Todo Props</h2>
      <p class="text-gray-500">ID: {{ todo.id }}</p>
      <p class="text-gray-500">Text: {{ todo.text }}</p>
      <p class="text-gray-500">Completed: {{ todo.completed }}</p>
      <p class="text-gray-500">createdAt: {{ todo.createdAt }}</p>
      <p class="text-gray-500">updatedAt: {{ todo.updatedAt }}</p>
    </div>
    <UForm
      v-if="todo"
      ref="form"
      :schema="todoSchema"
      :state="state"
      class="flex flex-col gap-4 p-4 rounded-lg border-gray-400 shadow-md"
      @submit="save"
    >
      <h2 class="text-lg font-semibold">Edit Todo</h2>
      <USwitch
        v-model="actuallySaveData"
        label="Actually Save Data"
        hint="If this is false, the form will not submit and will revert to the original state."
        class="mt-2"
      />
      <UFormField
        label="Todo Text"
        name="text"
        required
        hint="Change the text and save. Why does the form revert to the original state after submission?"
      >
        <UInput
          v-model="state.text"
          placeholder="Enter todo text"
          class="w-full"
        />
      </UFormField>
      <UFormField
        name="completed"
        label="Completed"
        hint="Clicking this sets state.completed to true but does not update the UI. Also, I can't uncheck it."
      >
        <UCheckbox v-model="state.completed" label="Completed" />
      </UFormField>

      <div class="flex mt-4">
        <UButton type="submit" color="success" class=""> Save Changes </UButton>
      </div>
    </UForm>
  </div>
</template>
