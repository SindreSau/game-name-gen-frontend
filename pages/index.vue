// pages/index.vue (or your page component)
<script setup lang="ts">
import type { StylesResponse, GenerateNamesResponse, GeneratedName } from '~/types';
import { useToast } from '@/components/ui/toast/use-toast';

// Fetch styles at page level
const { data, status } = await useFetch<StylesResponse>('/api/v1/styles', {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
    cache: 'force-cache',
    retry: 3,
});

const pending = computed(() => status.value === 'pending');
const styles = computed(() => data.value?.styles ?? []);
const generatedNames = ref<GeneratedName[]>([]);
const { toast } = useToast();

const handleSuccess = (response: GenerateNamesResponse) => {
    generatedNames.value = response.names;
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
            description: 'Name copied to clipboard!',
        });
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to copy name',
            variant: 'destructive',
        });
    }
};

const handleGenerateSimilar = (name: GeneratedName) => {
    // TODO: Implement similar name generation
    console.log('Generate similar:', name);
};

const handleAddToFavorites = (name: GeneratedName) => {
    // TODO: Implement favorites functionality
    console.log('Add to favorites:', name);
};
</script>

<template>
    <div class="flex flex-col gap-6 max-w-7xl mx-auto lg:grid lg:grid-cols-[1fr,400px] lg:gap-6">
        <!-- Form Section -->
        <div class="p-4 mb-6 border rounded-md md:mb-0">
            <GenerateNameForm
                :styles="styles"
                :is-loading-styles="pending"
                @success="handleSuccess"
                @error="handleError" />
        </div>

        <!-- Names List Section -->
        <div>
            <NameList
                :names="generatedNames"
                @copy="handleCopyName"
                @generate-similar="handleGenerateSimilar"
                @favorite="handleAddToFavorites" />
        </div>
    </div>
</template>
