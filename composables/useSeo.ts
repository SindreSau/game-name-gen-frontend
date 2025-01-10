interface SeoProps {
    title?: string;
    description?: string;
    keywords?: string;
}

const DEFAULT_KEYWORDS = [
    'character name generator',
    'fantasy name creator',
    'rpg character names',
    'dungeons and dragons names',
    'gaming username generator',
    'mmo character names',
    'game character creator',
    'fantasy name generator',
    'roleplaying names',
    'unique character names',
    'video game names',
    'gaming alias generator',
    'dnd name ideas',
    'mmorpg character names',
    'game username generator',
].join(', ');

export const useSeo = ({
    title = 'Generator',
    description = 'Generate unique and interesting names for your game characters.',
    keywords = '',
}: SeoProps = {}) => {
    const combinedKeywords = keywords ? `${keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;

    useSeoMeta({
        title,
        description,
        keywords: combinedKeywords,
        colorScheme: 'dark light',
        creator: 'Sindre Sauarlia',
        publisher: 'Sindre Sauarlia',
        ogImage: '/images/og.jpeg',
        twitterImage: '/images/og.jpeg',
        twitterTitle: title,
        twitterDescription: description,
    });

    useHead({
        base: { href: '/' },
        htmlAttrs: { lang: 'en' },
        link: {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon.png',
        },
    });
};
