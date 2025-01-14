<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
    as?: string;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
});

const cardRef = ref<HTMLElement | null>(null);
const isHovering = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const isDesktop = ref(false);

onMounted(() => {
    isDesktop.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
});

const handleMouseMove = (event: MouseEvent) => {
    if (!cardRef.value || !isDesktop.value) return;

    const rect = cardRef.value.getBoundingClientRect();
    mousePosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
};
</script>

<template>
    <component
        :is="as"
        ref="cardRef"
        @mousemove="handleMouseMove"
        @mouseenter="isDesktop && (isHovering = true)"
        @mouseleave="isDesktop && (isHovering = false)"
        class="relative overflow-hidden rounded-lg"
        :class="props.class">
        <!-- Inner glow - lowest z-index -->
        <div
            class="absolute inset-0 rounded-lg bg-gradient-to-r from-zinc-200/50 via-transparent to-zinc-200/50 dark:from-zinc-800/50 dark:via-transparent dark:to-zinc-800/50 blur-xl -z-10" />

        <!-- Background with glass effect - middle z-index -->
        <div
            class="absolute inset-0 rounded-lg bg-white/70 dark:bg-zinc-900/40 backdrop-blur-[4px] border border-zinc-200 dark:border-zinc-800 z-0" />

        <!-- Glow effect - higher z-index -->
        <div
            v-if="isDesktop"
            class="absolute z-10 transition duration-300 pointer-events-none -inset-px"
            :style="{
                opacity: isHovering ? 1 : 0,
                background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, 
                    hsl(var(--primary) / 0.1), 
                    transparent 40%)`,
            }" />

        <!-- Content - highest z-index -->
        <div class="relative">
            <slot />
        </div>
    </component>
</template>
