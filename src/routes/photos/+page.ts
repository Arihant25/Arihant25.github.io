import type { PageLoad } from './$types';

export interface Photo {
    id: string;
    filename: string;
    alt: string;
    width: number;
    height: number;
}

export const load: PageLoad = async ({ fetch }) => {
    try {
        // Try to fetch the photos manifest
        const response = await fetch('/photos-manifest.json');

        if (!response.ok) {
            return { photos: [] };
        }

        const photoFilenames: string[] = await response.json();

        // Create photo objects without forced sizing (will use original dimensions)
        const photos: Photo[] = photoFilenames.map((filename, index) => ({
            id: `photo-${index}`,
            filename,
            alt: `Photo ${filename}`,
            width: 0, // Will be set by CSS to maintain aspect ratio
            height: 0 // Will be set by CSS to maintain aspect ratio
        }));

        // Shuffle the photos for random arrangement
        for (let i = photos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [photos[i], photos[j]] = [photos[j], photos[i]];
        }

        return {
            photos
        };
    } catch (err) {
        console.error('Error loading photos:', err);
        return { photos: [] };
    }
};
