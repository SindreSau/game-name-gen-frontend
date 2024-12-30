<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const colorMode = useColorMode();

// Wait for the color mode to be ready before showing the correct icon
const isDark = computed(() => colorMode.value === 'dark');
const isReady = ref(false);

const toggleTheme = () => {
    colorMode.preference = isDark.value ? 'light' : 'dark';
};

// Add a mounted hook to ensure we have the correct state
onMounted(() => {
    // Force a reactivity update and ensure client-side only
    nextTick(() => {
        isReady.value = true;
    });
});

// Computed for sr-only text to ensure SSR matches client
const srText = computed(() => {
    if (!isReady.value) return 'Switch theme';
    return `Switch to ${isDark.value ? 'light' : 'dark'} mode`;
});
</script>

<template>
    <Button
        variant="ghost"
        size="icon"
        @click="toggleTheme"
        class="relative grid w-10 h-10 rounded-full place-items-center">
        <!-- Show loading state -->
        <div v-if="!isReady" class="w-5 h-5 rounded-full bg-muted animate-pulse"></div>

        <!-- Icons container with fixed size -->
        <ClientOnly>
            <div v-if="isReady" class="relative grid w-5 h-5 place-items-center">
                <Moon
                    class="absolute transition-all duration-200"
                    :class="!isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'" />
                <Sun
                    class="absolute transition-all duration-200"
                    :class="isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'" />
            </div>
        </ClientOnly>

        <span class="sr-only">{{ srText }}</span>
    </Button>
</template>
