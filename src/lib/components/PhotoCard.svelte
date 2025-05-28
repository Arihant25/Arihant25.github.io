<script lang="ts">
	interface Photo {
		id: string;
		filename: string;
		alt: string;
		width: number;
		height: number;
	}

	interface Props {
		photo: Photo;
	}

	let { photo }: Props = $props();

	let isLoading = $state(true);

	function handleImageLoad() {
		isLoading = false;
	}

	function handleImageError() {
		isLoading = false;
	}
</script>

<div
	class="group photo-card relative overflow-hidden rounded-lg shadow-lg transition-all duration-300"
	class:loading={isLoading}
>
	<!-- Loading Overlay -->
	{#if isLoading}
		<div
			class="loading-overlay absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-100"
		>
			<div class="loading-spinner"></div>
		</div>
	{/if}

	<img
		src="/photos/{photo.filename}"
		alt={photo.alt}
		class="photo-image"
		loading="lazy"
		onload={handleImageLoad}
		onerror={handleImageError}
	/>
	<div class="absolute inset-0"></div>
</div>

<style>
	.photo-card {
		/* Let the image determine the size but constrain max dimensions */
		max-width: 400px;
		max-height: 400px;
		/* Allow natural dimensions */
		width: auto;
		height: auto;
	}

	.photo-image {
		/* Display at original size, but scale down if too large */
		width: 100%;
		height: auto;
		max-width: 400px;
		max-height: 400px;
		object-fit: contain;
	}

	/* Loading overlay */
	.loading-overlay {
		animation: fadeIn 0.2s ease-out;
		backdrop-filter: blur(2px);
		background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Loading spinner */
	.loading-spinner {
		width: 24px;
		height: 24px;
		border: 2px solid #e5e7eb;
		border-top: 2px solid #ea580c;
		border-radius: 50%;
		animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
		position: relative;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Image fade-in effect when loaded */
	.photo-image {
		transition: opacity 0.3s ease-in-out;
	}

	.photo-card:not(.loading) .photo-image {
		opacity: 1;
	}
</style>
