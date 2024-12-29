// composables/useStyles.ts
import type { StylesResponse, NameStyle } from '~/types';

export const useStyles = () => {
    // Create storage key for caching
    const CACHE_KEY = 'styles-cache';
    const CACHE_DURATION = 3600000; // 1 hour in milliseconds

    const { data, pending, error, refresh } = useAsyncData<StylesResponse>(
        'styles',
        () =>
            $fetch<StylesResponse>('/api/v1/styles', {
                baseURL: useRuntimeConfig().public.apiBase,
            }),
        {
            // Provide default data while loading
            default: () => ({
                success: false,
                styles: [],
                count: 0,
            }),
            // Custom cache implementation
            getCachedData: (key) => {
                // Skip cache on server
                if (process.server) return undefined;

                try {
                    const cached = localStorage.getItem(CACHE_KEY);
                    if (!cached) return undefined;

                    const { data, timestamp } = JSON.parse(cached);

                    // Check if cache is still valid (less than 1 hour old)
                    if (Date.now() - timestamp > CACHE_DURATION) {
                        localStorage.removeItem(CACHE_KEY);
                        return undefined;
                    }

                    return data;
                } catch {
                    return undefined;
                }
            },
            // Transform and cache the response
            transform: (response) => {
                if (!response.success) {
                    throw new Error('Failed to fetch styles');
                }

                // Only cache on client
                if (process.client) {
                    localStorage.setItem(
                        CACHE_KEY,
                        JSON.stringify({
                            data: response,
                            timestamp: Date.now(),
                        })
                    );
                }

                return response;
            },
        }
    );

    // Computed property to make accessing styles easier
    const styles = computed(() => data.value?.styles ?? []);

    return {
        styles,
        isLoading: pending,
        error,
        refresh,
    };
};
