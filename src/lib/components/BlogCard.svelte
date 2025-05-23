<script lang="ts">
	import type { Blog } from '$lib/blogData';
	import { goto } from '$app/navigation';

	export let blog: Blog;

	function handleReadMore() {
		goto(`/blog/${blog.slug}`);
	}
</script>

<div
	class="relative mx-auto flex w-full max-w-md transform flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl"
>
	<div class="relative h-auto w-full">
		<img src={blog.coverImage} alt={blog.title} class="h-52 w-full rounded-xl object-cover" />
	</div>
	<h3 class="py-4 text-2xl font-semibold text-slate-800">{blog.title}</h3>
	<span class="text-sm text-slate-500">{blog.date}</span>
	<p class="py-4 text-base text-slate-600">{blog.description}</p>
	<div class="mt-auto flex items-center justify-end pt-4 text-base">
		<button
			class="focus:ring-opacity-50 bg-orange cursor-pointer rounded-lg px-5 py-2.5 text-base font-medium text-white transition-colors duration-200 ease-in-out hover:drop-shadow-[3px_3px_5px_rgba(0,0,0,0.1)] focus:ring-2 focus:outline-none"
			on:click={handleReadMore}
		>
			Read More
		</button>
	</div>
</div>
