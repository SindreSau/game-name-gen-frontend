<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const patternSize = ref(60);

const updatePatternSize = () => {
    // Adjust these breakpoints and sizes as needed
    if (window.innerWidth < 640) {
        // sm
        patternSize.value = 40;
    } else if (window.innerWidth < 1024) {
        // md/lg
        patternSize.value = 60;
    } else {
        // xl and above
        patternSize.value = 80;
    }
};

// Set initial size
onMounted(() => {
    updatePatternSize();
    window.addEventListener('resize', updatePatternSize);
});

// Clean up
onUnmounted(() => {
    window.removeEventListener('resize', updatePatternSize);
});
</script>

<template>
    <svg
        class="absolute inset-0 -z-10 h-full w-full stroke-zinc-600/5 dark:stroke-zinc-600/20 [mask-image:radial-gradient(100%_70%_at_top,white,transparent)]">
        <defs>
            <pattern
                id="noise"
                :width="patternSize"
                :height="patternSize"
                x="50%"
                y="50%"
                patternUnits="userSpaceOnUse"
                patternTransform="translate(-50 -50)">
                <path d="M.5 200V.5H200" fill="none"></path>
            </pattern>
        </defs>
        <rect width="100%" height="100%" stroke-width="0" fill="url(#noise)"></rect>
    </svg>
</template>
