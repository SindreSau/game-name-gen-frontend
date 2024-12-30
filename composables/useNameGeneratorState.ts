import type { GeneratedName } from '~/types';

export interface FormState {
    selectedStyleIds: string[];
    gender: 'masculine' | 'feminine' | 'neutral';
    numParts: number;
    caseStyle: string;
    count: number;
    unique: boolean;
}

const DEFAULT_FORM_STATE: FormState = {
    selectedStyleIds: [], // Start with empty array
    gender: 'neutral',
    numParts: 2,
    caseStyle: 'PascalCase',
    count: 10,
    unique: false,
};

export const useNameGeneratorState = () => {
    const formState = useState<FormState>('generatorFormState', () => DEFAULT_FORM_STATE);
    const generatedNames = useState<GeneratedName[]>('generatedNames', () => []);
    const isInitialized = useState<boolean>('generatorStateInitialized', () => false);

    const clearState = () => {
        formState.value = DEFAULT_FORM_STATE;
        generatedNames.value = [];
        localStorage.removeItem('generatorFormState');
        localStorage.removeItem('generatedNames');
        isInitialized.value = false;
    };

    // Load state from localStorage
    const loadState = () => {
        if (!import.meta.client || isInitialized.value) return;

        try {
            const storedForm = localStorage.getItem('generatorFormState');
            const storedNames = localStorage.getItem('generatedNames');

            if (storedForm) {
                const parsedForm = JSON.parse(storedForm);

                // Start with default state
                const newState = { ...DEFAULT_FORM_STATE };

                // Always start with empty selectedStyleIds
                newState.selectedStyleIds = [];

                formState.value = newState;
            }

            if (storedNames) {
                const parsedNames = JSON.parse(storedNames);
                if (Array.isArray(parsedNames)) {
                    generatedNames.value = parsedNames;
                }
            }

            isInitialized.value = true;
        } catch (error) {
            console.error('Failed to load generator state:', error);
            clearState();
        }
    };

    const clearFormState = () => {
        formState.value = DEFAULT_FORM_STATE;
        localStorage.removeItem('generatorFormState');
    };

    const loadFormState = () => {
        if (!import.meta.client) return;

        try {
            const storedForm = localStorage.getItem('generatorFormState');
            if (storedForm) {
                const parsedForm = JSON.parse(storedForm);
                formState.value = {
                    ...DEFAULT_FORM_STATE,
                    ...parsedForm,
                };
            }
        } catch (error) {
            console.error('Failed to load generator form state:', error);
        }
    };

    const loadGeneratedNames = () => {
        if (!import.meta.client) return;

        try {
            const storedNames = localStorage.getItem('generatedNames');
            if (storedNames) {
                const parsedNames = JSON.parse(storedNames);
                if (Array.isArray(parsedNames)) {
                    generatedNames.value = parsedNames;
                }
            }
        } catch (error) {
            console.error('Failed to load generated names:', error);
        }
    };

    // Save state to localStorage
    const saveState = () => {
        if (!import.meta.client) return;

        try {
            // Only save selectedStyleIds to localStorage
            const stateToSave = {
                selectedStyleIds: formState.value.selectedStyleIds,
            };
            localStorage.setItem('generatorFormState', JSON.stringify(stateToSave));
            localStorage.setItem('generatedNames', JSON.stringify(generatedNames.value));
        } catch (error) {
            console.error('Failed to save generator state:', error);
        }
    };

    // Update form state
    const updateFormState = (newState: Partial<FormState>) => {
        formState.value = {
            ...formState.value,
            ...newState,
        };
        saveState();
    };

    // Update generated names
    const updateGeneratedNames = (names: GeneratedName[]) => {
        generatedNames.value = names;
        saveState();
    };

    // Initialize on client side
    if (import.meta.client) {
        loadState();
    }

    return {
        formState,
        generatedNames,
        updateFormState,
        updateGeneratedNames,
        clearState,
        clearFormState,
        loadState,
        loadFormState,
        loadGeneratedNames,
    };
};
