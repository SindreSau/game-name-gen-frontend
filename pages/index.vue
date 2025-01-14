<script setup lang="ts">
import type { StylesResponse, GenerateNamesResponse, GeneratedName } from '~/types';
import { useGeneratedNames } from '~/composables/useGeneratedNames';
import { useToast } from '@/components/ui/toast/use-toast';
import { useFavorites } from '@/composables/useFavorites';
useSeo({
    title: 'Generator',
    description:
        'Create perfect character names for your next game characters. Save your favorites and find similar names. Perfect for RPGs, MMOs, D&D and more!',
    keywords:
        'PoE2, PoE, World of Warcraft, D&D, RPG, MMO, character names, fantasy names, gamertags, usernames, nicknames, character name generator, fantasy name generator, gamertag generator, username generator, D&D names, World of Warcraft names, RPG character names, MMO names, PoE names',
});

const { toast } = useToast();
const TOAST_DURATION = 1500;

const isGeneratedNamesLoading = ref(true);
const hasError = ref(false);

// Use the composables
const { generatedNames, updateGeneratedNames, loadGeneratedNames } = useGeneratedNames();

// Load styles data
const runtimeConfig = useRuntimeConfig();
const {
    data: stylesData,
    status,
    error,
} = await useFetch<StylesResponse>('/api/v1/styles', {
    baseURL: runtimeConfig.public.apiBase,
    method: 'GET',
    lazy: true,
});

const styles = computed(() => stylesData.value?.styles ?? []);

// Initialize generated names
await loadGeneratedNames();
isGeneratedNamesLoading.value = false;

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

const similarNames = ref<GeneratedName[]>([]);
const selectedName = ref<GeneratedName | null>(null);
const isDialogOpen = ref(false);
const isFetchingSimilar = ref(false);

const handleGenerateSimilar = async (name: GeneratedName) => {
    selectedName.value = name;
    isDialogOpen.value = true;
    isFetchingSimilar.value = true;

    try {
        const response = await $fetch<GenerateNamesResponse>('/api/v1/names/similar', {
            baseURL: runtimeConfig.public.apiBase,
            method: 'POST',
            body: {
                originalName: name,
                count: 10,
            },
        });

        similarNames.value = response.names;
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to generate similar names',
            variant: 'destructive',
        });
    } finally {
        isFetchingSimilar.value = false;
    }
};

const handleToggleFavorite = (name: GeneratedName) => {
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();

    if (isFavorite(name)) {
        if (removeFavorite(name)) {
            toast({
                description: `Removed "${name.name}" from favorites`,
                duration: TOAST_DURATION,
            });
        }
    } else {
        if (addFavorite(name)) {
            toast({
                description: `Added "${name.name}" to favorites`,
                duration: TOAST_DURATION,
            });
        }
    }
};
</script>

<template>
    <div>
        <div v-if="isGeneratedNamesLoading" class="flex items-center justify-center py-12">
            <Spinner />
        </div>

        <div v-else class="flex flex-col gap-6 max-w-7xl mx-auto lg:grid lg:grid-cols-[1fr,400px] lg:gap-6">
            <div class="p-4 mb-6 border rounded-md bg-background/30 dark:bg-zinc-800/10 md:mb-0">
                <GenerateNameForm
                    :styles="styles"
                    :is-loading-styles="false"
                    @success="handleSuccess"
                    @error="handleError" />
            </div>

            <div>
                <ClientOnly>
                    <NameList
                        :names="generatedNames"
                        @copy="handleCopyName"
                        @generate-similar="handleGenerateSimilar"
                        @toggle-favorite="handleToggleFavorite" />

                    <template #fallback>
                        <Spinner />
                    </template>
                </ClientOnly>
            </div>
        </div>

        <SimilarNamesDialog
            v-model:isOpen="isDialogOpen"
            :original-name="selectedName"
            :similar-names="similarNames"
            :is-loading="isFetchingSimilar"
            @copy="handleCopyName"
            @toggle-favorite="handleToggleFavorite" />

        <Toaster />
    </div>
</template>
