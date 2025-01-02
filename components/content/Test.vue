<script setup lang="ts">
function showAlert() {
    alert('Hello, world!');
}
</script>

<template>
    <button class="flex items-center justify-center px-4 py-1 border rounded-md" @click="showAlert"><slot /></button>
</template>
