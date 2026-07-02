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
	let buttonEl: HTMLButtonElement | null = null;

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

	function toggleTheme() {
		if (!browser || !document.startViewTransition) {
			darkMode = !darkMode;
			return;
		}

		// Reveal from the bulb's glass (bottom portion of the SVG)
		const w = window.innerWidth;
		const h = window.innerHeight;
		let x = w - 50;
		let y = 30;
		if (buttonEl) {
			const rect = buttonEl.getBoundingClientRect();
			x = rect.left + rect.width / 2;
			y = rect.top + rect.height * 0.8;
		}

		const transition = document.startViewTransition(() => {
			darkMode = !darkMode;
		});

		// Use percentages so the coordinates can't be misscaled on zoomed or
		// high-DPI displays: circle() percentages resolve against the
		// pseudo-element's own box, unlike px in the snapshot coordinate space
		const xp = (x / w) * 100;
		const yp = (y / h) * 100;
		const maxRadius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
		const rp = (maxRadius / (Math.hypot(w, h) / Math.SQRT2)) * 100;

		transition.ready.then(() => {
			document.documentElement.animate(
				{
					clipPath: [`circle(0% at ${xp}% ${yp}%)`, `circle(${rp}% at ${xp}% ${yp}%)`]
				},
				{
					duration: 500,
					easing: 'ease-in',
					pseudoElement: '::view-transition-new(root)'
				}
			);
		});
	}

	function handleMouseUp() {
		dragging = false;

		toggleTheme();
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

	function handleTouchEnd() {
		if (currentY !== initialY) {
			toggleTheme();
			dragging = false;
			currentY = 0;
			initialY = 0;
			playAudio();
		}

		// Re-enable pull-to-refresh behavior on mobile
		document.documentElement.style.overscrollBehavior = 'auto';
		document.removeEventListener('touchend', handleTouchEnd);
	}

	function handleTouchCancel() {
		dragging = false;
		currentY = 0;
		initialY = 0;
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
	bind:this={buttonEl}
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
	ontouchcancel={() => handleTouchCancel()}
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
		/* Keep the browser from claiming vertical drags as scroll gestures,
		   which cancels the touch before touchend can toggle the theme */
		touch-action: none;
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
