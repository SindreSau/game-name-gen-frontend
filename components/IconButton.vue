<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type CustomTooltip from './CustomTooltip.vue';

const props = defineProps({
    srText: {
        type: String,
        required: true,
    },
    tooltip: {
        type: String,
        default: '',
    },
    buttonClass: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['click']);

const handleClick = (event: Event) => {
    emit('click', event);
};
</script>

<template>
    <template v-if="tooltip">
        <CustomTooltip :text="tooltip">
            <button
                :class="[
                    'flex items-center justify-center p-2 hover:outline outline-primary/30 dark:outline-primary/30 transition-colors rounded',
                    buttonClass,
                ]"
                @click="handleClick">
                <slot />
                <span class="sr-only">{{ srText }}</span>
            </button>
        </CustomTooltip>
    </template>
    <template v-else>
        <button
            :class="[
                'flex items-center justify-center p-2 hover:outline outline-primary/30 dark:outline-primary/30 transition-colors rounded',
                buttonClass,
            ]"
            @click="handleClick">
            <slot />
            <span class="sr-only">{{ srText }}</span>
        </button>
    </template>
</template>
