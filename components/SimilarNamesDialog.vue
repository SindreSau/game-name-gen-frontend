# SimilarNamesDialog.vue
<script setup lang="ts">
import type { GeneratedName } from '../types/index';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { computed } from 'vue';
import SimilarNamesList from './SimilarNamesList.vue';

const props = defineProps<{
    isOpen: boolean;
    originalName: GeneratedName | null;
    similarNames: GeneratedName[];
    isLoading: boolean;
}>();

const emit = defineEmits<{
    'update:isOpen': [boolean];
    copy: [GeneratedName];
    'toggle-favorite': [GeneratedName];
}>();

const title = computed(() => (props.originalName ? `Similar to "${props.originalName.name}"` : 'Similar Names'));
</script>

<template>
    <Dialog :open="isOpen" @update:open="emit('update:isOpen', $event)">
        <DialogContent v-show="isOpen" class="w-[95vw] sm:max-w-2xl mx-auto px-4 sm:px-6">
            <DialogHeader class="pt-6 pb-4">
                <DialogTitle class="pr-8 text-xl break-words sm:text-2xl">{{ title }}</DialogTitle>
            </DialogHeader>

            <div v-if="isLoading" class="flex justify-center py-4 sm:py-8">
                <Spinner />
            </div>

            <div v-else class="py-2">
                <SimilarNamesList
                    :names="similarNames"
                    @copy="(name) => emit('copy', name)"
                    @toggle-favorite="(name) => emit('toggle-favorite', name)" />
            </div>
        </DialogContent>
    </Dialog>
</template>
