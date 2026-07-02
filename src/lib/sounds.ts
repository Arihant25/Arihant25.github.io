import { browser } from '$app/environment';

// Shared, preloaded audio elements so sounds play instantly anywhere on the site.
const cache = new Map<string, HTMLAudioElement>();

function get(src: string): HTMLAudioElement {
	let audio = cache.get(src);
	if (!audio) {
		audio = new Audio(src);
		audio.preload = 'auto';
		cache.set(src, audio);
	}
	return audio;
}

// Warm the cache (called from the root layout so the files are ready
// before the user ever navigates to a page that plays them).
export function preloadSounds() {
	if (!browser) return;
	get('/audio/tudum.mp3');
	get('/audio/flip.mp3');
}

function play(src: string, volume: number) {
	if (!browser) return;
	const audio = get(src);
	audio.volume = volume;
	audio.currentTime = 0;
	audio.play().catch(() => {
		// Ignore errors if audio can't play (e.g. no user interaction yet)
	});
}

export const playTudum = () => play('/audio/tudum.mp3', 0.3);
export const playFlip = () => play('/audio/flip.mp3', 1);
