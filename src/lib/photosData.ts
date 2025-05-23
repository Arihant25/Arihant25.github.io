// Photo data for the photowall
export interface Photo {
    id: string;
    filename: string;
    alt: string;
    width: number;
    height: number;
}

// This will be populated with actual photos when uploaded
export const photos: Photo[] = [
    // Example photos - replace with actual photo data when photos are uploaded
    // {
    // 	id: '1',
    // 	filename: 'photo1.jpg',
    // 	alt: 'Photo description',
    // 	width: 300,
    // 	height: 400
    // },
];

// Function to get photos from the static/photos folder
// This would typically be called from a server-side load function
export async function getPhotosFromFolder(): Promise<Photo[]> {
    // In a real implementation, this would scan the static/photos folder
    // For now, returning empty array until photos are uploaded
    return [];
}

// Function to shuffle array for random arrangement
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Function to assign random sizes to photos for varied grid layout
export function assignRandomSizes(photos: Photo[]): Photo[] {
    const sizes = [
        { width: 250, height: 200 },
        { width: 300, height: 250 },
        { width: 200, height: 300 },
        { width: 350, height: 280 },
        { width: 280, height: 350 },
        { width: 320, height: 240 },
        { width: 240, height: 320 }
    ];

    return photos.map((photo, index) => ({
        ...photo,
        ...sizes[index % sizes.length]
    }));
}
