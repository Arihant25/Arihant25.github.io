<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import { blogData } from '$lib/blogData';

	const sortedBlogs = [...blogData.blogs].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);
</script>

<div class="mx-auto flex flex-col items-center p-4 py-12 sm:px-6 lg:px-8">
	<h1 class="mb-16 w-full text-center text-7xl font-bold sm:text-8xl lg:text-8xl">
		Blog<span class="orange">.</span>
	</h1>

	<!-- Blog Cards Grid -->
	<div class="mb-12 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each sortedBlogs as blog}
			<BlogCard {blog} />
		{/each}
	</div>
</div>
