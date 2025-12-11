<script lang="ts">
	import { browser } from '$app/environment';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import EdisonBulb from './EdisonBulb.svelte';
	import { onMount } from 'svelte';

	const OFFSET = -20;
	const BOUNCE = 0;
	const RANGE = 32;

	let darkMode = $state(false);
	let dragging = $state(false);
	let initialY = $state(0);
	let currentY = $state(0);
	let clicked = $state(false);
	let initialized = $state(false);

	// Computed value for light mode (inverse of dark mode)
	let lightMode = $derived(!darkMode);

	let audioRef: HTMLAudioElement | null = null;

	// Tweened animation for smooth pull effect
	const pullY = tweened(OFFSET, {
		duration: 250,
		easing: cubicOut
	});

	// Initialize dark mode from system preference
	onMount(() => {
		// Always use system preference
		darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

		// Apply dark mode class
		document.documentElement.classList.toggle('dark', darkMode);
		initialized = true;
	});

	// Update pull animation based on drag state
	$effect(() => {
		if (clicked) {
			pullY.set(BOUNCE, { duration: 250 });
		} else if (dragging) {
			pullY.set(currentY - initialY + OFFSET, { duration: 0 });
		} else {
			pullY.set(OFFSET, { duration: 250 });
		}
	});

	// Apply dark mode class when it changes
	$effect(() => {
		if (browser && initialized) {
			document.documentElement.classList.toggle('dark', darkMode);
		}
	});

	function playAudio() {
		if (browser && audioRef) {
			const audioEnabled = localStorage.getItem('audioEnabled');
			if (audioEnabled === null || audioEnabled === 'true') {
				audioRef.play().catch(() => {
					// Ignore audio play errors
				});
			}
		}
	}

	function handleMouseDown(event: MouseEvent) {
		dragging = true;
		initialY = event.clientY;
		currentY = event.clientY;
	}

	function handleMouseMove(event: MouseEvent) {
		if (dragging) {
			currentY = event.clientY < initialY ? initialY : Math.min(event.clientY, initialY + RANGE);
		}
	}

	function handleMouseOut() {
		if (dragging) {
			document.addEventListener('mouseup', handleMouseUp);
		}
	}

	function handleBlur() {
		dragging = false;
		document.removeEventListener('mouseup', handleMouseUp);
	}

	function toggleTheme(clickX?: number, clickY?: number) {
		if (!browser || !document.startViewTransition) {
			darkMode = !darkMode;
			return;
		}

		const transition = document.startViewTransition(() => {
			darkMode = !darkMode;
		});

		// Get click position or use bulb position
		let x = clickX ?? window.innerWidth - 50;
		let y = clickY ?? 30;

		// Calculate the radius needed to cover the entire viewport
		const maxRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y)
		);

		transition.ready.then(() => {
			document.documentElement.animate(
				{
					clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius * 2}px at ${x}px ${y}px)`]
				},
				{
					duration: 800,
					easing: 'ease-in-out',
					pseudoElement: '::view-transition-new(root)'
				}
			);
		});
	}

	function handleMouseUp(event?: MouseEvent) {
		dragging = false;

		const x = event?.clientX;
		const y = event?.clientY;

		toggleTheme(x, y);
		playAudio();

		if (currentY === initialY && currentY !== 0) {
			clicked = true;
			setTimeout(() => (clicked = false), 250);
		} else {
			currentY = 0;
			initialY = 0;
		}

		document.removeEventListener('mouseup', handleMouseUp);
	}

	function handleTouchStart(event: TouchEvent) {
		// Prevent pull-to-refresh behavior on mobile
		document.documentElement.style.overscrollBehavior = 'none';
		document.addEventListener('touchend', handleTouchEnd);

		dragging = true;
		initialY = event.touches[0].clientY;
		currentY = event.touches[0].clientY;
	}

	function handleTouchMove(event: TouchEvent) {
		if (dragging) {
			currentY =
				event.touches[0].clientY < initialY
					? initialY
					: Math.min(event.touches[0].clientY, initialY + RANGE);
		}
	}

	function handleTouchEnd(event?: TouchEvent) {
		if (currentY !== initialY) {
			const touch = event?.changedTouches?.[0];
			const x = touch?.clientX;
			const y = touch?.clientY;

			toggleTheme(x, y);
			dragging = false;
			currentY = 0;
			initialY = 0;
			playAudio();
		}

		// Re-enable pull-to-refresh behavior on mobile
		document.documentElement.style.overscrollBehavior = 'auto';
		document.removeEventListener('touchend', handleTouchEnd);
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleTheme();
			playAudio();
			clicked = true;
			setTimeout(() => (clicked = false), 250);
		}
	}
</script>

<button
	class="light-switch-button"
	style="transform: translateY({$pullY}px)"
	onmousedown={(e) => handleMouseDown(e)}
	onmousemove={(e) => handleMouseMove(e)}
	onmouseup={(e) => handleMouseUp()}
	onmouseout={() => handleMouseOut()}
	onblur={() => handleBlur()}
	ontouchstart={(e) => handleTouchStart(e)}
	ontouchmove={(e) => handleTouchMove(e)}
	ontouchend={() => handleTouchEnd()}
	onkeyup={(e) => handleKeyUp(e)}
	aria-label="Theme Toggle"
	tabindex="0"
>
	<audio bind:this={audioRef}>
		<source src="/audio/light-switch.m4a" type="audio/mp4" />
	</audio>
	<span class="visually-hidden">
		{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
	</span>
	<EdisonBulb {lightMode} />
</button>

<style>
	.light-switch-button {
		padding: 0 8px;
		background: none;
		border: none;
		position: relative;
		display: flex;
		align-items: center;
		transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.light-switch-button:hover {
		cursor: grab;
	}

	.light-switch-button:active {
		cursor: grabbing;
	}

	/* Enlarges target element (easier to click) */
	.light-switch-button::before {
		content: '';
		position: absolute;
		z-index: 0;
		top: 0px;
		left: -16px;
		right: -16px;
		bottom: -16px;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
