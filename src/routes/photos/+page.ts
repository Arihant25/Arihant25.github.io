import type { PageLoad } from './$types';

export interface Photo {
	id: string;
	src: string; // full-resolution original, used in the lightbox
	thumb: string; // optimized WebP thumbnail for the grid
	width: number;
	height: number;
	placeholder: string; // tiny blurred data URI shown while the thumb loads
	alt: string;
}

interface ManifestEntry {
	src: string;
	thumb: string;
	width: number;
	height: number;
	placeholder: string;
}

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/photos-manifest.json');

		if (!response.ok) {
			return { photos: [] };
		}

		const entries: ManifestEntry[] = await response.json();

		const photos: Photo[] = entries.map((entry, index) => ({
			id: `photo-${index}`,
			src: `/photos/${entry.src}`,
			thumb: `/photos/${entry.thumb}`,
			width: entry.width,
			height: entry.height,
			placeholder: entry.placeholder,
			alt: `Photo ${entry.src}`
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
