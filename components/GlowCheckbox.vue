<!-- components/ui/glow-checkbox.vue -->
<script setup lang="ts">
interface Props {
    selected: boolean;
    disabled?: boolean;
    loading?: boolean;
}

interface Emits {
    (e: 'toggle'): void;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    loading: false,
});

const emit = defineEmits<Emits>();

const isHovering = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const buttonRef = ref<HTMLElement | null>(null);
const isDesktop = ref(false);

// Check if device supports hover on mount
onMounted(() => {
    isDesktop.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
});

const handleMouseMove = (event: MouseEvent) => {
    if (!buttonRef.value || !isDesktop.value) return;

    const rect = buttonRef.value.getBoundingClientRect();
    mousePosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
};

const handleToggle = () => {
    if (!props.disabled) {
        emit('toggle');
    }
};
</script>

<template>
    <button
        ref="buttonRef"
        type="button"
        class="relative p-2 overflow-hidden text-sm transition-colors duration-75 border rounded-md"
        :class="{
            'border-primary bg-primary/10': selected,
            'border-input desktop-hover:border-primary/40': !selected,
            'cursor-not-allowed opacity-50': disabled,
            'animate-pulse': loading,
        }"
        :disabled="disabled"
        @mousemove="handleMouseMove"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
        @click="handleToggle">
        <!-- Glow effect -->
        <div
            v-if="isDesktop"
            class="absolute transition duration-300 opacity-0 pointer-events-none -inset-px desktop-hover:opacity-100"
            :style="{
                opacity: isHovering ? 1 : 0,
                background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, 
                                hsl(var(--primary) / 0.15), 
                                transparent 40%)`,
            }" />
        <slot />
    </button>
</template>
