<!-- components/OgImage/GameName.vue -->
<script setup lang="ts">
withDefaults(
    defineProps<{
        title?: string;
        description?: string;
    }>(),
    {
        title: 'title',
        description: 'description',
    }
);

const config = useRuntimeConfig();
const url = config.public.appUrl;
</script>

<template>
    <div class="h-full w-full flex items-start justify-start border-solid border-primary border-[12px] bg-background">
        <div class="flex items-start justify-start h-full">
            <div class="flex flex-col justify-between w-full h-full">
                <h1 class="text-[80px] p-20 font-black text-left text-foreground">
                    {{ title }}
                </h1>
                <p class="px-20 text-4xl font-semibold text-left text-foreground">
                    {{ description }}
                </p>
                <p class="px-20 pb-10 mb-0 text-2xl font-bold text-muted-foreground">{{ url }}</p>
            </div>
        </div>
    </div>
</template>
