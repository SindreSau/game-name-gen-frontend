// composables/useOgImage.ts
export const useOgImage = () => {
    const colorMode = useColorMode();

    const defaultOgImage = () => {
        defineOgImageComponent('GameName', {
            mode: colorMode.value,
            title: 'Game Name Generator',
            description: 'Generate unique character names for your games',
        });
    };

    const generateOgImage = (title: string, description?: string, styles?: string[]) => {
        defineOgImageComponent('GameName', {
            mode: colorMode.value,
            title,
            description,
            styles,
        });
    };

    return {
        defaultOgImage,
        generateOgImage,
    };
};
