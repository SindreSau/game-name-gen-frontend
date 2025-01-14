// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        // Private keys are only available on the server
        // apiSecret: process.env.NUXT_API_SECRET

        // Public keys that are exposed to the client
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE, // Adjust this to your API URL
            apiToken: process.env.AUTH_TOKEN || 'test-token', // Adjust this to your API token
            appUrl: process.env.NUXT_PUBLIC_APP_URL, // Adjust this to your app URL
        },
    },
    compatibilityDate: '2024-11-01',
    devtools: {
        enabled: true,
        timeline: {
            enabled: true,
        },
    },
    experimental: {
        // viewTransition: true,
        componentIslands: true,
        payloadExtraction: true,
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
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            titleTemplate: '%s | Game Character Name Generator',
            base: { href: '/' },
        },
    },
    routeRules: {
        '/': { isr: true },
        '/favorites': { isr: true },
        '/about': { static: true },
    },
    optimization: {},
    modules: [
        '@nuxtjs/tailwindcss',
        'shadcn-nuxt',
        '@nuxtjs/color-mode',
        '@nuxt/image',
        '@formkit/auto-animate/nuxt',
        '@nuxt/icon',
        '@nuxt/content',
        '@nuxtjs/seo',
        'nuxt-umami',
        '@nuxt/scripts',
    ],
    shadcn: {
        prefix: '',
        componentDir: './components/ui',
    },
    tailwindcss: {
        cssPath: './assets/css/tailwind.css',
        configPath: './tailwind.config.js',
    },
    icon: {
        serverBundle: {
            collections: ['iconamoon'],
        },
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
    content: {
        markdown: {},
    },
    schemaOrg: {
        identity: {
            name: 'Sindre Sauarlia',
            description: 'Fullstack software developer and musician',
            url: 'https://github.com/sindresau',
            '@type': 'Person',
        },
    },
    umami: {
        id: '383c237c-849f-4de8-bf1c-77fa0a9f0116',
        host: 'https://umami.sindresau.me',
        autoTrack: true,
        // proxy: 'cloak',
        // useDirective: true,
        ignoreLocalhost: true,
        // excludeQueryParams: false,
        domains: ['gamenamegen.site'],
        // customEndpoint: '/my-custom-endpoint',
        // enabled: false,
        // logErrors: true,
    },
    // site: {
    //     url: 'https://gamenamegen.site',
    //     name: 'Game Character Name Generator',
    // },
    scripts: {
        enabled: true,
        assets: {
            fallbackOnSrcOnBundleFail: true,
            strategy: 'public',
        },
        defaultScriptOptions: {
            bundle: true,
        },
    },
    seo: {
        redirectToCanonicalSiteUrl: true,
    },
});
