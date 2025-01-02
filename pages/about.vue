<script setup lang="ts">
useSeo({
    title: 'About',
    description:
        'About the Game Name Generator! The tool that helps you create unique and interesting names for your game characters.',
});
</script>

<template>
    <div><ContentDoc class="max-w-3xl mx-auto" path="/about" /></div>
</template>

<style scoped>
div {
    @apply flex flex-col gap-2;
}

:deep() h1 {
    @apply text-3xl pb-1 font-semibold text-foreground;
}

:deep() h2 {
    @apply text-2xl py-1 font-semibold text-foreground;
}

:deep() h3 {
    @apply text-xl py-1 font-semibold text-foreground;
}

:deep() hr {
    @apply my-3;
}

:deep() p {
    @apply py-1;
}

:deep() ul {
    @apply list-disc pl-8 space-y-1;
}

:deep() ol {
    @apply list-decimal pl-8 space-y-1;
}
</style>
