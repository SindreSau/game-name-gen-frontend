<script setup lang="ts">
import type { GeneratedName } from '~/types';
import { MoreVertical, Copy, Wand2, Trash } from 'lucide-vue-next';

interface Props {
    names: GeneratedName[];
}

interface Emits {
    (e: 'copy', name: GeneratedName): void;
    (e: 'remove', name: GeneratedName): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const copyName = (name: GeneratedName) => {
    emit('copy', name);
};

const removeName = (name: GeneratedName) => {
    emit('remove', name);
};
</script>

<template>
    <div class="min-h-[200px]">
        <div v-if="names.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <p class="text-muted-foreground">No favorite names yet.</p>
            <NuxtLink to="/" class="mt-2 text-primary hover:underline"> Generate some names! </NuxtLink>
        </div>

        <ul v-else class="space-y-3">
            <li v-for="name in names" :key="name.uniqueCode || name.name">
                <GlassCard class="p-3">
                    <div class="flex items-center justify-between">
                        <span class="text-lg font-medium text-foreground">{{ name.name }}</span>

                        <div class="flex items-center gap-2">
                            <!-- Quick action buttons -->
                            <IconButton sr-text="Copy" @click="copyName(name)" tooltip="Copy name">
                                <Copy class="w-4 h-4" />
                            </IconButton>

                            <IconButton sr-text="Remove" @click="removeName(name)" tooltip="Remove from favorites">
                                <Trash class="w-4 h-4" />
                            </IconButton>
                        </div>
                    </div>
                </GlassCard>
            </li>
        </ul>
    </div>
</template>
