<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { projects } from '$lib/projectData';
	import { onMount } from 'svelte';

	let displayCount = 0;
	const targetCount = projects.length;
	const duration = 1500; // Animation duration in ms

	onMount(() => {
		const startTime = Date.now();
		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Easing function for smooth animation
			const easeOutQuad = (t: number) => t * (2 - t);
			displayCount = Math.floor(easeOutQuad(progress) * targetCount);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				displayCount = targetCount;
			}
		};
		animate();
	});
</script>

<svelte:head>
	<title>Code | Arihant</title>
	<meta
		name="description"
		content="Projects and software built by Arihant — web apps, tools, research, and more."
	/>
	<link rel="canonical" href="https://arihant25.github.io/code" />
	<meta property="og:title" content="Code | Arihant's Corner" />
	<meta
		property="og:description"
		content="Projects and software built by Arihant — web apps, tools, research, and more."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://arihant25.github.io/code" />
	<meta property="og:image" content="https://arihant25.github.io/avatar.png" />
	<meta name="twitter:title" content="Code | Arihant's Corner" />
	<meta
		name="twitter:description"
		content="Projects and software built by Arihant — web apps, tools, research, and more."
	/>
	<meta name="twitter:image" content="https://arihant25.github.io/avatar.png" />
</svelte:head>

<div class="mx-auto flex flex-col items-center p-5 py-12 sm:px-6 lg:px-8">
	<h1 class="mt-8 mb-4 w-full text-center text-7xl font-bold sm:text-8xl lg:text-8xl">
		Projects<span class="orange">.</span>
	</h1>
	<h2 class="mb-16 w-full text-center text-xl text-gray-600 dark:text-gray-400">
		{displayCount} projects and counting.
	</h2>
	<div
		class="mb-12 grid grid-cols-1 items-stretch gap-8 sm:gap-12 md:grid-cols-2 md:gap-16 lg:grid-cols-3"
	>
		{#each projects as project}
			<ProjectCard {project} />
		{/each}
	</div>
</div>
