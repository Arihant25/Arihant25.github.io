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
</script>

<div
	class="group photo-card relative overflow-hidden rounded-lg shadow-lg transition-all duration-300"
>
	<img src="/photos/{photo.filename}" alt={photo.alt} class="photo-image" loading="lazy" />
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
</style>
