// components/RadioBadgeGroup.vue
<script setup lang="ts">
interface Option {
    value: string | number;
    label: string;
}

interface Props {
    modelValue: string | number;
    options: Option[];
    name: string;
    label?: string;
}

interface Emits {
    (e: 'update:modelValue', value: string | number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleChange = (value: string | number) => {
    emit('update:modelValue', value);
};
</script>

<template>
    <div class="space-y-2">
        <label v-if="label" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {{ label }}
        </label>

        <div class="flex flex-wrap gap-2">
            <label
                v-for="option in options"
                :key="option.value"
                :class="[
                    'relative inline-flex items-center justify-center px-4 py-2 rounded-full border transition-colors cursor-pointer whitespace-nowrap text-sm',
                    modelValue === option.value
                        ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                        : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground',
                ]">
                <input
                    type="radio"
                    :name="name"
                    :value="option.value"
                    :checked="modelValue === option.value"
                    @change="handleChange(option.value)"
                    class="absolute appearance-none" />
                <span>{{ option.label }}</span>
            </label>
        </div>
    </div>
</template>
