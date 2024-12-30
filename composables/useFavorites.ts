import type { GeneratedName } from '~/types';

const generateUniqueCode = (name: GeneratedName): string => {
    const componentsString = name.components.map((c) => c.id).join('-');
    return `${name.name}-${componentsString}`;
};

export const useFavorites = () => {
    const favorites = useState<GeneratedName[]>('favorites', () => []);
    const isInitialized = useState<boolean>('favoritesInitialized', () => false);

    // Load favorites from localStorage
    const loadFavorites = async () => {
        // Skip if not in client or already initialized
        if (!import.meta.client || isInitialized.value) return;

        try {
            const stored = localStorage.getItem('favorites');
            if (stored) {
                favorites.value = JSON.parse(stored);
            }
            isInitialized.value = true;
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    };

    // Save favorites to localStorage
    const saveFavorites = () => {
        if (!import.meta.client) return;

        try {
            localStorage.setItem('favorites', JSON.stringify(favorites.value));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    };

    // Add a name to favorites
    const addFavorite = (name: GeneratedName): boolean => {
        if (!import.meta.client) return false;

        // Ensure the name has required properties
        if (!name.name || !name.components) {
            console.error('Invalid name object:', name);
            return false;
        }

        // Generate unique code if not present
        const nameWithCode: GeneratedName = {
            ...name,
            uniqueCode: name.uniqueCode || generateUniqueCode(name),
        };

        // Check if already exists using the unique code
        if (favorites.value.some((fav) => fav.uniqueCode === nameWithCode.uniqueCode)) {
            return false;
        }

        // Update state with the new name including unique code
        favorites.value = [...favorites.value, nameWithCode];
        saveFavorites();
        return true;
    };

    // Remove a name from favorites
    const removeFavorite = (nameOrCode: string | GeneratedName): boolean => {
        if (!import.meta.client) return false;

        // Handle both string (uniqueCode) and GeneratedName object
        const uniqueCode =
            typeof nameOrCode === 'string' ? nameOrCode : nameOrCode.uniqueCode || generateUniqueCode(nameOrCode);

        const currentFavorites = favorites.value;
        const filteredFavorites = currentFavorites.filter(
            (fav) => fav.uniqueCode !== uniqueCode && generateUniqueCode(fav) !== uniqueCode
        );

        if (filteredFavorites.length !== currentFavorites.length) {
            favorites.value = filteredFavorites;
            saveFavorites();
            return true;
        }

        return false;
    };

    // Check if a name is in favorites
    const isFavorite = (nameOrCode: string | GeneratedName): boolean => {
        if (!import.meta.client) return false;

        const uniqueCode =
            typeof nameOrCode === 'string' ? nameOrCode : nameOrCode.uniqueCode || generateUniqueCode(nameOrCode);

        return favorites.value.some((fav) => fav.uniqueCode === uniqueCode || generateUniqueCode(fav) === uniqueCode);
    };

    // Initialize if we're on the client side
    if (import.meta.client) {
        loadFavorites();
    }

    return {
        favorites,
        isInitialized,
        addFavorite,
        removeFavorite,
        isFavorite,
        loadFavorites,
    };
};
