<!-- YourComponent.vue -->
<script setup lang="ts">
import type { GeneratedName } from '~/types';
import { Copy, Wand2 } from 'lucide-vue-next';
import { TooltipProvider } from '@/components/ui/tooltip';
import IconButton from '@/components/IconButton.vue';

interface Props {
    names: GeneratedName[];
    hideGenerateSimilarButton?: boolean;
}

interface Emits {
    (e: 'copy', name: GeneratedName): void;
    (e: 'generate-similar', name: GeneratedName): void;
    (e: 'toggle-favorite', name: GeneratedName): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Use the favorites composable
const { isFavorite } = useFavorites();

// Add isDesktop ref
const isDesktop = ref(false);

// Check if device supports hover on mount
onMounted(() => {
    isDesktop.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
});

const copyName = (name: GeneratedName) => {
    emit('copy', name);
};

const generateSimilar = (name: GeneratedName) => {
    emit('generate-similar', name);
};

const toggleFavorite = (name: GeneratedName) => {
    emit('toggle-favorite', name);
};

// Provide isDesktop to child components
provide('isDesktop', isDesktop);
</script>

<template>
    <TooltipProvider>
        <div v-auto-animate class="space-y-4">
            <h1 class="text-xl font-semibold text-foreground">Generated Names</h1>

            <div v-if="names.length === 0" class="text-sm text-muted-foreground">
                No names generated yet. Use the form to generate some names!
            </div>

            <ul v-else class="space-y-3">
                <li v-for="name in names" :key="name.uniqueCode">
                    <GlassCard class="p-3" :is-desktop="isDesktop">
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-medium text-foreground">{{ name.name }}</span>

                            <div class="flex space-x-2">
                                <IconButton
                                    tooltip="Copy"
                                    srText="Copy"
                                    :is-desktop="isDesktop"
                                    @click="copyName(name)">
                                    <Copy class="w-4 h-4" />
                                </IconButton>
                                <template v-if="!hideGenerateSimilarButton">
                                    <IconButton
                                        tooltip="Generate similar"
                                        srText="Generate Similar"
                                        :is-desktop="isDesktop"
                                        @click="generateSimilar(name)">
                                        <Wand2 class="w-4 h-4" />
                                    </IconButton>
                                </template>
                                <IconButton
                                    :tooltip="isFavorite(name) ? 'Remove favorite' : 'Add favorite'"
                                    :srText="isFavorite(name) ? 'Remove Favorite' : 'Add Favorite'"
                                    :is-desktop="isDesktop"
                                    @click="toggleFavorite(name)">
                                    <Icon
                                        :name="isFavorite(name) ? 'iconamoon:heart-fill' : 'iconamoon:heart'"
                                        class="w-4 h-4" />
                                </IconButton>
                            </div>
                        </div>
                    </GlassCard>
                </li>
            </ul>
        </div>
    </TooltipProvider>
</template>
