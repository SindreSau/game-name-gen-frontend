<template>
    <div class="flex items-center justify-center">
        <div :class="spinnerClasses" class="border-b-4 rounded-full border-t-3 border-primary/50 animate-spin"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'Spinner',
    props: {
        size: {
            type: String,
            default: 'md',
            validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
        },
    },
    setup(props) {
        const spinnerClasses = computed(() => {
            switch (props.size) {
                case 'sm':
                    return 'w-6 h-6';
                case 'md':
                    return 'w-10 h-10';
                case 'lg':
                    return 'w-16 h-16';
            }
        });

        return {
            spinnerClasses,
        };
    },
});
</script>

<style scoped></style>
