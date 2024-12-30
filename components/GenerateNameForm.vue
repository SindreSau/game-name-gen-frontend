<script setup lang="ts">
import type { NameStyle, GenerateNamesResponse, CaseStyle, Gender } from '~/types';
import { Checkbox } from '@/components/ui/checkbox';
import { type FormState } from '@/composables/useNameGeneratorState';

interface Props {
    styles: NameStyle[];
    isLoadingStyles?: boolean;
    formState: FormState;
}

interface Emits {
    (e: 'update:formState', value: FormState): void;
    (e: 'success', response: GenerateNamesResponse): void;
    (e: 'error', error: Error): void;
}

const props = withDefaults(defineProps<Props>(), {
    isLoadingStyles: false,
});

const emit = defineEmits<Emits>();

const hasAttemptedSubmit = ref(false);
const isGenerating = ref(false);
const { formState } = toRefs(props);

// Options for radio groups with proper typing
const genderOptions: { value: Gender; label: string }[] = [
    { value: 'masculine', label: 'Masculine' },
    { value: 'feminine', label: 'Feminine' },
    { value: 'neutral', label: 'Neutral' },
];

const numPartsOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

const caseStyleOptions: { value: CaseStyle; label: string }[] = [
    { value: 'PascalCase', label: 'PascalCase' },
    { value: 'kebab-case', label: 'kebab-case' },
    { value: 'camelCase', label: 'camelCase' },
    { value: 'snake_case', label: 'snake_case' },
    { value: 'CONSTANT_CASE', label: 'CONSTANT_CASE' },
];

const countOptions = [
    { value: 1, label: '1' },
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
];

// Update form state helper
const updateForm = (key: keyof FormState, value: any) => {
    emit('update:formState', {
        ...props.formState,
        [key]: value,
    });
};

// Validation
const validations = computed(() => ({
    styles: {
        valid:
            props.formState.numParts === 1
                ? props.formState.selectedStyleIds.length >= 1
                : props.formState.selectedStyleIds.length >= 2,
        message:
            props.formState.numParts === 1
                ? 'Select at least one style when using one part'
                : 'Select at least two styles when using multiple parts',
    },
}));

const isFormValid = computed(() => Object.values(validations.value).every((validation) => validation.valid));

// Style ID to name mapping for API
const styleIdToName = computed(() => {
    const map = new Map<string, string>();
    props.styles.forEach((style) => {
        map.set(style.id, style.name.toLowerCase());
    });
    return map;
});

// Handle form submission
const handleSubmit = async () => {
    hasAttemptedSubmit.value = true;

    if (!isFormValid.value) return;

    isGenerating.value = true;

    try {
        // Convert UUID style IDs to their corresponding identifiers
        const styleIdentifiers = props.formState.selectedStyleIds
            .map((id) => styleIdToName.value.get(id))
            .filter((name): name is string => name !== undefined);

        const response = await $fetch<GenerateNamesResponse>('/api/v1/names/generate', {
            baseURL: useRuntimeConfig().public.apiBase,
            method: 'POST',
            body: {
                ...props.formState,
                styles: styleIdentifiers,
            },
        });

        emit('success', response);
    } catch (error) {
        emit('error', error instanceof Error ? error : new Error('Failed to generate names'));
    } finally {
        isGenerating.value = false;
    }
};

// Watch numParts to update style selection
watch(
    () => props.formState.numParts,
    (newValue) => {
        if (newValue === 1 && props.formState.selectedStyleIds.length > 1) {
            updateForm('selectedStyleIds', [props.formState.selectedStyleIds[0]]);
        }
    }
);
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6 @container">
        <!-- Styles Grid -->
        <StylesGrid
            v-model="formState.selectedStyleIds"
            :styles="styles"
            :num-parts="formState.numParts"
            :show-validation="hasAttemptedSubmit"
            :is-loading="isLoadingStyles"
            @update:modelValue="(value) => updateForm('selectedStyleIds', value)" />

        <div class="@md:flex-row flex-col gap-4 flex justify-between">
            <!-- Number of Parts -->
            <RadioBadgeGroup
                v-model="formState.numParts"
                :options="numPartsOptions"
                name="numParts"
                label="Number of Parts"
                @update:modelValue="(value) => updateForm('numParts', value)" />

            <!-- Count -->
            <RadioBadgeGroup
                v-model="formState.count"
                :options="countOptions"
                name="count"
                label="Number of Names"
                @update:modelValue="(value) => updateForm('count', value)" />
        </div>

        <!-- Gender Selection -->
        <RadioBadgeGroup
            v-model="formState.gender"
            :options="genderOptions"
            name="gender"
            label="Gender"
            @update:modelValue="(value) => updateForm('gender', value)" />

        <!-- Case Style -->
        <RadioBadgeGroup
            v-model="formState.caseStyle"
            :options="caseStyleOptions"
            name="caseStyle"
            label="Case Style"
            @update:modelValue="(value) => updateForm('caseStyle', value)" />

        <!-- Unique Toggle -->
        <div class="flex items-center space-x-2">
            <Checkbox
                id="unique"
                :checked="formState.unique"
                @update:checked="(value) => updateForm('unique', value)" />
            <label
                for="unique"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Generate Unique Names
            </label>
        </div>

        <!-- Submit Button -->
        <button
            type="submit"
            :disabled="isGenerating || (hasAttemptedSubmit && !isFormValid)"
            class="w-full px-4 py-2 text-white transition-colors rounded-md bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed">
            <span v-if="isGenerating">Generating...</span>
            <span v-else-if="hasAttemptedSubmit && !isFormValid">Please fix form errors</span>
            <span v-else>Generate Names</span>
        </button>
    </form>
</template>
