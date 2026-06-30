<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import { blogData } from '$lib/blogData';

	const sortedBlogs = [...blogData.blogs].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);
</script>

<svelte:head>
	<title>Blog | Arihant</title>
	<meta
		name="description"
		content="Thoughts and write-ups by Arihant on technology, programming, and life."
	/>
	<link rel="canonical" href="https://arihant25.github.io/blog" />
	<meta property="og:title" content="Blog | Arihant's Corner" />
	<meta
		property="og:description"
		content="Thoughts and write-ups by Arihant on technology, programming, and life."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://arihant25.github.io/blog" />
	<meta property="og:image" content="https://arihant25.github.io/avatar.png" />
	<meta name="twitter:title" content="Blog | Arihant's Corner" />
	<meta
		name="twitter:description"
		content="Thoughts and write-ups by Arihant on technology, programming, and life."
	/>
	<meta name="twitter:image" content="https://arihant25.github.io/avatar.png" />
</svelte:head>

<div class="grid-bg mx-auto flex flex-col items-center p-5 py-12 sm:px-6 lg:px-8">
	<h1 class="mt-8 mb-16 w-full text-center text-7xl font-bold sm:text-8xl lg:text-8xl">
		Blog<span class="orange">.</span>
	</h1>

	<!-- Blog Cards Grid -->
	<div
		class="mb-12 grid grid-cols-1 place-items-center gap-8 sm:gap-12 md:grid-cols-2 md:gap-16 lg:grid-cols-3 xl:grid-cols-4"
	>
		{#each sortedBlogs as blog}
			<BlogCard {blog} />
		{/each}
	</div>
</div>
