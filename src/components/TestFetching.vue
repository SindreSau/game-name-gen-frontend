<script setup lang="ts">
import { useStyles } from '@/composables/useStyles'

const { styles, isLoading, isError, error } = useStyles()
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Test Fetching</h2>

    <div v-if="isLoading">Loading...</div>

    <div v-else-if="isError" class="text-red-500">Error: {{ error }}</div>

    <div v-else>
      <h3 class="font-semibold mb-2">Available Styles:</h3>
      <ul class="list-disc pl-4">
        <li v-for="style in styles" :key="style.id">
          {{ style.name }}
          <span v-if="style.description" class="text-gray-600"> - {{ style.description }} </span>
        </li>
      </ul>
    </div>
  </div>
</template>
