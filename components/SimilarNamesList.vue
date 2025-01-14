# SimilarNamesList.vue
<script setup lang="ts">
import type { GeneratedName } from '~/types';
import { Copy } from 'lucide-vue-next';
import { TooltipProvider } from '@/components/ui/tooltip';
import IconButton from '@/components/IconButton.vue';

interface Props {
    names: GeneratedName[];
}

interface Emits {
    (e: 'copy', name: GeneratedName): void;
    (e: 'toggle-favorite', name: GeneratedName): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { isFavorite } = useFavorites();

// Desktop detection
const isDesktop = ref(false);
onMounted(() => {
    isDesktop.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
});

const copyName = (name: GeneratedName) => {
    emit('copy', name);
};

const toggleFavorite = (name: GeneratedName) => {
    emit('toggle-favorite', name);
};

// Provide isDesktop to child components
provide('isDesktop', isDesktop);
</script>

<template>
    <TooltipProvider>
        <div class="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto px-1">
            <ul v-auto-animate class="space-y-2">
                <li v-for="name in names" :key="name.uniqueCode">
                    <div class="p-2 transition-colors border rounded-lg sm:p-3 bg-background/50 hover:bg-background/80">
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-base font-medium truncate sm:text-lg text-foreground">
                                {{ name.name }}
                            </span>

                            <div class="flex gap-1 sm:gap-2 shrink-0">
                                <IconButton
                                    tooltip="Copy"
                                    srText="Copy"
                                    :is-desktop="isDesktop"
                                    @click="copyName(name)">
                                    <Copy class="w-4 h-4" />
                                </IconButton>
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
                    </div>
                </li>
            </ul>
        </div>
    </TooltipProvider>
</template>
