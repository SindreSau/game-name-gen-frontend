<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const colorMode = useColorMode();

// Wait for the color mode to be ready before showing the correct icon
const isDark = computed(() => colorMode.value === 'dark');

const toggleTheme = () => {
    colorMode.preference = isDark.value ? 'light' : 'dark';
};

// Add a mounted hook to ensure we have the correct state
onMounted(() => {
    // Force a reactivity update
    nextTick(() => {
        colorMode.value = colorMode.value;
    });
});
</script>

<template>
    <Button variant="ghost" size="icon" @click="toggleTheme" class="relative grid w-10 h-10 place-items-center">
        <!-- Show loading state -->
        <div v-if="colorMode.unknown" class="w-5 h-5 rounded-full bg-muted animate-pulse"></div>

        <!-- Icons container with fixed size -->
        <div v-else class="relative grid w-5 h-5 place-items-center">
            <Moon
                class="absolute transition-all duration-200"
                :class="!isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'" />
            <Sun
                class="absolute transition-all duration-200"
                :class="isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'" />
        </div>

        <span class="sr-only"> Switch to {{ isDark ? 'light' : 'dark' }} mode </span>
    </Button>
</template>
