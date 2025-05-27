<script setup lang="ts">
import { useTodoList } from '~/queries/todo'
const { todos } = useTodoList()
</script>

<template>
  <div class="todo-list">
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <NuxtLink :to="`/todo/${todo.id}`">{{ todo.text }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
