import type { RequestHandler } from '@sveltejs/kit';
import { blogData } from '$lib/blogData';
import { projects } from '$lib/projectData';
import { musicReleases } from '$lib/musicData';
import { researchData } from '$lib/researchData';

const site = 'https://arihant25.github.io';

const staticRoutes = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/blog', priority: '0.9', changefreq: 'weekly' },
    { path: '/code', priority: '0.9', changefreq: 'monthly' },
    { path: '/music', priority: '0.8', changefreq: 'monthly' },
    { path: '/research', priority: '0.8', changefreq: 'monthly' },
    { path: '/photos', priority: '0.7', changefreq: 'monthly' }
];

function urlEntry(path: string, priority: string, changefreq: string, lastmod?: string): string {
    return `
  <url>
    <loc>${site}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`;
}

export const GET: RequestHandler = () => {
    const blogEntries = blogData.blogs.map((b) =>
        urlEntry(`/blog/${b.slug}`, '0.8', 'monthly', new Date(b.date).toISOString().split('T')[0])
    );

    const projectEntries = projects.map((p) =>
        urlEntry(`/code/${p.slug}`, '0.7', 'monthly', `${p.year}-01-01`)
    );

    const musicEntries = musicReleases.map((r) =>
        urlEntry(`/music/${r.slug}`, '0.6', 'yearly', `${r.year}-01-01`)
    );

    const researchEntries = researchData.map((p) =>
        urlEntry(`/research/${p.slug}`, '0.8', 'monthly', `${p.year}-01-01`)
    );

    const staticEntries = staticRoutes.map(({ path, priority, changefreq }) =>
        urlEntry(path, priority, changefreq)
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticEntries.join('')}${blogEntries.join('')}${projectEntries.join('')}${musicEntries.join('')}${researchEntries.join('')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
};
