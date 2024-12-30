<script setup lang="ts">
import type { GeneratedName } from '~/types';
import { MoreVertical, Copy, Wand2, Heart } from 'lucide-vue-next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
    names: GeneratedName[];
}

interface Emits {
    (e: 'copy', name: GeneratedName): void;
    (e: 'generate-similar', name: GeneratedName): void;
    (e: 'favorite', name: GeneratedName): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showContent = ref(false);

// Use onMounted to handle client-side rendering
onMounted(() => {
    showContent.value = true;
});

const copyName = (name: GeneratedName) => {
    emit('copy', name);
};

const generateSimilar = (name: GeneratedName) => {
    emit('generate-similar', name);
};

const addToFavorites = (name: GeneratedName) => {
    emit('favorite', name);
};
</script>

<template>
    <div class="space-y-4">
        <h2 class="text-xl font-semibold text-foreground">Generated Names</h2>

        <ClientOnly>
            <div v-if="names.length === 0" class="text-sm text-muted-foreground">
                No names generated yet. Use the form to generate some names!
            </div>

            <ul v-else class="space-y-3">
                <li v-for="name in names" :key="name.uniqueCode">
                    <GlassCard class="p-3">
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-medium text-foreground">{{ name.name }}</span>

                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    class="p-1 transition-colors rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50">
                                    <MoreVertical class="w-4 h-4" />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    <DropdownMenuItem @click="copyName(name)">
                                        <Copy class="w-4 h-4 mr-2" />
                                        <span>Copy</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem @click="generateSimilar(name)">
                                        <Wand2 class="w-4 h-4 mr-2" />
                                        <span>Generate Similar</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem @click="addToFavorites(name)">
                                        <Heart class="w-4 h-4 mr-2" />
                                        <span>Add to Favorites</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </GlassCard>
                </li>
            </ul>
        </ClientOnly>
    </div>
</template>
