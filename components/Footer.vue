<script lang="ts" setup>
import { Github } from 'lucide-vue-next';
</script>

<template>
    <footer class="fixed bottom-0 flex items-center justify-center w-full border-t border-muted">
        <div class="flex items-center justify-center gap-4 py-2 text-sm text-muted-foreground">
            <p>&copy; {{ new Date().getFullYear() }} @Github/SindreSau</p>
            <!-- Github logo and link -->
            <a
                class="hover:text-primary hover:rotate-12"
                href="https://www.github.com/SindreSau"
                target="_blank"
                rel="noopener noreferrer">
                <span class="sr-only">Github</span>
                <Github class="w-5" />
            </a>
        </div>
    </footer>
</template>
