<template>
    <!-- Ambient Circle -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] -z-10">
        <!-- Light mode ambient -->
        <div class="absolute inset-0 dark:hidden">
            <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_center_top,hsl(var(--primary))_0%,transparent_80%)] opacity-10"></div>
        </div>
        <!-- Dark mode ambient -->
        <div class="absolute inset-0 hidden dark:block">
            <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_center_top,hsl(var(--primary))_0%,transparent_70%)] opacity-15"></div>
        </div>
    </div>
</template>
