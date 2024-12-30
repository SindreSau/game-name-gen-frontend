<script setup lang="ts"></script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 100ms ease-in-out;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(2px);
}
</style>
