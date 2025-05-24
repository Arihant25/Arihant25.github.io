<script lang="ts">
	import { blogData } from '$lib/blogData';
	import { error } from '@sveltejs/kit';
	import { marked } from 'marked';

	export let data;
	const { params } = data;

	const blog = blogData.blogs.find((b) => b.slug === params.slug);
	if (!blog) throw error(404, 'Blog not found');

	let htmlContent = '';
	let contentElement;
	$: htmlContent = marked.parse(blog.content);
</script>

<svelte:head>
	<title>{blog.title} | Arihant</title>
</svelte:head>

<div class="flex min-h-screen w-full flex-col items-center bg-white px-4 py-8 sm:px-8 lg:px-16">
	<!-- Back Navigation -->
	<div class="mb-8 w-full max-w-3xl">
		<a
			href="/blog"
			class="group inline-flex items-center space-x-2 text-gray-600 transition-colors duration-200 hover:text-gray-900"
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

	<h1 class="orange mb-2 max-w-3xl text-center text-3xl font-bold sm:text-4xl lg:text-5xl">
		{blog.title}
	</h1>

	<span class="mb-4 max-w-3xl text-center text-sm text-gray-600">
		{blog.date}
	</span>

	<hr class="my-8 w-full max-w-3xl border-t border-none border-gray-200" />

	<div
		class="prose prose-slate prose-lg prose-headings:text-slate-800 prose-headings:font-semibold prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:leading-tight prose-h2:text-3xl
		       prose-h2:mt-8 prose-h2:mb-4
		       prose-h2:leading-tight prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
		       prose-h3:leading-tight prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
		       prose-h4:leading-tight prose-p:mb-5 prose-p:leading-8 prose-ul:ml-6
		       prose-ul:mb-5 prose-ol:ml-6 prose-ol:mb-5 prose-li:mb-2
		       prose-blockquote:border-l-4 prose-blockquote:border-orange-500
		       prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:ml-0
		       prose-blockquote:mr-0
		       prose-pre:bg-gray-50 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:text-sm prose-code:font-mono prose-code:bg-gray-50
		       prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:prose-code:bg-transparent
		       prose-pre:prose-code:p-0 prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline prose-img:max-w-full prose-img:h-auto
		       prose-img:rounded prose-img:my-4
		       prose-img:block prose-img:mx-auto w-full
		       max-w-3xl text-justify text-lg leading-relaxed text-gray-800"
		bind:this={contentElement}
	>
		{@html htmlContent}
	</div>
</div>
