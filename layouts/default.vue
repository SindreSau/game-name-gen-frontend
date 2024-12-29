<script setup lang="ts">
const NAVLINKS = [
    { name: 'Home', href: '/' },
    { name: 'Favourites', href: '/favourites' },
    { name: 'About', href: '/about' },
];
</script>

<template>
    <div class="min-h-screen">
        <header class="border-b">
            <nav class="flex items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <ul class="flex gap-6">
                    <li v-for="link in NAVLINKS" :key="link.href">
                        <NuxtLink :to="link.href" class="">
                            {{ link.name }}
                        </NuxtLink>
                    </li>
                </ul>

                <ThemeSwitcher></ThemeSwitcher>
            </nav>
        </header>

        <main class="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <slot />
        </main>
    </div>
</template>

<style></style>
