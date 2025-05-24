import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { musicReleases } from '$lib/musicData';

export const load: PageLoad = async ({ params }) => {
    // This function is executed for each page load with the given parameters
    // We'll handle this on the client side with the provided slug parameter
    return {
        slug: params.slug
    };
};

export async function entries() {
    return musicReleases.map((release) => ({
        slug: release.slug
    }));
}
