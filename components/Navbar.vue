<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { vAutoAnimate } from '@formkit/auto-animate/vue';

const NAVLINKS = [
    { name: 'Generator', href: '/', arialabel: 'Navigate to Generator page' },
    { name: 'Favorites', href: '/favorites', arialabel: 'Navigate to Favorites page' },
    { name: 'About', href: '/about', arialabel: 'Navigate to About page' },
];

const route = useRoute();
const currentPagePath = computed(() => route.path);

const isHovering = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const navRef = ref<HTMLElement | null>(null);
const isMenuOpen = ref(false);
const isDesktop = ref(false);

// Setup desktop detection on mount
onMounted(() => {
    isDesktop.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
});

const handleMouseMove = (event: MouseEvent) => {
    // Skip if not desktop or if it's a touch event
    if (!navRef.value || !isDesktop.value || (event as any).sourceCapabilities?.firesTouchEvents) return;

    const rect = navRef.value.getBoundingClientRect();
    mousePosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
};

const handleMouseEnter = () => {
    if (isDesktop.value) {
        isHovering.value = true;
    }
};

const handleMouseLeave = () => {
    if (isDesktop.value) {
        isHovering.value = false;
    }
};

const isActiveLink = (href: string) => {
    return href === currentPagePath.value;
};

const menuRef = ref<HTMLElement | null>(null);
const menuHeight = ref(0);

const navStyle = computed(() => ({
    borderRadius: '30px',
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
                @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave"
                @touchstart="isHovering = false"
                :style="navStyle"
                class="relative py-2 px-4 border shadow-lg opacity-100 backdrop-blur-[4px] bg-background/40 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <!-- Glow effect - desktop only -->
                <template v-if="isDesktop">
                    <div
                        class="absolute transition duration-300 opacity-0 pointer-events-none -inset-px"
                        :class="{ '!opacity-100': isHovering }"
                        :style="{
                            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, 
                                       hsl(var(--primary) / 0.1), 
                                       transparent 40%)`,
                        }" />
                </template>

                <!-- Inner glow effect - static, works on all devices -->
                <div
                    class="absolute inset-0 bg-gradient-to-r from-zinc-200/50 via-transparent to-zinc-200/50 dark:from-zinc-800/50 dark:via-transparent dark:to-zinc-800/50 blur-xl -z-10"
                    :style="navStyle" />

                <div class="flex items-center justify-between px-4">
                    <!-- Logo -->
                    <NuxtLink to="/" aria-label="Navigate to Generator page" class="font-semibold">
                        <NuxtImg
                            src="/images/logo.png"
                            class="w-28 filter dark:brightness-200 dark:hue-rotate-0 hue-rotate-[190deg] brightness-125"
                            alt="Logo"
                            format="webp"
                            quality="80"
                            width="577"
                            height="166"
                            sizes="lg:200px md:120px sm:100px" />
                    </NuxtLink>

                    <!-- Center Navigation -->
                    <ul class="items-center justify-between hidden w-full sm:flex max-w-72" v-auto-animate>
                        <li v-for="link in NAVLINKS" :key="link.href" class="flex items-center justify-center w-full">
                            <NuxtLink
                                :to="link.href"
                                :class="[
                                    'text-sm h-5 transition-all duration-200 text-center text-zinc-600 dark:text-zinc-400',
                                    isDesktop && 'desktop-hover:text-zinc-900 dark:desktop-hover:text-white',
                                    isActiveLink(link.href) && 'border-b-2 border-primary w-9/12 pb-6',
                                ]"
                                :aria-label="link.arialabel">
                                {{ link.name }}
                            </NuxtLink>
                        </li>
                    </ul>

                    <!-- Right Side -->
                    <div class="flex items-center gap-4">
                        <HeaderThemeSwitcher />
                        <!-- Hamburger Menu Button -->
                        <button
                            class="flex flex-col items-center justify-center sm:hidden"
                            @click="toggleMenu"
                            aria-label="Toggle navigation menu">
                            <div
                                :class="{ 'transform rotate-45 translate-y-1.5': isMenuOpen }"
                                class="w-6 h-0.5 bg-black dark:bg-white transition-all duration-150" />
                            <div
                                :class="{ 'opacity-0': isMenuOpen }"
                                class="w-6 h-0.5 bg-black dark:bg-white transition-all duration-150 my-1" />
                            <div
                                :class="{ 'transform -rotate-45 -translate-y-1.5': isMenuOpen }"
                                class="w-6 h-0.5 bg-black dark:bg-white transition-all duration-150" />
                        </button>
                    </div>
                </div>

                <!-- Mobile Navigation -->
                <div :style="menuStyle" class="overflow-hidden sm:hidden">
                    <div ref="menuRef" class="flex flex-col items-center mt-4">
                        <ul class="flex flex-col items-center w-full pb-2">
                            <li v-for="link in NAVLINKS" :key="link.href" class="pd-4">
                                <NuxtLink
                                    :to="link.href"
                                    @click="closeMenu"
                                    no-prefetch
                                    :class="[
                                        'block text-center py-2 text-zinc-600 dark:text-zinc-400',
                                        isDesktop && 'desktop-hover:text-zinc-900 dark:desktop-hover:text-white',
                                        isActiveLink(link.href) && 'border-b-2 border-primary',
                                    ]">
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
