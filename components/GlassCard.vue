// components/GlassCard.vue
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

const handleMouseMove = (event: MouseEvent) => {
    if (!cardRef.value) return;

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
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
        class="relative overflow-hidden rounded-lg"
        :class="props.class">
        <!-- Background with glass effect -->
        <div
            class="absolute inset-0 rounded-lg bg-white/70 dark:bg-zinc-900/40 backdrop-blur-[4px] border border-zinc-200 dark:border-zinc-800" />

        <!-- Glow effect -->
        <div
            class="absolute transition duration-300 pointer-events-none -inset-px"
            :style="{
                opacity: isHovering ? 1 : 0,
                background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, 
                    hsl(var(--primary) / 0.1), 
                    transparent 40%)`,
            }" />

        <!-- Inner glow -->
        <div
            class="absolute inset-0 rounded-lg bg-gradient-to-r from-zinc-200/50 via-transparent to-zinc-200/50 dark:from-zinc-800/50 dark:via-transparent dark:to-zinc-800/50 blur-xl -z-10" />

        <!-- Content -->
        <div class="relative">
            <slot />
        </div>
    </component>
</template>
