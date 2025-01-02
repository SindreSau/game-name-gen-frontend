<script setup lang="ts">
import type { GeneratedName } from '../types/index';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { computed } from 'vue';

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
        <DialogContent class="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
            </DialogHeader>

            <div v-if="isLoading" class="flex justify-center py-8">
                <Spinner />
            </div>
            <div v-else>
                <NameList
                    :names="similarNames"
                    @copy="(name) => emit('copy', name)"
                    @toggle-favorite="(name) => emit('toggle-favorite', name)"
                    hideGenerateSimilarButton="true" />
            </div>
        </DialogContent>
    </Dialog>
</template>
