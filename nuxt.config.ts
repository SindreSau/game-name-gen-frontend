// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        // Private keys are only available on the server
        // apiSecret: process.env.NUXT_API_SECRET

        // Public keys that are exposed to the client
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3030', // Adjust this to your API URL
        },
    },
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    experimental: {
        componentIslands: true,
        // viewTransition: true,
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    components: {
        dirs: ['~/components', '~/components/ui', '~/components/header'],
    },
    app: {
        pageTransition: { name: 'page', mode: 'out-in', duration: 100 },
        head: {
            title: 'Game Name Generator',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Generate unique and creative names for your games',
                },
            ],
            link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
        },
    },
    modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/color-mode', '@nuxt/image'],
    shadcn: {
        prefix: '',
        componentDir: './components/ui',
    },
    tailwindcss: {
        cssPath: './assets/css/tailwind.css',
        configPath: './tailwind.config.js',
    },
    colorMode: {
        preference: 'system', // default value of $colorMode.preference
        fallback: 'dark', // fallback value if not system preference found
        hid: 'nuxt-color-mode-script',
        globalName: '__NUXT_COLOR_MODE__',
        componentName: 'ColorScheme',
        classPrefix: '',
        classSuffix: '',
        storage: 'localStorage', // or 'sessionStorage' or 'cookie'
        storageKey: 'nuxt-color-mode',
    },
});
