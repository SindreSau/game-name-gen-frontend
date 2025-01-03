interface SeoMeta {
    title: string;
    description: string;
    image?: string;
    url?: string;
}

export function useSeo({ title, description, image, url }: SeoMeta) {
    const config = useRuntimeConfig();
    const route = useRoute();

    const siteUrl = config.public.appUrl;

    const currentUrl = url || `${siteUrl}${route.path}`;
    const ogImage = image || `${siteUrl}/images/social-card.jpg`;

    useHead({
        title,
        meta: [
            { name: 'description', content: description },
            // Open Graph
            // { property: 'og:title', content: title },
            // { property: 'og:description', content: description },
            // { property: 'og:image', content: ogImage },
            // { property: 'og:url', content: currentUrl },
            // // Twitter
            // { name: 'twitter:title', content: title },
            // { name: 'twitter:description', content: description },
            // { name: 'twitter:image', content: ogImage },
            // { name: 'twitter:card', content: 'summary_large_image' },
        ],
        link: [
            { rel: 'canonical', href: currentUrl },
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        ],
        htmlAttrs: { lang: 'en' },
    });
}
