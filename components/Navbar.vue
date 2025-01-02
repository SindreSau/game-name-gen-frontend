<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { vAutoAnimate } from '@formkit/auto-animate/vue';

const NAVLINKS = [
    { name: 'Generator', href: '/' },
    { name: 'Favorites', href: '/favorites' },
    { name: 'About', href: '/about' },
];

const route = useRoute();
const currentPagePath = computed(() => route.path);

const isHovering = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const navRef = ref<HTMLElement | null>(null);
const isMenuOpen = ref(false);

const handleMouseMove = (event: MouseEvent) => {
    if (!navRef.value) return;

    const rect = navRef.value.getBoundingClientRect();
    mousePosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
};

const isActiveLink = (href: string) => {
    return href === currentPagePath.value;
};

const menuRef = ref<HTMLElement | null>(null);
const menuHeight = ref(0);

const navStyle = computed(() => ({
    borderRadius: isMenuOpen.value ? '30px' : '30px',
    transition: 'all 100ms ease-in-out',
}));

const menuStyle = computed(() => ({
    height: isMenuOpen.value ? `${menuHeight.value}px` : '0px',
    opacity: isMenuOpen.value ? 1 : 0,
    transition: 'all 100ms ease-in-out',
}));

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    nextTick(() => {
        if (menuRef.value) {
            menuHeight.value = isMenuOpen.value ? menuRef.value.scrollHeight + 20 : 0;
        }
    });
};

const closeMenu = () => {
    isMenuOpen.value = false;
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
                :style="navStyle"
                class="relative py-2 px-4 border shadow-lg opacity-100 backdrop-blur-[4px] bg-background/40 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 overflow-hidden">
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
                    class="absolute inset-0 bg-gradient-to-r from-zinc-200/50 via-transparent to-zinc-200/50 dark:from-zinc-800/50 dark:via-transparent dark:to-zinc-800/50 blur-xl -z-10"
                    :style="navStyle"></div>

                <div class="flex items-center justify-between px-4">
                    <!-- Logo -->
                    <NuxtLink to="/" class="font-semibold">
                        <NuxtImg
                            src="/images/logo.png"
                            class="w-28 filter dark:brightness-200 dark:hue-rotate-0 hue-rotate-[190deg] brightness-125"
                            alt="Logo"
                            format="webp"
                            width="112px" />
                    </NuxtLink>

                    <!-- Center Navigation -->
                    <ul class="items-center justify-between hidden w-full sm:flex max-w-72" v-auto-animate>
                        <li class="flex items-center justify-center w-full" v-for="link in NAVLINKS" :key="link.href">
                            <NuxtLink
                                :to="link.href"
                                :class="{
                                    'text-sm h-5 transition-all duration-200 text-center text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white': true,
                                    'border-b-2 border-primary w-9/12 pb-6': isActiveLink(link.href),
                                }">
                                {{ link.name }}
                            </NuxtLink>
                        </li>
                    </ul>

                    <!-- Right Side -->
                    <div class="flex items-center gap-4">
                        <HeaderThemeSwitcher />
                        <!-- Hamburger Menu Button -->
                        <div
                            class="flex flex-col items-center justify-center cursor-pointer sm:hidden"
                            @click="toggleMenu">
                            <div
                                :class="{ 'transform rotate-45 translate-y-1.5': isMenuOpen }"
                                class="w-6 h-0.5 bg-black dark:bg-white transition-all duration-150"></div>
                            <div
                                :class="{ 'opacity-0': isMenuOpen }"
                                class="w-6 h-0.5 bg-black dark:bg-white transition-all duration-150 my-1"></div>
                            <div
                                :class="{ 'transform -rotate-45 -translate-y-1.5': isMenuOpen }"
                                class="w-6 h-0.5 bg-black dark:bg-white transition-all duration-150"></div>
                        </div>
                    </div>
                </div>

                <!-- Mobile Navigation -->
                <div :style="menuStyle" class="overflow-hidden sm:hidden">
                    <div ref="menuRef" class="flex flex-col items-center mt-4">
                        <ul class="flex flex-col items-center w-full pb-2">
                            <li class="pd-4" v-for="link in NAVLINKS" :key="link.href">
                                <NuxtLink
                                    :to="link.href"
                                    @click="closeMenu"
                                    :class="{
                                        'block text-center py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white': true,
                                        'border-b-2 border-primary': isActiveLink(link.href),
                                    }">
                                    {{ link.name }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>
