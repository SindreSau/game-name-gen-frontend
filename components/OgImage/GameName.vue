<!-- components/OgImage/GameName.vue -->
<script setup lang="ts">
interface Props {
    title?: string;
    description?: string;
    mode?: 'light' | 'dark';
    styles?: string[];
}

withDefaults(defineProps<Props>(), {
    title: 'Game Name Generator',
    description: 'Generate unique game character names',
    mode: 'dark',
    styles: () => [],
});
</script>

<template>
    <div
        :class="[
            'h-full w-full flex flex-col justify-between p-16',
            mode === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900',
        ]">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="noise" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path
                            d="M.5 60V.5H60"
                            fill="none"
                            :stroke="mode === 'dark' ? '#ffffff' : '#000000'"
                            opacity="0.3" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#noise)" />
            </svg>
        </div>

        <!-- Content -->
        <div class="relative">
            <!-- Ambient Circle -->
            <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30">
                <div
                    :class="[
                        'absolute inset-0',
                        'bg-[radial-gradient(circle_at_center_top,hsl(var(--primary))_0%,transparent_70%)]',
                    ]" />
            </div>

            <h1 class="text-[80px] font-black mb-8">{{ title }}</h1>
            <p class="text-3xl opacity-80">{{ description }}</p>

            <!-- Styles Tags -->
            <div v-if="styles.length" class="flex gap-4 mt-8">
                <span
                    v-for="style in styles"
                    :key="style"
                    class="px-4 py-2 text-lg rounded-full"
                    :class="mode === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'">
                    {{ style }}
                </span>
            </div>
        </div>

        <!-- Footer -->
        <div class="relative flex items-center justify-between">
            <img
                src="/images/logo.svg"
                class="w-32"
                :class="mode === 'dark' ? 'brightness-200' : 'hue-rotate-[190deg] brightness-125'"
                alt="Logo" />
            <p class="text-xl opacity-60">gamename.generator</p>
        </div>
    </div>
</template>
