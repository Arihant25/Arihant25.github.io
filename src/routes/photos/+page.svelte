<script lang="ts">
	import PhotoCard from '$lib/components/PhotoCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let lightboxIndex = $state<number | null>(null);
	let fullLoaded = $state(false);

	const current = $derived(lightboxIndex === null ? null : data.photos[lightboxIndex]);

	function openLightbox(index: number) {
		lightboxIndex = index;
		fullLoaded = false;
	}

	function closeLightbox() {
		lightboxIndex = null;
	}

	function step(delta: number) {
		if (lightboxIndex === null) return;
		const count = data.photos.length;
		lightboxIndex = (lightboxIndex + delta + count) % count;
		fullLoaded = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (lightboxIndex === null) return;
		if (event.key === 'Escape') closeLightbox();
		else if (event.key === 'ArrowRight') step(1);
		else if (event.key === 'ArrowLeft') step(-1);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>Photos | Arihant</title>
	<meta name="description" content="A personal photo gallery by Arihant." />
	<link rel="canonical" href="https://arihant25.github.io/photos" />
	<meta property="og:title" content="Photos | Arihant's Corner" />
	<meta property="og:description" content="A personal photo gallery by Arihant." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://arihant25.github.io/photos" />
	<meta property="og:image" content="https://arihant25.github.io/avatar.png" />
	<meta name="twitter:title" content="Photos | Arihant's Corner" />
	<meta name="twitter:description" content="A personal photo gallery by Arihant." />
	<meta name="twitter:image" content="https://arihant25.github.io/avatar.png" />
</svelte:head>

<div class="mx-auto flex flex-col items-center p-4 py-12 sm:px-6 lg:px-8">
	<h1 class="mt-8 mb-16 w-full text-center text-7xl font-bold sm:text-8xl lg:text-8xl">
		Photos<span class="orange">.</span>
	</h1>

	{#if data.photos.length > 0}
		<!-- Photowall - True masonry layout -->
		<div class="photowall-container">
			<div class="masonry-grid">
				{#each data.photos as photo, index (photo.id)}
					<PhotoCard {photo} onopen={() => openLightbox(index)} />
				{/each}
			</div>
		</div>
	{:else}
		<!-- Empty state -->
		<div class="flex flex-col items-center justify-center py-20 text-center">
			<div class="mb-4 text-6xl opacity-20">📷</div>
			<h2 class="mb-2 text-2xl font-semibold text-gray-700 dark:text-gray-300">No photos yet</h2>
			<p class="text-gray-500 dark:text-gray-400">
				Photos will appear here once they're uploaded to the static/photos folder.
			</p>
		</div>
	{/if}
</div>

<!-- Lightbox -->
{#if current}
	<div
		class="lightbox fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
		onclick={closeLightbox}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-label={current.alt}
		tabindex="-1"
	>
		<!-- Thumb as instant stand-in, full-res original fades in over it -->
		<div
			class="lightbox-frame relative"
			style="aspect-ratio: {current.width} / {current.height}; width: min(
				92vw,
				1400px,
				calc(88vh * {current.width} / {current.height})
			);"
		>
			<img src={current.thumb} alt="" aria-hidden="true" class="h-full w-full object-contain" />
			<img
				src={current.src}
				alt={current.alt}
				class="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
				class:opacity-0={!fullLoaded}
				onload={() => (fullLoaded = true)}
			/>
			{#if !fullLoaded}
				<div class="absolute right-3 bottom-3">
					<div class="lightbox-spinner"></div>
				</div>
			{/if}
		</div>

		<button
			class="lightbox-btn absolute top-4 right-4"
			onclick={(e) => {
				e.stopPropagation();
				closeLightbox();
			}}
			aria-label="Close"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>

		<button
			class="lightbox-btn absolute left-3 md:left-6"
			onclick={(e) => {
				e.stopPropagation();
				step(-1);
			}}
			aria-label="Previous photo"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<button
			class="lightbox-btn absolute right-3 md:right-6"
			onclick={(e) => {
				e.stopPropagation();
				step(1);
			}}
			aria-label="Next photo"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<div
			class="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white"
		>
			{(lightboxIndex ?? 0) + 1} / {data.photos.length}
		</div>
	</div>
{/if}

<style>
	.photowall-container {
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.masonry-grid {
		columns: 4;
		column-gap: 8px;
		width: 100%;
	}

	/* Responsive column adjustments */
	@media (max-width: 1200px) {
		.masonry-grid {
			columns: 3;
			column-gap: 6px;
		}
	}

	@media (max-width: 768px) {
		.masonry-grid {
			columns: 2;
			column-gap: 4px;
		}

		.photowall-container {
			padding: 0 0.5rem;
		}
	}

	@media (max-width: 480px) {
		.masonry-grid {
			columns: 1;
			column-gap: 0;
		}
	}

	/* Ensure each photo card doesn't break across columns */
	:global(.photo-card) {
		break-inside: avoid;
		margin-bottom: 8px;
		display: block;
		width: 100%;
	}

	/* Tighter spacing on smaller screens */
	@media (max-width: 768px) {
		:global(.photo-card) {
			margin-bottom: 4px;
		}
	}

	/* Lightbox */
	.lightbox {
		animation: lightboxIn 0.25s ease-out;
	}

	@keyframes lightboxIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.lightbox-frame {
		animation: frameIn 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}

	@keyframes frameIn {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.lightbox-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 9999px;
		color: white;
		background: rgba(255, 255, 255, 0.1);
		transition:
			background 0.2s ease,
			transform 0.2s ease;
	}

	.lightbox-btn:hover {
		background: rgba(255, 87, 34, 0.8);
		transform: scale(1.08);
	}

	.lightbox-btn.left-3,
	.lightbox-btn.right-3 {
		top: 50%;
		transform: translateY(-50%);
	}

	.lightbox-btn.left-3:hover,
	.lightbox-btn.right-3:hover {
		transform: translateY(-50%) scale(1.08);
	}

	.lightbox-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ff5722;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
