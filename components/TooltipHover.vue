<script setup lang="ts">
interface props {
    text: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
}

const props = withDefaults(defineProps<props>(), {
    text: '',
    side: 'top',
    align: 'center',
});
</script>

<template>
    <div class="flex items-center gap-1">
        <slot />
        <CustomTooltip :text="text" :align="align" :side="side">
            <Icon class="w-5 h-5" name="iconamoon:question-mark-circle-light" />
        </CustomTooltip>
    </div>
</template>
