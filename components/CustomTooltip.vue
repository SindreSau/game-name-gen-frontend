<script setup lang="ts">
interface Props {
    text: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
}

const props = withDefaults(defineProps<Props>(), {
    side: 'top',
    align: 'center',
    sideOffset: 8,
});

const isVisible = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);

const updatePosition = () => {
    if (!triggerRef.value || !tooltipRef.value) return;

    const triggerRect = triggerRef.value.getBoundingClientRect();
    const tooltipRect = tooltipRef.value.getBoundingClientRect();

    let x = 0;
    let y = 0;

    // Calculate position based on side
    switch (props.side) {
        case 'top':
            y = triggerRect.top - tooltipRect.height - props.sideOffset;
            break;
        case 'bottom':
            y = triggerRect.bottom + props.sideOffset;
            break;
        case 'left':
            x = triggerRect.left - tooltipRect.width - props.sideOffset;
            break;
        case 'right':
            x = triggerRect.right + props.sideOffset;
            break;
    }

    // Calculate position based on align
    switch (props.align) {
        case 'start':
            if (props.side === 'top' || props.side === 'bottom') {
                x = triggerRect.left;
            } else {
                y = triggerRect.top;
            }
            break;
        case 'center':
            if (props.side === 'top' || props.side === 'bottom') {
                x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            } else {
                y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
            }
            break;
        case 'end':
            if (props.side === 'top' || props.side === 'bottom') {
                x = triggerRect.right - tooltipRect.width;
            } else {
                y = triggerRect.bottom - tooltipRect.height;
            }
            break;
    }

    tooltipRef.value.style.position = 'fixed';
    tooltipRef.value.style.left = `${x}px`;
    tooltipRef.value.style.top = `${y}px`;
};

onMounted(() => {
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
});

onUnmounted(() => {
    window.removeEventListener('scroll', updatePosition, true);
    window.removeEventListener('resize', updatePosition);
});

watch(isVisible, (newValue) => {
    if (newValue) {
        nextTick(() => {
            updatePosition();
        });
    }
});
</script>

<template>
    <div v-auto-animate class="inline-block">
        <!-- Trigger wrapper that keeps the original content intact -->
        <div
            ref="triggerRef"
            @mouseenter="isVisible = true"
            @mouseleave="isVisible = false"
            @focus="isVisible = true"
            @blur="isVisible = false">
            <slot />
        </div>

        <!-- Tooltip Portal -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="scale-95 opacity-0"
                enter-to-class="scale-100 opacity-100"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="scale-100 opacity-100"
                leave-to-class="scale-95 opacity-0">
                <div
                    v-if="isVisible"
                    ref="tooltipRef"
                    class="fixed z-[9999] px-3 py-1.5 text-sm text-popover-foreground rounded-md shadow-md backdrop-blur-[4px] bg-popover/80 border border-border">
                    {{ text }}
                </div>
            </Transition>
        </Teleport>
    </div>
</template>
