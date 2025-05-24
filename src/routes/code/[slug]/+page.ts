import { error } from '@sveltejs/kit';
import { projects } from '$lib/projectData';
import type { Project } from '$lib/projectData';

export function load({ params }: { params: { slug: string } }) {
    const project: Project | undefined = projects.find((p) => p.slug === params.slug);

    if (!project) {
        throw error(404, 'Project not found');
    }

    return {
        project
    };
}
