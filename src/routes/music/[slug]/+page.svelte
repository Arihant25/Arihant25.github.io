<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import { musicReleases } from '$lib/musicData';

	let { data }: { data: PageData } = $props();

	// Get the slug parameter from the URL
	const slug = page.params.slug;

	// Find the current release based on the slug
	const release = musicReleases.find((r) => r.slug === slug);
</script>

<svelte:head>
	<title>{release ? `${release.title} | Arihant` : 'Music | Arihant'}</title>
	{#if release}
		<meta name="description" content={release.description} />
		<link rel="canonical" href="https://arihant25.github.io/music/{release.slug}" />
		<meta property="og:title" content="{release.title} | Arihant's Corner" />
		<meta property="og:description" content={release.description} />
		<meta property="og:type" content="music.album" />
		<meta property="og:url" content="https://arihant25.github.io/music/{release.slug}" />
		<meta property="og:image" content="https://arihant25.github.io{release.coverImage}" />
		<meta name="twitter:title" content="{release.title} | Arihant's Corner" />
		<meta name="twitter:description" content={release.description} />
		<meta name="twitter:image" content="https://arihant25.github.io{release.coverImage}" />
	{/if}
</svelte:head>

{#if release}
	<div class="mx-auto max-w-7xl px-5 pt-20 pb-12 sm:px-6 lg:px-8">
		<!-- Back button -->
		<div class="mb-8">
			<a
				href="/music"
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
				<span class="text-sm font-medium">Back to Music</span>
			</a>
		</div>

		<!-- Header with title and release info -->
		<div class="mb-10">
			<h1 class="text-4xl font-bold md:text-5xl lg:text-6xl dark:text-white">{release.title}</h1>
			<div class="mt-8 flex items-center">
				<span class="mr-4 text-xl font-semibold text-orange-500">{release.year}</span>
				<div class="rounded border border-orange-500 px-3 py-1 text-sm text-orange-500">
					{release.type}
				</div>
			</div>
		</div>

		<!-- Content area: About and Embed side by side on desktop -->
		<div class="flex flex-col gap-8 lg:flex-row">
			<!-- About this release -->
			<div class="w-full lg:w-1/3">
				<h2 class="mb-4 text-2xl font-semibold dark:text-white">About this release</h2>
				<p class="leading-relaxed dark:text-gray-200">
					{release.extendedDescription}
				</p>
			</div>

			<!-- Spotify embed -->
			<div class="w-full lg:w-2/3">
				<h2 class="mb-4 text-2xl font-semibold dark:text-white">Listen</h2>
				<div class="overflow-hidden rounded-lg">
					<iframe
						src={release.spotifyEmbed}
						style="width:100%; max-width:100%;"
						height="380"
						frameborder="0"
						allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
						loading="lazy"
						class="rounded-lg"
						title="Spotify Embed"
					></iframe>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="mx-auto flex flex-col items-center p-4 py-12 sm:px-6 lg:px-8">
		<h1 class="mb-4 text-4xl font-bold dark:text-white">Release Not Found</h1>
		<p class="mb-8 dark:text-white">The music release you're looking for doesn't exist.</p>
		<a href="/music" class="text-orange-500 hover:text-orange-600"> Return to Music </a>
	</div>
{/if}
