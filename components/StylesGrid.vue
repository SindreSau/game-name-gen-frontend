// components/StylesGrid.vue
<script setup lang="ts">
import type { NameStyle } from '~/types';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
    styles: NameStyle[];
    numParts: number;
    modelValue: string[]; // for v-model of selected style IDs
    maxSelections?: number;
    showValidation?: boolean;
    isLoading?: boolean;
}

interface Emits {
    (e: 'update:modelValue', value: string[]): void;
}

const props = withDefaults(defineProps<Props>(), {
    maxSelections: 5,
    showValidation: false,
    isLoading: false,
});

const emit = defineEmits<Emits>();

const isStyleDisabled = computed(() => {
    return (styleId: string) => {
        const selectedIds = props.modelValue;
        return !selectedIds.includes(styleId) && selectedIds.length >= props.maxSelections;
    };
});

const validationState = computed(() => ({
    valid: props.numParts === 1 ? props.modelValue.length >= 1 : props.modelValue.length >= 2,
    message:
        props.numParts === 1
            ? 'Select at least one style when using one part'
            : 'Select at least two styles when using multiple parts',
}));

const handleSelectionChange = (styleId: string, checked: boolean) => {
    const currentSelection = [...props.modelValue];

    if (checked && currentSelection.length < props.maxSelections) {
        currentSelection.push(styleId);
    } else if (!checked) {
        const index = currentSelection.indexOf(styleId);
        if (index > -1) {
            currentSelection.splice(index, 1);
        }
    }

    emit('update:modelValue', currentSelection);
};

const handleItemClick = (styleId: string) => {
    const currentSelection = [...props.modelValue];
    const isSelected = currentSelection.includes(styleId);

    if (isSelected) {
        const index = currentSelection.indexOf(styleId);
        if (index > -1) {
            currentSelection.splice(index, 1);
        }
    } else if (currentSelection.length < props.maxSelections) {
        currentSelection.push(styleId);
    }

    emit('update:modelValue', currentSelection);
};
</script>

<template>
    <div class="space-y-2">
        <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Name Styles (Choose up to {{ maxSelections }})
        </label>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center p-4">
            <Spinner class="w-6 h-6" />
        </div>

        <!-- Grid of Checkboxes -->
        <div v-else class="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
            <GlassCard
                v-for="style in styles"
                :key="style.id"
                as="div"
                class="flex items-center px-3 py-2 transition-opacity cursor-pointer select-none sm:py-3"
                :class="[isStyleDisabled(style.id) ? 'opacity-50 cursor-not-allowed' : '']"
                @click="handleItemClick(style.id)">
                <div class="flex items-center space-x-2">
                    <Checkbox
                        :id="style.id"
                        :checked="modelValue.includes(style.id)"
                        :disabled="isStyleDisabled(style.id)"
                        @update:checked="(checked) => handleSelectionChange(style.id, checked)" />
                    <label
                        :for="style.id"
                        class="text-sm leading-none cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {{ style.name }}
                    </label>
                </div>
            </GlassCard>
        </div>

        <!-- Selection Count & Validation Message -->
        <div
            class="text-sm"
            :class="[
                showValidation && !validationState.valid
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-zinc-500 dark:text-zinc-400',
            ]">
            Selected: {{ modelValue.length }}/{{ maxSelections }}
            <span v-if="showValidation && !validationState.valid" class="block mt-1">
                {{ validationState.message }}
            </span>
        </div>
    </div>
</template>
