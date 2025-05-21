<script lang="ts">
	import { page } from '$app/state';

	type NavItem = {
		href: string;
		label: string;
	};

	let isMenuOpen = $state(false);

	const navItems: NavItem[] = [
		{ href: '/code', label: 'Code' },
		{ href: '/research', label: 'Research' },
		{ href: '/music', label: 'Music' },
		{ href: '/photos', label: 'Photos' },
		{ href: '/blog', label: 'Blog' }
	];

	// Derived state to check active route
	let currentPath = $derived(page.url.pathname);

	// Function to toggle mobile menu
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Effect to close menu when route changes
	$effect(() => {
		// Reset menu when navigating
		currentPath;
		isMenuOpen = false;
	});
</script>

<nav class="sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-300">
	<div class="mx-auto flex max-w-7xl items-center justify-between p-4">
		<span class="flex items-center gap-4">
			<img src="/favicon.ico" alt="Logo" class="h-9 w-9" />
			<a href="/">
				<span class="font-ibm-plex-serif nav-underline text-2xl tracking-wider"
					>Arihant's Corner</span
				>
			</a>
		</span>

		<!-- Desktop Navigation -->
		<div class="hidden md:block">
			<ul class="flex items-center gap-6">
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							class="nav-underline font-mono text-gray-600 uppercase transition-colors hover:text-black"
							aria-current={currentPath === item.href ? 'page' : undefined}
							aria-label={item.label}
							class:font-semibold={currentPath === item.href}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Mobile Menu Button -->
		<button
			onclick={toggleMenu}
			class="flex h-10 w-10 items-center justify-center rounded-md focus:outline-none md:hidden"
			aria-label="Toggle menu"
			aria-expanded={isMenuOpen}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
				/>
			</svg>
		</button>
	</div>

	<!-- Mobile Navigation (shows/hides based on isMenuOpen state) -->
	{#if isMenuOpen}
		<div
			class="absolute top-full right-0 left-0 z-20 border-t bg-white pt-2 pb-4 shadow-lg md:hidden"
		>
			<ul class="flex flex-col space-y-2 px-4">
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							class="nav-underline block py-2 font-mono text-gray-600 uppercase transition-colors hover:text-black"
							aria-current={currentPath === item.href ? 'page' : undefined}
							aria-label={item.label}
							class:font-semibold={currentPath === item.href}
							class:text-black={currentPath === item.href}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</nav>
