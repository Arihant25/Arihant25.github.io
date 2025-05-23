import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    // This function is executed for each page load with the given parameters
    // We'll handle this on the client side with the provided slug parameter
    return {
        slug: params.slug
    };
};
