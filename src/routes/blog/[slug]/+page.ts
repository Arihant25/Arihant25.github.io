import type { PageLoad } from './$types';
import { blogData } from '$lib/blogData';

export const load: PageLoad = ({ params }) => {
    return {
        params
    };
};

export async function entries() {
    return blogData.blogs.map((blog) => ({
        slug: blog.slug
    }));
}
