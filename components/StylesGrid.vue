<!-- components/StylesGrid.vue -->
<script setup lang="ts">
import type { NameStyle } from '~/types';

interface Props {
    modelValue: string[];
    styles: NameStyle[];
    numParts: number;
    showValidation?: boolean;
    isLoading?: boolean;
    maxSelections?: number;
}

interface Emits {
    (e: 'update:modelValue', value: string[]): void;
}

const props = withDefaults(defineProps<Props>(), {
    showValidation: false,
    isLoading: false,
    maxSelections: 5,
});

const emit = defineEmits<Emits>();

// Validate that all selected IDs exist in the available styles
const validSelectedIds = computed(() => {
    const availableIds = new Set(props.styles.map((style) => style.id));
    return props.modelValue.filter((id) => availableIds.has(id));
});

const selectedCount = computed(() => props.modelValue.length);

const isSelected = (styleId: string) => props.modelValue.includes(styleId);

// Add watch to clean up invalid IDs
watch(
    () => props.modelValue,
    (newValue) => {
        const validIds = validSelectedIds.value;
        if (validIds.length !== newValue.length) {
            // If there are invalid IDs, emit update with only valid ones
            emit('update:modelValue', validIds);
        }
    },
    { immediate: true }
);

const canSelectMore = computed(() => {
    return selectedCount.value < props.maxSelections;
});

const canDeselect = computed(() => {
    // If using multiple parts, require at least 2 styles
    if (props.numParts > 1) {
        return selectedCount.value > 2;
    }
    // If using single part, require at least 1 style
    return selectedCount.value > 1;
});

const toggleStyle = (styleId: string) => {
    const isCurrentlySelected = isSelected(styleId);

    // Handle deselection
    if (isCurrentlySelected) {
        // Prevent deselection if it would violate minimum requirements
        if (!canDeselect.value && props.numParts > 1 && selectedCount.value <= 2) {
            return;
        }
        if (!canDeselect.value && props.numParts === 1 && selectedCount.value <= 1) {
            return;
        }
        const newSelection = props.modelValue.filter((id) => id !== styleId);
        emit('update:modelValue', newSelection);
        return;
    }

    // Handle selection
    if (!canSelectMore.value) {
        return;
    }

    const newSelection = [...props.modelValue, styleId];
    emit('update:modelValue', newSelection);
};

const validationMessage = computed(() => {
    if (!props.showValidation) return '';

    if (props.numParts === 1 && selectedCount.value < 1) {
        return 'Select at least one style when using one part';
    }

    if (props.numParts > 1 && selectedCount.value < 2) {
        return 'Select at least two styles when using multiple parts';
    }

    return '';
});

const isValid = computed(() => {
    if (props.numParts === 1) {
        return selectedCount.value >= 1;
    }
    return selectedCount.value >= 2;
});

const handleToggle = (styleId: string) => {
    toggleStyle(styleId);
};
</script>

<template>
    <div v-auto-animate class="space-y-2">
        <div class="flex items-center justify-between">
            <label class="text-sm font-medium leading-none"> Name Styles (Choose up to {{ maxSelections }}) </label>
            <span class="text-sm text-muted-foreground"> Selected: {{ selectedCount }}/{{ maxSelections }} </span>
        </div>

        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            <GlowCheckbox
                v-for="style in styles"
                :key="style.id"
                :selected="isSelected(style.id)"
                :disabled="isLoading || (!isSelected(style.id) && !canSelectMore)"
                :loading="isLoading"
                @toggle="handleToggle(style.id)">
                {{ style.name }}
            </GlowCheckbox>
        </div>

        <!-- Validation Message -->
        <p v-if="showValidation && !isValid" class="text-sm text-destructive">
            {{ validationMessage }}
        </p>
    </div>
</template>
