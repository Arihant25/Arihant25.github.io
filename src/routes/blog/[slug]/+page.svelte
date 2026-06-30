<script lang="ts">
	import { blogData } from '$lib/blogData';
	import { error } from '@sveltejs/kit';
	import { marked } from 'marked';

	export let data;
	const { params } = data;

	const blog = blogData.blogs.find((b) => b.slug === params.slug);
	if (!blog) throw error(404, 'Blog not found');

	marked.setOptions({ gfm: true, breaks: false });

	let htmlContent = '';
	let contentElement;
	$: htmlContent = marked.parse(blog.content) as string;

	const articleSchema = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: blog.title,
		description: blog.description,
		image: blog.coverImage,
		url: `https://arihant25.github.io/blog/${blog.slug}`,
		datePublished: new Date(blog.date).toISOString(),
		author: {
			'@type': 'Person',
			name: 'Arihant',
			url: 'https://arihant25.github.io'
		},
		publisher: {
			'@type': 'Person',
			name: 'Arihant',
			url: 'https://arihant25.github.io'
		}
	};
</script>

<svelte:head>
	<title>{blog.title} | Arihant</title>
	<meta name="description" content={blog.description} />
	<link rel="canonical" href="https://arihant25.github.io/blog/{blog.slug}" />
	<meta property="og:title" content="{blog.title} | Arihant's Corner" />
	<meta property="og:description" content={blog.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://arihant25.github.io/blog/{blog.slug}" />
	<meta property="og:image" content={blog.coverImage} />
	<meta property="article:published_time" content={new Date(blog.date).toISOString()} />
	<meta name="twitter:title" content="{blog.title} | Arihant's Corner" />
	<meta name="twitter:description" content={blog.description} />
	<meta name="twitter:image" content={blog.coverImage} />
	{@html `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`}
</svelte:head>

<div
	class="grid-bg flex min-h-screen w-full flex-col items-center"
	style="background-color: var(--bg-primary); color: var(--text-primary);"
>
	<!-- Back Navigation -->
	<div class="w-full max-w-3xl px-5 pt-20 sm:px-6 lg:px-8">
		<div class="mb-8">
			<a
				href="/blog"
				class="group inline-flex items-center space-x-2 text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
			>
				<svg
					class="h-4 w-4 transition-transform group-hover:-translate-x-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					></path>
				</svg>
				<span class="text-sm font-medium">Back to Blog</span>
			</a>
		</div>
	</div>

	<h1
		class="orange mb-2 max-w-3xl px-5 text-center text-3xl font-bold sm:px-6 sm:text-4xl lg:px-8 lg:text-5xl"
	>
		{blog.title}
	</h1>

	<span
		class="mb-4 max-w-3xl px-5 text-center text-sm sm:px-6 lg:px-8"
		style="color: var(--text-secondary);"
	>
		{blog.date}
	</span>

	<hr
		class="my-8 w-full max-w-3xl border-t border-none px-5 sm:px-6 lg:px-8"
		style="border-color: var(--border-color);"
	/>

	<div
		class="blog-content w-full max-w-3xl px-5 text-justify text-lg leading-relaxed sm:px-6 lg:px-8"
		bind:this={contentElement}
	>
		{@html htmlContent}
	</div>
</div>

<style>
	.blog-content {
		color: var(--text-primary);
	}

	.blog-content :global(h1),
	.blog-content :global(h2),
	.blog-content :global(h3),
	.blog-content :global(h4),
	.blog-content :global(h5),
	.blog-content :global(h6) {
		color: var(--text-primary);
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 1rem;
		line-height: 1.25;
	}

	.blog-content :global(h1) {
		font-size: 2.25rem;
		margin-top: 2rem;
	}

	.blog-content :global(h2) {
		font-size: 1.875rem;
		margin-top: 2rem;
	}

	.blog-content :global(h3) {
		font-size: 1.5rem;
		margin-top: 1.5rem;
	}

	.blog-content :global(h4) {
		font-size: 1.25rem;
		margin-top: 1.5rem;
	}

	.blog-content :global(p) {
		margin-bottom: 1.25rem;
		line-height: 2;
		color: var(--text-primary);
	}

	.blog-content :global(ul),
	.blog-content :global(ol) {
		margin-left: 1.5rem;
		margin-bottom: 1.25rem;
	}

	.blog-content :global(li) {
		margin-bottom: 0.5rem;
		color: var(--text-primary);
	}

	.blog-content :global(blockquote) {
		border-left: 4px solid #ff5722;
		padding-left: 1rem;
		font-style: italic;
		color: var(--text-secondary);
		margin-left: 0;
		margin-right: 0;
	}

	.blog-content :global(pre) {
		background-color: var(--code-bg);
		color: var(--text-primary);
		padding: 1rem;
		border-radius: 0.375rem;
		overflow-x: auto;
		font-size: 0.875rem;
	}

	.blog-content :global(code) {
		font-family: var(--font-space-mono);
		background-color: var(--code-bg);
		color: var(--text-primary);
		padding: 0.125rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	.blog-content :global(pre code) {
		background-color: transparent;
		padding: 0;
	}

	.blog-content :global(strong),
	.blog-content :global(b) {
		color: var(--text-primary);
	}

	.blog-content :global(a) {
		color: #ff5722;
		text-decoration: none;
	}

	.blog-content :global(a:hover) {
		text-decoration: underline;
	}

	.blog-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.375rem;
		margin: 1rem auto;
		display: block;
	}

	.blog-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 0.95rem;
		overflow-x: auto;
		display: block;
	}

	.blog-content :global(thead) {
		border-bottom: 2px solid var(--border-color, #e2e8f0);
	}

	.blog-content :global(th) {
		text-align: left;
		padding: 0.6rem 1rem;
		font-weight: 600;
		color: var(--text-primary);
		white-space: nowrap;
	}

	.blog-content :global(td) {
		padding: 0.55rem 1rem;
		color: var(--text-primary);
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		white-space: nowrap;
	}

	.blog-content :global(tr:last-child td) {
		border-bottom: none;
	}
</style>
