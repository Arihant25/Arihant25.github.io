// Maps an original static image path to the optimized WebP variant
// generated at build time by optimize-assets.js (same folder, _opt/ subdir).
export function optimized(src: string): string {
	const i = src.lastIndexOf('/');
	const file = src.slice(i + 1);
	const base = file.slice(0, file.lastIndexOf('.'));
	return `${src.slice(0, i)}/_opt/${base}.webp`;
}
