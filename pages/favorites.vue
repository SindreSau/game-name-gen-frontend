<script setup lang="ts">
useSeo({
    title: 'Favorites',
    description: 'Your collection of favorited names.',
});
import type { GeneratedName } from '~/types';
import { useToast } from '@/components/ui/toast/use-toast';
import { useFavorites } from '@/composables/useFavorites';

const { favorites, removeFavorite, loadFavorites } = useFavorites();
const { toast } = useToast();
const TOAST_DURATION = 1500;

// Handle loading state
const isLoading = ref(true);

// Use async setup
await loadFavorites();
isLoading.value = false;

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

const handleRemoveFromFavorites = (name: GeneratedName) => {
    const removed = removeFavorite(name);

    if (removed) {
        toast({
            description: `Removed "${name.name}" from favorites`,
            duration: TOAST_DURATION,
        });
    } else {
        toast({
            title: 'Error',
            description: 'Failed to remove from favorites',
            variant: 'destructive',
        });
    }
};
</script>

<template>
    <div class="max-w-3xl px-4 mx-auto">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-foreground">Favorite Names</h1>
            <p class="mt-2 text-muted-foreground">Your collection of saved names.</p>
        </header>

        <ClientOnly>
            <template #fallback>
                <div class="flex items-center justify-center py-8">
                    <Spinner class="w-8 h-8" />
                </div>
            </template>
            <FavoriteList :names="favorites" @copy="handleCopyName" @remove="handleRemoveFromFavorites" />
        </ClientOnly>

        <Toaster />
    </div>
</template>
