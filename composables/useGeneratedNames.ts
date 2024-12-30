// composables/useGeneratedNames.ts
import type { GeneratedName } from '~/types';

export const useGeneratedNames = () => {
    const generatedNames = useState<GeneratedName[]>('generated-names', () => []);
    const isInitialized = useState<boolean>('generatedNamesInitialized', () => false);

    // Load from localStorage
    const loadGeneratedNames = () => {
        if (!import.meta.client || isInitialized.value) return;

        try {
            const stored = localStorage.getItem('generated-names');
            if (stored) {
                generatedNames.value = JSON.parse(stored);
            }
            isInitialized.value = true;
        } catch (error) {
            console.error('Failed to load generated names:', error);
        }
    };

    // Save to localStorage
    const saveGeneratedNames = () => {
        if (!import.meta.client) return;

        try {
            localStorage.setItem('generated-names', JSON.stringify(generatedNames.value));
        } catch (error) {
            console.error('Failed to save generated names:', error);
        }
    };

    // Update names
    const updateGeneratedNames = (names: GeneratedName[]) => {
        generatedNames.value = names;
        saveGeneratedNames();
    };

    // Initialize if on client side
    if (import.meta.client) {
        loadGeneratedNames();
    }

    return {
        generatedNames,
        updateGeneratedNames,
        loadGeneratedNames,
    };
};
