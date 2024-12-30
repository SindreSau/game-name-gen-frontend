import { useFavorites } from '~/composables/useFavorites';

export default defineNuxtRouteMiddleware((to) => {
    // Only run on favorites page
    if (to.path === '/favorites') {
        const { loadFavorites } = useFavorites();
        loadFavorites();
    }
});
