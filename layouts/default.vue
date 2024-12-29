<script setup lang="ts">
const NAVLINKS = [
    { name: 'Home', href: '/' },
    { name: 'Favourites', href: '/favourites' },
    { name: 'About', href: '/about' },
];
</script>

<template>
    <div class="relative min-h-screen">
        <HeaderAmbientCircleBacground />
        <HeaderBackgroundNoise />

        <Navbar />

        <main class="relative max-w-5xl py-6 pt-32 mx-auto sm:px-6 lg:px-8">
            <slot />
        </main>
    </div>
</template>
