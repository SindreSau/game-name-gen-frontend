<script setup lang="ts">
import { Sun, Moon, Monitor } from 'lucide-vue-next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const colorMode = useColorMode();

const themes = [
    {
        value: 'system',
        label: 'System',
        icon: Monitor,
    },
    {
        value: 'light',
        label: 'Light',
        icon: Sun,
    },
    {
        value: 'dark',
        label: 'Dark',
        icon: Moon,
    },
] as const;

const currentIcon = computed(() => {
    if (colorMode.value === 'dark') return Moon;
    if (colorMode.value === 'light') return Sun;
    return Monitor;
});
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
                <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon
                    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span class="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem
                v-for="theme in themes"
                :key="theme.value"
                :disabled="colorMode.preference === theme.value"
                @click="colorMode.preference = theme.value">
                <component :is="theme.icon" class="w-4 h-4 mr-2" />
                <span>{{ theme.label }}</span>
                <span
                    v-if="colorMode.preference === theme.value"
                    class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <span class="text-xs text-primary">✓</span>
                </span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<style scoped>
.dark .dark\:rotate-0 {
    transform: rotate(0deg);
}
.dark .dark\:scale-100 {
    transform: scale(1);
}
.dark .dark\:-rotate-90 {
    transform: rotate(-90deg);
}
.dark .dark\:scale-0 {
    transform: scale(0);
}
</style>
