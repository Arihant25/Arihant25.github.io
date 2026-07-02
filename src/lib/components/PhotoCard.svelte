<script lang="ts">
	import { onMount } from 'svelte';

	interface Photo {
		id: string;
		src: string;
		thumb: string;
		width: number;
		height: number;
		placeholder: string;
		alt: string;
	}

	interface Props {
		photo: Photo;
		onopen?: () => void;
	}

	let { photo, onopen }: Props = $props();

	let loaded = $state(false);
	let revealed = $state(false);
	let card: HTMLElement;

	onMount(() => {
		// Scroll-reveal: fade the card up as it enters the viewport
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					revealed = true;
					observer.disconnect();
				}
			},
			{ rootMargin: '80px' }
		);
		observer.observe(card);
		return () => observer.disconnect();
	});
</script>

<button
	bind:this={card}
	class="group photo-card relative block w-full cursor-zoom-in overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl"
	class:revealed
	style="aspect-ratio: {photo.width} / {photo.height};"
	onclick={onopen}
	aria-label="View {photo.alt} fullscreen"
>
	<!-- Blurred placeholder (tiny inline image, always instant) -->
	<img
		src={photo.placeholder}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
	/>

	<img
		src={photo.thumb}
		alt={photo.alt}
		width={photo.width}
		height={photo.height}
		class="photo-image relative h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
		class:loaded
		loading="lazy"
		decoding="async"
		onload={() => (loaded = true)}
		onerror={() => (loaded = true)}
	/>
</button>

<style>
	.photo-card {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.6s ease-out,
			transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 0.3s ease;
	}

	.photo-card.revealed {
		opacity: 1;
		transform: translateY(0);
	}

	.photo-image {
		opacity: 0;
	}

	.photo-image.loaded {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.photo-card {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
