<script setup lang="ts">
const NAVLINKS = [
    { name: 'Home', href: '/' },
    { name: 'Favourites', href: '/favourites' },
    { name: 'About', href: '/about' },
];

const isHovering = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const navRef = ref<HTMLElement | null>(null);

const handleMouseMove = (event: MouseEvent) => {
    if (!navRef.value) return;

    const rect = navRef.value.getBoundingClientRect();
    mousePosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
};
</script>

<template>
    <header class="fixed top-0 left-0 right-0 z-50 px-4 py-6">
        <nav class="max-w-2xl mx-auto">
            <!-- Pill-shaped navbar -->
            <div
                ref="navRef"
                @mousemove="handleMouseMove"
                @mouseenter="isHovering = true"
                @mouseleave="isHovering = false"
                class="relative py-2 px-4 border rounded-full shadow-lg opacity-80 backdrop-blur-[4px] bg-white/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <!-- Glow effect -->
                <div
                    class="absolute transition duration-300 pointer-events-none -inset-px"
                    :style="{
                        opacity: isHovering ? 1 : 0,
                        background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, 
                                   hsl(var(--primary) / 0.1), 
                                   transparent 40%)`,
                    }" />

                <!-- Inner glow effect -->
                <div
                    class="absolute inset-0 rounded-full bg-gradient-to-r from-zinc-200/50 via-transparent to-zinc-200/50 dark:from-zinc-800/50 dark:via-transparent dark:to-zinc-800/50 blur-xl -z-10" />

                <div class="flex items-center justify-between px-4">
                    <!-- Logo -->
                    <NuxtLink to="/" class="font-semibold">
                        <NuxtImg
                            src="/images/logo.svg"
                            class="w-28 filter dark:brightness-200 dark:hue-rotate-0 hue-rotate-[190deg] brightness-125"
                            alt="Logo" />
                    </NuxtLink>

                    <!-- Center Navigation -->
                    <ul class="flex items-center gap-8">
                        <li v-for="link in NAVLINKS" :key="link.href">
                            <NuxtLink
                                :to="link.href"
                                class="text-sm transition-colors text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                                {{ link.name }}
                            </NuxtLink>
                        </li>
                    </ul>

                    <!-- Right Side -->
                    <div class="flex items-center gap-4">
                        <HeaderThemeSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>
