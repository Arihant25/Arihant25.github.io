import type { PageLoad } from './$types';
import { researchData } from '$lib/researchData';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const entries = () => {
    return researchData.map((paper) => ({
        slug: paper.slug
    }));
};

export const ssr = false;

export const load: PageLoad = ({ params }) => {
    const paper = researchData.find((p) => p.slug === params.slug);

    if (!paper) {
        throw error(404, 'Paper not found');
    }

    return {
        paper
    };
};
