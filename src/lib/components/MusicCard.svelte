<script lang="ts">
	interface Props {
		coverImage: string;
		title: string;
		description: string;
		year: string;
		slug: string;
	}

	let { coverImage, title, description, year, slug }: Props = $props();

	let isHovered = $state(false);
	let animationState = $state<'idle' | 'entering' | 'exiting'>('idle');
	let animationTimeout: number | null = null;
	let isAnimating = $state(false);

	function handleMouseEnter() {
		if (animationTimeout) {
			clearTimeout(animationTimeout);
			animationTimeout = null;
		}

		if (animationState === 'idle') {
			isHovered = true;
			animationState = 'entering';
			isAnimating = true;

			animationTimeout = setTimeout(() => {
				animationState = 'idle';
				animationTimeout = null;
				isAnimating = false;
			}, 600); // Match animation duration
		} else if (animationState === 'exiting') {
			// If currently exiting, wait for exit to complete then enter
			animationTimeout = setTimeout(
				() => {
					isHovered = true;
					animationState = 'entering';
					isAnimating = true;

					animationTimeout = setTimeout(() => {
						animationState = 'idle';
						animationTimeout = null;
						isAnimating = false;
					}, 600);
				},
				Math.max(0, 600 - (Date.now() % 600))
			); // Remaining exit time
		}
	}

	function handleMouseLeave() {
		if (animationTimeout) {
			clearTimeout(animationTimeout);
			animationTimeout = null;
		}

		if (animationState === 'idle' && isHovered) {
			isHovered = false;
			animationState = 'exiting';
			isAnimating = true;

			animationTimeout = setTimeout(() => {
				animationState = 'idle';
				animationTimeout = null;
				isAnimating = false;
			}, 600); // Match animation duration
		} else if (animationState === 'entering') {
			// If currently entering, wait for enter to complete then exit
			animationTimeout = setTimeout(
				() => {
					isHovered = false;
					animationState = 'exiting';
					isAnimating = true;

					animationTimeout = setTimeout(() => {
						animationState = 'idle';
						animationTimeout = null;
						isAnimating = false;
					}, 600);
				},
				Math.max(0, 600 - (Date.now() % 600))
			); // Remaining enter time
		}
	}

	function handleClick(event: MouseEvent) {
		// If animation is in progress, prevent default navigation
		if (isAnimating) {
			event.preventDefault();

			// Complete the animation (if not started, show it)
			if (!isHovered) {
				handleMouseEnter();
			}

			// Navigate after animation completes
			setTimeout(() => {
				window.location.href = `/music/${slug}`;
			}, 600);
		}
		// If not animating, allow default navigation
	}
</script>

<a
	href="/music/{slug}"
	class="music-card group perspective-1000 relative block h-80 w-64"
	class:hovered={isHovered}
	tabindex="0"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
>
	<!-- Vinyl disc (behind) -->
	<div class="vinyl-disc" class:slide-out={isHovered} class:slide-in={!isHovered}>
		<div class="vinyl-center"></div>
		<div class="vinyl-groove"></div>
		<div class="vinyl-groove groove-2"></div>
		<div class="vinyl-groove groove-3"></div>
	</div>

	<!-- CD Cover -->
	<div class="cd-cover" class:hovered={isHovered}>
		<img src={coverImage} alt={title} class="cover-image" />
		<div class="year-tag">{year}</div>
	</div>

	<!-- Description text -->
	<div class="mt-4 text-center">
		<h3 class="text-lg font-semibold">{title}</h3>
		<p class="mt-1 text-sm">{description}</p>
	</div>
</a>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}

	.vinyl-disc {
		position: absolute;
		top: 30px;
		left: 50%;
		transform: translateX(-50%) translateX(0px) translateZ(-10px);
		width: 200px;
		height: 200px;
		background: linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
		border-radius: 50%;
		z-index: 1;
		opacity: 0;
	}

	.vinyl-disc.slide-in {
		animation: slide-in 0.6s ease forwards;
	}

	.vinyl-disc.slide-out {
		animation: slide-out 0.6s ease forwards;
	}

	@keyframes slide-in {
		0% {
			transform: translateX(-50%) translateX(60px) translateZ(-10px);
			opacity: 1;
		}
		100% {
			transform: translateX(-50%) translateX(0px) translateZ(-10px);
			opacity: 0;
		}
	}

	@keyframes slide-out {
		0% {
			transform: translateX(-50%) translateX(0px) translateZ(-10px);
			opacity: 0;
		}
		100% {
			transform: translateX(-50%) translateX(60px) translateZ(-10px);
			opacity: 1;
		}
	}

	.vinyl-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 40px;
		height: 40px;
		background: #ff5722;
		border-radius: 50%;
		border: 2px solid #ff5722;
	}

	.vinyl-center::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 8px;
		height: 8px;
		background: #000;
		border-radius: 50%;
	}

	.vinyl-groove {
		position: absolute;
		border: 1px solid #333;
		border-radius: 50%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.vinyl-groove:nth-child(2) {
		width: 120px;
		height: 120px;
	}

	.groove-2 {
		width: 140px;
		height: 140px;
	}

	.groove-3 {
		width: 160px;
		height: 160px;
	}

	.cd-cover {
		position: relative;
		width: 240px;
		height: 240px;
		margin: 0 auto;
		transform-style: preserve-3d;
		transition: transform 0.6s ease;
		z-index: 2;
		cursor: pointer;
	}

	.cd-cover.hovered {
		transform: rotateY(-25deg) translateZ(60px) translateX(-40px);
	}

	.cover-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 8px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		transition: box-shadow 0.3s ease;
	}

	.music-card.hovered .cover-image {
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
	}

	.year-tag {
		position: absolute;
		bottom: 10px;
		right: 10px;
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 2px 4px;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: bold;
	}

	.music-card {
		transition: transform 0.3s ease;
	}

	.music-card.hovered {
		transform: translateY(-5px);
	}
</style>
