// composables/useNameFormState.ts
import type { Gender, CaseStyle } from '~/types';

interface FormState {
    selectedStyleIds: string[];
    gender: Gender;
    numParts: number;
    caseStyle: CaseStyle;
    count: number;
    unique: boolean;
}

export const useNameFormState = () => {
    // Use useState which persists during navigation but resets on refresh
    const formState = useState<FormState>('name-form-state', () => ({
        selectedStyleIds: [],
        gender: 'neutral',
        numParts: 2,
        caseStyle: 'PascalCase',
        count: 10,
        unique: false,
    }));

    const resetFormState = () => {
        formState.value = {
            selectedStyleIds: [],
            gender: 'neutral',
            numParts: 2,
            caseStyle: 'PascalCase',
            count: 10,
            unique: false,
        };
    };

    return {
        formState,
        resetFormState,
    };
};
