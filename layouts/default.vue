<script setup lang="ts"></script>

<template>
    <div class="relative min-h-screen">
        <HeaderAmbientCircleBacground />
        <HeaderBackgroundNoise />

        <Navbar />

        <main class="relative px-5 py-12 pt-[100px] mx-auto max-w-7xl sm:px-6 lg:px-8">
            <slot />
        </main>

        <Footer />
    </div>
</template>
