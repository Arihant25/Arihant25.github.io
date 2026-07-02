// Build-time asset optimizer.
// - Generates WebP thumbnails + blur placeholders for static/photos and writes photos-manifest.json
// - Generates WebP versions of research paper pages/covers into _opt/ subfolders
// - Generates WebP versions of project images into _opt/ subfolders
// Incremental: skips files whose optimized output is newer than the source.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, 'static');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function isImage(file) {
	return IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function upToDate(src, out) {
	try {
		return fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;
	} catch {
		return false;
	}
}

function webpName(file) {
	return `${path.basename(file, path.extname(file))}.webp`;
}

async function toWebp(src, out, width, quality) {
	if (upToDate(src, out)) return false;
	fs.mkdirSync(path.dirname(out), { recursive: true });
	await sharp(src)
		.rotate() // respect EXIF orientation
		.resize({ width, withoutEnlargement: true })
		.webp({ quality })
		.toFile(out);
	return true;
}

// ---------- Photos ----------
async function optimizePhotos() {
	const photosDir = path.join(staticDir, 'photos');
	const thumbsDir = path.join(photosDir, '_thumbs');
	const manifestPath = path.join(staticDir, 'photos-manifest.json');

	if (!fs.existsSync(photosDir)) {
		fs.writeFileSync(manifestPath, JSON.stringify([]));
		return;
	}

	// Reuse old manifest entries when the source photo hasn't changed
	let oldManifest = [];
	try {
		const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
		if (Array.isArray(parsed) && parsed.every((e) => typeof e === 'object')) {
			oldManifest = parsed;
		}
	} catch {
		// no usable old manifest
	}
	const oldBySrc = new Map(oldManifest.map((e) => [e.src, e]));

	const files = fs.readdirSync(photosDir).filter(isImage).sort();
	const manifest = [];

	for (const file of files) {
		const srcPath = path.join(photosDir, file);
		const thumbFile = webpName(file);
		const thumbPath = path.join(thumbsDir, thumbFile);
		const srcMtime = fs.statSync(srcPath).mtimeMs;

		const cached = oldBySrc.get(file);
		if (cached && cached.mtime === srcMtime && fs.existsSync(thumbPath)) {
			manifest.push(cached);
			continue;
		}

		fs.mkdirSync(thumbsDir, { recursive: true });
		const pipeline = sharp(srcPath).rotate();
		const info = await pipeline
			.clone()
			.resize({ width: 800, withoutEnlargement: true })
			.webp({ quality: 78 })
			.toFile(thumbPath);

		// Tiny blurred placeholder, inlined as a data URI (~300 bytes)
		const placeholderBuffer = await pipeline
			.clone()
			.resize({ width: 24 })
			.webp({ quality: 40 })
			.toBuffer();

		manifest.push({
			src: file,
			thumb: `_thumbs/${thumbFile}`,
			width: info.width,
			height: info.height,
			placeholder: `data:image/webp;base64,${placeholderBuffer.toString('base64')}`,
			mtime: srcMtime
		});
		console.log(`photos: optimized ${file} (${info.width}x${info.height})`);
	}

	// Remove orphaned thumbnails
	if (fs.existsSync(thumbsDir)) {
		const valid = new Set(manifest.map((e) => path.basename(e.thumb)));
		for (const file of fs.readdirSync(thumbsDir)) {
			if (!valid.has(file)) fs.rmSync(path.join(thumbsDir, file));
		}
	}

	fs.writeFileSync(manifestPath, JSON.stringify(manifest));
	console.log(`photos: manifest written with ${manifest.length} photos`);
}

// ---------- Research papers ----------
async function optimizeResearch() {
	const papersDir = path.join(staticDir, 'research', 'papers');
	if (!fs.existsSync(papersDir)) return;

	for (const slug of fs.readdirSync(papersDir)) {
		const paperDir = path.join(papersDir, slug);
		if (!fs.statSync(paperDir).isDirectory()) continue;

		for (const file of fs.readdirSync(paperDir)) {
			const srcPath = path.join(paperDir, file);
			if (!fs.statSync(srcPath).isFile() || !isImage(file)) continue;

			const optDir = path.join(paperDir, '_opt');
			let changed = await toWebp(srcPath, path.join(optDir, webpName(file)), 1100, 82);

			// Smaller variant of the cover for the research index cards
			if (file.startsWith('cover.')) {
				changed = (await toWebp(srcPath, path.join(optDir, 'cover-card.webp'), 500, 75)) || changed;
			}
			if (changed) console.log(`research: optimized ${slug}/${file}`);
		}
	}
}

// ---------- Projects ----------
async function optimizeProjects() {
	const projectsDir = path.join(staticDir, 'projects');
	if (!fs.existsSync(projectsDir)) return;

	for (const slug of fs.readdirSync(projectsDir)) {
		const projectDir = path.join(projectsDir, slug);
		if (!fs.statSync(projectDir).isDirectory()) continue;

		for (const file of fs.readdirSync(projectDir)) {
			const srcPath = path.join(projectDir, file);
			if (!fs.statSync(srcPath).isFile() || !isImage(file)) continue;

			const changed = await toWebp(
				srcPath,
				path.join(projectDir, '_opt', webpName(file)),
				1400,
				80
			);
			if (changed) console.log(`projects: optimized ${slug}/${file}`);
		}
	}
}

const start = Date.now();
await optimizePhotos();
await optimizeResearch();
await optimizeProjects();
console.log(`Asset optimization done in ${((Date.now() - start) / 1000).toFixed(1)}s`);
