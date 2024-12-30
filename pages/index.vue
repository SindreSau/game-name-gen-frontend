<script setup lang="ts">
import type { StylesResponse, GenerateNamesResponse } from '~/types';
import { useGeneratedNames } from '~/composables/useGeneratedNames';
import { useToast } from '@/components/ui/toast/use-toast';
import { useFavorites } from '@/composables/useFavorites';

const { toast } = useToast();
const TOAST_DURATION = 1500;

const isLoading = ref(true);

// Use the composables
const { generatedNames, updateGeneratedNames, loadGeneratedNames } = useGeneratedNames();

// Load data
const { data: stylesData } = await useAsyncData<StylesResponse>('styles', () =>
    $fetch('/api/v1/styles', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'GET',
    })
);

const styles = computed(() => stylesData.value?.styles ?? []);

// Initialize generated names
await loadGeneratedNames();
isLoading.value = false;

const handleSuccess = (response: GenerateNamesResponse) => {
    updateGeneratedNames(response.names);

    toast({
        description: `Generated ${response.names.length} names successfully!`,
        duration: TOAST_DURATION,
    });
};

const handleError = (error: Error) => {
    toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
    });
};

const handleCopyName = async (name: GeneratedName) => {
    try {
        await navigator.clipboard.writeText(name.name);
        toast({
            description: `Copied "${name.name}" to clipboard`,
            duration: TOAST_DURATION,
        });
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to copy to clipboard',
            variant: 'destructive',
        });
    }
};

const handleGenerateSimilar = (name: GeneratedName) => {
    // TODO: Implement similar name generation
    console.log('Generate similar:', name);
};

const handleAddToFavorites = (name: GeneratedName) => {
    const { addFavorite } = useFavorites();

    if (addFavorite(name)) {
        toast({
            description: `Added "${name.name}" to favorites`,
            duration: TOAST_DURATION,
        });
    }
};
</script>

<template>
    <div>
        <div v-if="isLoading" class="flex items-center justify-center py-12">
            <Spinner class="w-8 h-8" />
        </div>

        <div v-else class="flex flex-col gap-6 max-w-7xl mx-auto lg:grid lg:grid-cols-[1fr,400px] lg:gap-6">
            <div class="p-4 mb-6 border rounded-md dark:bg-zinc-800/10 md:mb-0">
                <GenerateNameForm
                    :styles="styles"
                    :is-loading-styles="false"
                    @success="handleSuccess"
                    @error="handleError" />
            </div>

            <div>
                <NameList
                    :names="generatedNames"
                    @copy="handleCopyName"
                    @generate-similar="handleGenerateSimilar"
                    @favorite="handleAddToFavorites" />
            </div>
        </div>

        <Toaster />
    </div>
</template>
