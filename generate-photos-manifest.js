import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generatePhotosManifest() {
    const photosDir = path.join(__dirname, 'static', 'photos');
    const manifestPath = path.join(__dirname, 'static', 'photos-manifest.json');

    try {
        // Check if photos directory exists
        if (!fs.existsSync(photosDir)) {
            console.log('Photos directory does not exist, creating empty manifest');
            fs.writeFileSync(manifestPath, JSON.stringify([], null, 2));
            return;
        }

        // Read all files from the photos directory
        const files = fs.readdirSync(photosDir);

        // Filter for image files
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });

        // Write the manifest
        fs.writeFileSync(manifestPath, JSON.stringify(imageFiles, null, 2));
        console.log(`Generated photos manifest with ${imageFiles.length} photos:`, imageFiles);
    } catch (error) {
        console.error('Error generating photos manifest:', error);
        // Create empty manifest on error
        fs.writeFileSync(manifestPath, JSON.stringify([], null, 2));
    }
}

generatePhotosManifest();
